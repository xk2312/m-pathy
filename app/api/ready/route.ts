// app/api/ready/route.ts
import { NextResponse } from "next/server";

// - Helper: Timeout als Promise
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

// DB-Check (lazy import, toleriert fehlende Typen)
async function checkDB(timeoutMs = 2000) {
  const url =
    process.env.DATABASE_URL ||
    process.env.NEON_DB_URL ||
    process.env.POSTGRES_URL ||
    "";

  if (!url) throw new Error("DATABASE_URL missing");
  const { Client } = await import("pg");

  const client = new Client({
    connectionString: url,
    ssl: /amazonaws|neon|azure/i.test(url) ? { rejectUnauthorized: false } : undefined,
  });

  const task = (async () => {
    await client.connect();
    const res = await client.query("SELECT 1 AS ok");
    await client.end().catch(() => {});
    if (!res?.rows?.[0]?.ok) throw new Error("DB probe failed");
    return true;
  })();

  return withTimeout(task, timeoutMs, "db");
}

// Stripe-Konfigurations-Check (ENV-basiert, kein Netzwerk-Call)
async function checkStripeConfig(timeoutMs = 2000) {
  const task = (async () => {
    const secret = process.env.STRIPE_SECRET_KEY || "";
    const priceId = process.env.STRIPE_PRICE_1M || "";
    const webhook = process.env.STRIPE_WEBHOOK_SECRET || "";

    if (!secret) throw new Error("STRIPE_SECRET_KEY missing");
    if (!priceId) throw new Error("STRIPE_PRICE_1M missing");
    if (!webhook) throw new Error("STRIPE_WEBHOOK_SECRET missing");

    return true;
  })();

  return withTimeout(task, timeoutMs, "stripe");
}

// Resend-Konfigurations-Check (ENV-basiert)
async function checkResendConfig(timeoutMs = 2000) {
  const task = (async () => {
    const apiKey = process.env.RESEND_API_KEY || "";
    const from =
      process.env.RESEND_FROM_EMAIL ||
      process.env.EMAIL_FROM ||
      "";

    if (!apiKey) throw new Error("RESEND_API_KEY missing");
    if (!from) throw new Error("RESEND_FROM_EMAIL/EMAIL_FROM missing");

    return true;
  })();

  return withTimeout(task, timeoutMs, "resend");
}

// Core-Konfigurations-Check (Magic-Link, BASE_URL, Stripe-Price)
async function checkCoreConfig() {
  const missing: string[] = [];

  if (!process.env.MAGIC_LINK_SECRET) missing.push("MAGIC_LINK_SECRET");
  if (!process.env.NEXT_PUBLIC_BASE_URL) missing.push("NEXT_PUBLIC_BASE_URL");
  if (!process.env.STRIPE_PRICE_1M) missing.push("STRIPE_PRICE_1M");
  if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_1M) {
    missing.push("NEXT_PUBLIC_STRIPE_PRICE_1M");
  }

  return {
    ok: missing.length === 0,
    missing,
  };
}

type CheckResult = {
  ok: boolean;
  error?: string;
  missing?: string[];
};

export async function GET(req: Request) {
  // Timeout aus Query lesen (ms) – robust, vermeidet req.nextUrl Fehler
  const url = new URL(req.url);
  const timeoutMs = Number(url.searchParams.get("timeout_ms") ?? "2000");

  const results: Record<string, CheckResult> = {
    db: { ok: false },
    stripe: { ok: false },
    resend: { ok: false },
    config: { ok: false },
  };

  try {
    await checkDB(timeoutMs);
    results.db.ok = true;
  } catch (e: any) {
    results.db = { ok: false, error: e?.message || String(e) };
  }

  try {
    await checkStripeConfig(timeoutMs);
    results.stripe.ok = true;
  } catch (e: any) {
    results.stripe = { ok: false, error: e?.message || String(e) };
  }

  try {
    await checkResendConfig(timeoutMs);
    results.resend.ok = true;
  } catch (e: any) {
    results.resend = { ok: false, error: e?.message || String(e) };
  }

  try {
    const core = await checkCoreConfig();
    results.config.ok = core.ok;
    if (!core.ok) {
      results.config.missing = core.missing;
    }
  } catch (e: any) {
    results.config = { ok: false, error: e?.message || String(e) };
  }

  const allOk = results.db.ok && results.stripe.ok && results.resend.ok && results.config.ok;
  const status = allOk ? 200 : 503;

  return NextResponse.json(
    {
      ready: allOk,
      checks: results,
    },
    { status },
  );
}

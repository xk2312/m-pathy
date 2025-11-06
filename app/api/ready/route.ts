// app/api/ready/route.ts
import { NextResponse } from "next/server";

// — Helper: Timeout als Promise
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
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

// SMTP-Check (lazy import, toleriert fehlende Typen)
async function checkSMTP(timeoutMs = 2000) {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || "";
  if (!host) throw new Error("SMTP_HOST/EMAIL_HOST missing");

  // @ts-expect-error – nodemailer Typen sind optional
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587),
    secure: String(process.env.SMTP_SECURE || process.env.EMAIL_SECURE || "false") === "true",
    auth: (process.env.SMTP_USER || process.env.EMAIL_USER) && (process.env.SMTP_PASS || process.env.EMAIL_PASS)
      ? { user: process.env.SMTP_USER || process.env.EMAIL_USER, pass: process.env.SMTP_PASS || process.env.EMAIL_PASS }
      : undefined,
  });

  const task = transporter.verify();
  await withTimeout(task, timeoutMs, "smtp");
  return true;
}

export async function GET(req: Request) {
  // Timeout aus Query lesen (ms) – robust, vermeidet req.nextUrl Fehler
  const url = new URL(req.url);
  const timeoutMs = Number(url.searchParams.get("timeout_ms") ?? "2000");

  const results: Record<string, { ok: boolean; error?: string }> = {
    db: { ok: false },
    smtp: { ok: false },
  };

  try { await checkDB(timeoutMs); results.db.ok = true; } catch (e: any) { results.db = { ok: false, error: e?.message || String(e) }; }
  try { await checkSMTP(timeoutMs); results.smtp.ok = true; } catch (e: any) { results.smtp = { ok: false, error: e?.message || String(e) }; }

  const allOk = results.db.ok && results.smtp.ok;
  const status = allOk ? 200 : 503;
  return NextResponse.json({ ready: allOk, ...results }, { status });
}

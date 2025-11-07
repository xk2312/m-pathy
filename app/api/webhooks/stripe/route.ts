// app/api/webhooks/stripe/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPool } from "@/lib/ledger"; // nur für Pool, nicht für Credit – wir nutzen DB-Funktionen direkt

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!_stripe) {
    if (!key) throw new Error("STRIPE_SECRET_KEY missing");
    _stripe = new Stripe(key, { apiVersion: "2025-10-29.clover" as Stripe.LatestApiVersion });
  }
  return _stripe;
}

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} missing`);
  return v;
}

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  const whSecret = env("STRIPE_WEBHOOK_SECRET");

  let event: Stripe.Event;

  // rohen Body holen, NICHT req.json()
    const rawBody = await req.text();

  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig || "", whSecret);
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, status: "invalid_signature", message: String(err?.message || err) },

      { status: 400 }
    );
  }

  // Idempotenzsperre + optional Credit
  const pool = await getPool();
  const client = await pool.connect();
  try {
       await client.query("BEGIN");

    // idempotenter Insert (einziges Gate)
    await client.query(
      "INSERT INTO webhook_events (event_id, event_type, payload) VALUES ($1, $2, $3::jsonb)",
      [event.id, event.type, JSON.stringify(event)]
    );

    // Standard-Flags
        let credited = false;
    let creditAmount = 0;
    let debited  = false;
    let debitAmount = 0;
    let status: "credited" | "failed" | "refunded" | "subscription_update" | "recorded" | "ignored" = "recorded";

    // 1) Kauf abgeschlossen → Credit (bereits vorhanden)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;


      // user_id aus metadata (erwartet Zahl als String)
      const meta = (session.metadata || {}) as Record<string, string>;
      const userIdStr = meta.user_id || meta.userId || "";
      const userId = Number.parseInt(userIdStr, 10);

      // tokens über metadata.amount_tokens oder Preis-Mapping
      const metaTokens = Number.parseInt(meta.amount_tokens || meta.tokens || "", 10);
      const priceId = (session?.line_items?.data?.[0]?.price?.id) || (session as any).price?.id || meta.price_id || "";
      const price1M = process.env.NEXT_PUBLIC_STRIPE_PRICE_1M || process.env.STRIPE_PRICE_1M || "";

      if (Number.isFinite(userId) && userId > 0) {
        if (Number.isFinite(metaTokens) && metaTokens > 0) {
          creditAmount = metaTokens;
        } else if (priceId && price1M && priceId === price1M) {
          creditAmount = 1_000_000;
        } else {
          creditAmount = 1_000_000; // konservatives Fallback für unsere 1M-Preislogik
        }

        // ledger_credit ausführen (einmalig in dieser TX)
        const q = await client.query(
          "SELECT ledger_credit($1::bigint, $2::bigint) AS balance",
          [userId, creditAmount]
        );

        // Purchase loggen (idempotent per stripe_session_id unique, falls vorhanden)
        const sessId = session.id || null;
        if (sessId) {
          await client.query(
            `INSERT INTO purchases (user_id, amount_tokens, stripe_session_id)
             VALUES ($1, $2, $3)
             ON CONFLICT (stripe_session_id) DO NOTHING`,
            [userId, creditAmount, sessId]
          );
        }

                credited = true;
        status = "credited";
      }
    }

    // 2) Zahlung fehlgeschlagen → nur dokumentieren (kein Ledger)
    else if (event.type === "invoice.payment_failed") {
      status = "failed";
      // Optional: Hier könnte man ein Fail-Log in purchases ergänzen, falls Schema das vorsieht.
    }

    // 3) Charge vollständig/teilweise erstattet
    else if (event.type === "charge.refunded" || event.type === "charge.refund.updated") {
      const charge = event.data.object as Stripe.Charge;
      const meta   = (charge.metadata || {}) as Record<string, string>;

      // Token-Ermittlung: bevorzugt 'amount_tokens_refund' oder 'amount_tokens'
      const tokensMeta =
        Number.parseInt(meta.amount_tokens_refund || meta.amount_tokens || "", 10);

      if (Number.isFinite(tokensMeta) && tokensMeta > 0 && meta.user_id) {
        const userId = Number.parseInt(meta.user_id, 10);
        if (Number.isFinite(userId) && userId > 0) {
          const res = await client.query(
            "SELECT ledger_debit($1::bigint, $2::bigint) AS balance",
            [userId, tokensMeta]
          );
          debitAmount = tokensMeta;
          debited = true;
        }
      }
      status = "refunded";
    }

    // 4) Subscriptions (create/delete) → nur dokumentieren (kein Ledger)
       else if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.updated"
    ) {
      status = "subscription_update";
    }
    // 5) Unbekannte Events → ignorieren, aber sauber quittieren
    else {
      status = "ignored";
    }

    await client.query("COMMIT");
    return NextResponse.json(
      {
        ok: true,
        status,
        credited,
        credit_amount: creditAmount,
        debited,
        debit_amount: debitAmount,
        event_id: event.id,
        type: event.type,
      },
      { status: 200 }
    );


    } catch (e: any) {
    // duplicate key (idempotent): event schon verbucht
    if (String(e?.message || "").includes("duplicate key") || String(e?.code || "") === "23505") {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { ok: true, status: "duplicate", event_id: event.id, type: event.type },
        { status: 200 }
      );
    }
    // Serialization Failure (z. B. Deadlock / 40001) → weiches Retry-Signal
    if (
      String(e?.code || "") === "40001" ||
      /serialization failure/i.test(String(e?.message || ""))
    ) {
      await client.query("ROLLBACK").catch(() => {});
      return NextResponse.json(
        { ok: true, status: "retry", message: "serialization_failure" },
        { status: 200 }
      );
    }
    try { await client.query("ROLLBACK"); } catch {}
    return NextResponse.json(
      { ok: false, status: "error", message: String(e?.message || e) },
      { status: 500 }
    );
  } finally {

    client.release();
  }
}

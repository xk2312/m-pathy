// app/api/buy/checkout-session/route.ts
import Stripe from "stripe";
import dotenv from "dotenv";

// ENV laden (Dev: .env.payment, Prod: Deploy-Path)
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "/srv/app/current/.env.production" });
} else {
  dotenv.config({ path: ".env.payment" });
}

function env(name: string, fallback?: string) {

  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

// Lazy init (zur Request-Zeit)
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing env STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2025-10-29.clover" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // optionaler body.priceId, sonst ENV-Fallback:
    const priceId: string | undefined =
      body?.priceId || process.env.STRIPE_PRICE_1M || process.env.NEXT_PUBLIC_STRIPE_PRICE_1M;

    const quantity: number = Number(body?.quantity ?? 1);
    const mode: "payment" = "payment";

    const base = env("STAGING_BASE_URL", env("APP_BASE_URL", "https://m-pathy.ai"));
    
    // === GC Step 6 – Golden Return URLs ======================================
    // Erfolgreiche Zahlung → Chat mit Flag, sodass GC Step 9 greifen kann.
    const successUrl: string = `${base}/chat?paid=1`;
    // Nutzer bricht Kauf ab → zurück in Chat (sanft), optional für spätere UX.
    const cancelUrl: string = `${base}/chat?cancel=1`;
    // ==========================================================================

    if (!priceId || !priceId.startsWith("price_")) {
      return new Response(JSON.stringify({ error: "priceId required" }), {
        status: 400, headers: { "content-type": "application/json" },
      });

    }
    if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
      return new Response(JSON.stringify({ error: "Stripe not configured" }), {
        status: 500, headers: { "content-type": "application/json" },
      });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    const detail = typeof err?.message === "string" ? err.message.slice(0, 500) : "internal_error";
    return new Response(JSON.stringify({ error: detail }), {
      status: 500, headers: { "content-type": "application/json" },
    });
  }
}

// payment-core/api/stripeAdapter.ts
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
// Stripe v19.x Typen verlangen den aktuellen Literal-String:
export const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-10-29.clover" });


// === Create Checkout Session ===
export async function createCheckoutSession(userId: number, priceId: string) {
  return await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: undefined, // optional: can be linked via auth later
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.BASE_URL}/success`,
    cancel_url: `${process.env.BASE_URL}/cancel`,
    metadata: { user_id: userId.toString() },
  });
}

// === Verify Webhook Signature ===
export function verifyStripeSignature(rawBody: Buffer, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (err) {
    console.error("⚠️ Stripe signature verification failed:", err);
    return null;
  }
}

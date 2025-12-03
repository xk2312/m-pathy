// app/auth/magic-link/route.ts
import { NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/auth";

// Optional: Resend nur laden, wenn ein API-Key existiert
let resend: { emails: { send: (args: any) => Promise<any> } } | null = null;
console.log("[magic-link] RESEND_API_KEY present?", !!process.env.RESEND_API_KEY);

async function getResendClient() {
  if (resend) return resend;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[magic-link] RESEND_API_KEY fehlt – Magic-Link wird NICHT gemailt, nur geloggt.",
    );
    return null;
  }

  const { Resend } = await import("resend");
  resend = new Resend(apiKey) as any;
  return resend;
}

// POST /auth/magic-link
// Erwartet JSON { email: string }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email =
    body && typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Missing email" },
      { status: 400 },
    );
  }

  const token = createMagicLinkToken(email);

  const base =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.MAGIC_LINK_BASE_URL || "";
  const baseUrl = base.replace(/\/+$/, "");
  const callbackPath = `/auth/callback?token=${encodeURIComponent(token)}`;
  const callbackUrl = baseUrl ? `${baseUrl}${callbackPath}` : callbackPath;

  // 1) Immer ins Log schreiben (Debug / Fallback)
  console.log("[magic-link] login link generated", { email, callbackUrl });

  // 2) Versuchen, via Resend zu mailen (falls konfiguriert)
  try {
    const client = await getResendClient();
    if (client) {
      const from =
        process.env.RESEND_FROM_EMAIL || "login@mail.m-pathy.ai"; // deine Absender-Adresse
      const subject = "Dein m-pathy Login-Link";
      const text = `Hallo,

hier ist dein Login-Link für m-pathy:

${callbackUrl}

Der Link ist nur für kurze Zeit gültig. Wenn du diese Mail nicht erwartet hast, kannst du sie ignorieren.

Liebe Grüße
m-pathy`;

      await client.emails.send({
        from,
        to: email,
        subject,
        text,
      });

      console.log("[magic-link] email sent via Resend", { to: email });
    }
  } catch (err) {
    console.error("[magic-link] Resend send failed", err);
    // Flow für den User bleibt trotzdem ok – er bekommt den Link im JSON.
  }

  // 3) DEV/Debug: Magic-Link in der Response zurückgeben
  return NextResponse.json({ ok: true, magicUrl: callbackUrl });
}


import { NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/auth";
import { dict as linkmailDict } from "@/lib/i18n.linkmail";
import { Resend } from "resend";

export const runtime = "nodejs";

// Resend-Client (nutzt deinen API-Key aus .env.payment)
const resend = new Resend(process.env.RESEND_API_KEY || "");

// Absender-Adresse aus ENV (deine Domain ist verifiziert)
const FROM_EMAIL =
  process.env.MAGIC_LINK_FROM_EMAIL || "login@m-pathy.ai";
const FROM_NAME = "m-pathy.ai Login";

// -------------------------
// TYPE
// -------------------------
type SendMagicLinkEmailInput = {
  to: string;
  subject: string;
  headline: string;
  bodyMain: string;
  bodyFallback: string;
  bodySecurity: string;
  buttonLabel: string;
  footer: string;
  callbackUrl: string;
};

// -------------------------
// SEND EMAIL (Resend API)
// -------------------------
async function sendMagicLinkEmail(input: SendMagicLinkEmailInput) {
  const {
    to,
    subject,
    headline,
    bodyMain,
    bodyFallback,
    bodySecurity,
    buttonLabel,
    footer,
    callbackUrl,
  } = input;

  // HTML-Mail – i18n-gesteuert
  const html = `
    <p>${headline}</p>
    <p>${bodyMain}</p>
    <p><a href="${callbackUrl}">${buttonLabel}</a></p>
    <p>${bodyFallback}</p>
    <p>${bodySecurity}</p>
    <p>${footer}</p>
  `;

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[magic-link] Resend send error:", error);
  }
}

// -------------------------
// POST /auth/magic-link
// -------------------------
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email =
    body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Missing email" },
      { status: 400 },
    );
  }

  // Token erzeugen
  const token = createMagicLinkToken(email);

  // Callback-URL
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.MAGIC_LINK_BASE_URL || "";
  const baseUrl = base.replace(/\/+$/, "");
  const callbackPath = `/auth/callback?token=${encodeURIComponent(token)}`;
  const callbackUrl = baseUrl ? `${baseUrl}${callbackPath}` : callbackPath;

  // Sprache laden (vorerst EN)
  const locale = linkmailDict.en;
  const mail = locale.linkmail;

  try {
    await sendMagicLinkEmail({
      to: email,
      subject: mail.subject,
      headline: mail.headline,
      bodyMain: mail.body.main,
      bodyFallback: mail.body.fallback,
      bodySecurity: mail.body.security,
      buttonLabel: mail.button.label,
      footer: mail.footer,
      callbackUrl,
    });
  } catch (error) {
    console.error("[magic-link] failed to send email", error);
  }

  console.log("[magic-link] login link generated", { email, callbackUrl });

  return NextResponse.json({ ok: true, magicUrl: callbackUrl });
}

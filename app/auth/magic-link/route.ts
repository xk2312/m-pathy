import { NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/auth";
import { dict as linkmailDict } from "@/lib/i18n.linkmail";
import { Resend } from "resend";


// POST /auth/magic-link
// Erwartet JSON { email: string }
// Erzeugt Magic-Link-Token und versendet einen Magic-Link per E-Mail.
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

  // Sprache: vorerst immer EN als Master, später können wir hier
  // Locale aus Cookie/Request einklinken.
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
    // E-Mail-Versand darf den Login-Flow nicht hart killen.
    console.error("[magic-link] failed to send email", error);
  }

  console.log("[magic-link] login link generated", { email, callbackUrl });

  // DEV-Convenience: Magic-Link auch in der Response zurückgeben,
  // damit er im Network-Tab sichtbar ist. Für echtes Live-Setup
  // kann das später wieder entfernt oder über ein Flag geschützt werden.
  return NextResponse.json({ ok: true, magicUrl: callbackUrl });
}

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

  // Fallbacks für Env
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY missing");
  }

  const fromEmail =
    process.env.MAGIC_LINK_FROM_EMAIL ||
    process.env.SMTP_FROM ||
    "login@m-pathy.ai";

  // Plain-Text-Version (für Clients ohne HTML)
  const lines: string[] = [
    headline,
    "",
    bodyMain,
    "",
    bodyFallback,
    callbackUrl,
    "",
    bodySecurity,
    "",
    `${buttonLabel}: ${callbackUrl}`,
    "",
    footer,
  ];
  const text = lines.join("\n");

  // Einfache HTML-Version
  const htmlLines: string[] = [
    `<p>${headline}</p>`,
    `<p>${bodyMain}</p>`,
    `<p>${bodyFallback}</p>`,
    `<p><a href="${callbackUrl}" target="_blank" rel="noopener noreferrer">${buttonLabel}</a></p>`,
    `<p>${bodySecurity}</p>`,
    `<p>${footer}</p>`,
  ];
  const html = htmlLines.join("");

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: `m-pathy.ai Login <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  });
}

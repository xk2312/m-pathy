// app/auth/magic-link/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { createMagicLinkToken } from "@/lib/auth";
import { dict as linkmailDict } from "@/lib/i18n.linkmail";

// Wir lesen den Key nur als String ein – die eigentliche Resend-Instanz
// wird erst in sendMagicLinkEmail gebaut, damit der Build nicht crasht.
const RESEND_API_KEY =
  process.env.RESEND_API_KEY || process.env.RESEND_API_KEY_STAGING || "";

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

  // Sprache: vorerst immer EN als Master, später koppeln wir das an die echte Locale.
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
  // damit er im Network-Tab sichtbar ist.
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

  // Gleiche Textstruktur wie vorher bei nodemailer
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

  if (!RESEND_API_KEY) {
    console.warn(
      "[magic-link] RESEND_API_KEY missing – skipping email send (login flow continues).",
    );
    return;
  }

  const resend = new Resend(RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.MAGIC_LINK_FROM || "login@mail.m-pathy.ai",
    to,
    subject,
    text,
  });
}

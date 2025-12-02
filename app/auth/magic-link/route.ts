import { NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/auth";
import { dict as linkmailDict } from "@/lib/i18n.linkmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

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

  // Sprache → vorerst EN als Master
  const locale = linkmailDict.en;
  const mail = locale.linkmail;

  try {
    await resend.emails.send({
      from: "m-pathy.ai Login <login@m-pathy.ai>",
      to: email,
      subject: mail.subject,
      text: [
        mail.headline,
        "",
        mail.body.main,
        "",
        mail.body.fallback,
        callbackUrl,
        "",
        mail.body.security,
        "",
        `${mail.button.label}: ${callbackUrl}`,
        "",
        mail.footer,
      ].join("\n"),
    });
  } catch (error) {
    console.error("[magic-link] resend email error:", error);
  }

  return NextResponse.json({ ok: true, magicUrl: callbackUrl });
}

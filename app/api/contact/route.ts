import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message_type,
      message,
      email,
      company,
      role,
      source,
      captcha_token,
    } = body || {};

    if (
      !message_type ||
      !message ||
      !email ||
      !source ||
      !captcha_token
    ) {
      return NextResponse.json(
        { error: "invalid_payload" },
        { status: 400 }
      );
    }

    // 🔽 Lazy imports (CRITICAL)
    const { verifyTurnstileToken } = await import("@/lib/turnstile");
    const { sendContactMail } = await import("@/lib/mail");
    const { insertContactMessage } = await import("@/lib/db");

    const captchaValid = await verifyTurnstileToken(captcha_token);
    if (!captchaValid) {
      return NextResponse.json(
        { error: "captcha_failed" },
        { status: 400 }
      );
    }

    await sendContactMail({
      message_type,
      message,
      email,
      company,
      role,
      source,
    });

    // best effort DB
    insertContactMessage({
      message_type,
      message,
      email,
      company,
      role,
      source,
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
  console.error("contact route failed", err);
  return NextResponse.json(
    {
      error: "internal_error",
      message: err instanceof Error ? err.message : "unknown",
    },
    { status: 500 }
  );
}

}

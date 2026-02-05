import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any;

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
    } else {
      return NextResponse.json(
        { error: "unsupported_content_type" },
        { status: 415 }
      );
    }

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

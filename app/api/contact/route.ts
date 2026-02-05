import { NextResponse } from "next/server";
import { sendContactMail } from "@/lib/mail";
import { insertContactMessage } from "@/lib/db";
import { verifyTurnstileToken } from "@/lib/turnstile";

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

    const captchaValid = await verifyTurnstileToken(captcha_token);
    if (!captchaValid) {
      return NextResponse.json(
        { error: "captcha_failed" },
        { status: 400 }
      );
    }

    // Mail ist HARD REQUIREMENT
    await sendContactMail({
      message_type,
      message,
      email,
      company,
      role,
      source,
    });

    // DB ist best-effort
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
      { error: "internal_error" },
      { status: 500 }
    );
  }
}

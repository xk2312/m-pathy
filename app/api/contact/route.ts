import { NextResponse } from "next/server";
import { sendContactMail } from "@/lib/mail";
import { insertContactMessage } from "@/lib/db";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (req.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "unsupported_content_type" },
        { status: 415 }
      );
    }

    const body = await req.json();

    const {
      message_type,
      message,
      email,
      company = null,
      role = null,
      source,
      captcha_token,
    } = body || {};

    // minimal validation
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

    // captcha hard gate
    const captchaValid = await verifyTurnstileToken(captcha_token);
    if (!captchaValid) {
      return NextResponse.json(
        { error: "captcha_failed" },
        { status: 400 }
      );
    }

    // primary channel: mail must succeed
    try {
      await sendContactMail({
        message_type,
        message,
        email,
        company,
        role,
        source,
      });
    } catch (mailErr) {
      console.error("contact mail failed", mailErr);
      return NextResponse.json(
        { error: "mail_failed" },
        { status: 500 }
      );
    }

    // secondary channel: db best effort
    try {
      insertContactMessage({
        message_type,
        message,
        email,
        company,
        role,
        source,
      });
    } catch (dbErr) {
      console.warn("contact db insert failed", dbErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route crashed", err);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}

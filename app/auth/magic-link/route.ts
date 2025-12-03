// app/auth/magic-link/route.ts
import { NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/auth";
import { dict as linkmailDict } from "@/lib/i18n.linkmail";

// =======================
// GLOBAL LOGGING HEADER
// =======================
console.log("=== [magic-link] ROUTE INIT ===");
console.log("[magic-link] ENV DETECT", {
  HAS_RESEND_KEY: !!process.env.RESEND_API_KEY,
  HAS_FROM_EMAIL: !!process.env.RESEND_FROM_EMAIL,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  MAGIC_LINK_BASE_URL: process.env.MAGIC_LINK_BASE_URL,
});

// Optional: Resend nur laden, wenn ein API-Key existiert
let resend: { emails: { send: (args: any) => Promise<any> } } | null = null;

async function getResendClient() {
  console.log("=== [magic-link] getResendClient() called ===");
  console.log("[magic-link] Checking RESEND_API_KEY:", !!process.env.RESEND_API_KEY);

  if (resend) {
    console.log("[magic-link] Using cached Resend client");
    return resend;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[magic-link] FATAL: RESEND_API_KEY fehlt – Magic-Link wird NICHT gesendet!",
    );
    return null;
  }

  try {
    console.log("[magic-link] Importing Resend client...");
    const { Resend } = await import("resend");
    resend = new Resend(apiKey) as any;
    console.log("[magic-link] Resend client created successfully");
  } catch (err) {
    console.error("[magic-link] ERROR creating Resend client:", err);
    return null;
  }

  return resend;
}

// POST /auth/magic-link
export async function POST(req: Request) {
  console.log("=== [magic-link] POST /auth/magic-link START ===");
  console.log("[magic-link] RAW request received");

  const body = await req.json().catch((err) => {
    console.error("[magic-link] ERROR parsing JSON body:", err);
    return null;
  });

  console.log("[magic-link] Parsed body:", body);

  const email =
    body && typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

   const langRaw =
    body && typeof body.lang === "string" ? body.lang.trim().toLowerCase() : "";
  const langKey = linkmailDict[langRaw as keyof typeof linkmailDict]
    ? (langRaw as keyof typeof linkmailDict)
    : "en";

  // ⬇︎ NEU: direkt auf das innere linkmail-Objekt zeigen
  const mailLocale =
    linkmailDict[langKey as keyof typeof linkmailDict]?.linkmail ??
    linkmailDict.en.linkmail;

  console.log("[magic-link] Extracted email:", email);
  console.log("[magic-link] Using mail locale:", langKey);


  if (!email) {
    console.warn("[magic-link] ERROR: Missing email");
    return NextResponse.json(
      { ok: false, error: "Missing email" },
      { status: 400 },
    );
  }

  const token = createMagicLinkToken(email);
  console.log("[magic-link] Token generated:", token);


  const base =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.MAGIC_LINK_BASE_URL || "";
  console.log("[magic-link] Base URL raw:", base);

  const baseUrl = base.replace(/\/+$/, "");
  console.log("[magic-link] Base URL normalized:", baseUrl);

  const callbackPath = `/auth/callback?token=${encodeURIComponent(token)}`;
  const callbackUrl = baseUrl ? `${baseUrl}${callbackPath}` : callbackPath;

  console.log("[magic-link] Final callback URL:", callbackUrl);

  // ALWAYS LOG
  console.log("[magic-link] login link generated", { email, callbackUrl });

  // Try send mail
  let resendSendResult: any = null;
  let resendError: any = null;
  let resendClientStatus = "not-initialized";

  try {
    const client = await getResendClient();

    resendClientStatus = client ? "client-loaded" : "client-null";

    console.log("[magic-link] Resend client status:", resendClientStatus);

    if (client) {
      const from =
        process.env.RESEND_FROM_EMAIL || "login@mail.m-pathy.ai";

      const subject = mailLocale.subject;
      const text = `${mailLocale.headline}

${mailLocale.body.main}

${callbackUrl}

${mailLocale.body.fallback}

${mailLocale.body.security}

${mailLocale.footer}`;

      console.log("[magic-link] Sending mail with payload:", {
        from,
        to: email,
        subject,
        text_preview: text.slice(0, 80) + "...",
        locale: langKey,
      });


      try {
        resendSendResult = await client.emails.send({
          from,
          to: email,
          subject,
          text,
        });

        console.log("[magic-link] EMAIL SEND SUCCESS:", resendSendResult);
      } catch (err) {
        resendError = err;
        console.error("[magic-link] EMAIL SEND ERROR:", err);
      }
    } else {
      console.warn("[magic-link] Resend client is NULL → mail NOT sent.");
    }
  } catch (err) {
    resendError = err;
    console.error("[magic-link] Fatal resend flow error:", err);
  }

  console.log("=== [magic-link] POST /auth/magic-link END ===");

  return NextResponse.json({
    ok: true,
    magicUrl: callbackUrl,
    // DEBUG-FLAGS
    debug: {
      HAS_RESEND_KEY: !!process.env.RESEND_API_KEY,
      HAS_FROM_EMAIL: !!process.env.RESEND_FROM_EMAIL,
      resendClientStatus,
      resendSendResult,
      resendError: resendError ? String(resendError) : null,
    },
  });
}

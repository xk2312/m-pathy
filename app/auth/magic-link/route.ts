import { NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/auth";

// POST /auth/magic-link
// Erwartet JSON { email: string }
// Erzeugt Magic-Link-Token und (vorerst) logged den Link nur ins Log.
// Später: echten SMTP-Versand einbauen.
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
  const callbackUrl = baseUrl
    ? `${baseUrl}${callbackPath}`
    : callbackPath;

  // TODO: Echten Mailversand via SMTP ergänzen.
  console.log("[magic-link] login link generated", { email, callbackUrl });

  return NextResponse.json({ ok: true });
}

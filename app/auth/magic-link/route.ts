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

  // DEV-Convenience: Magic-Link auch in der Response zurückgeben,
  // damit er im Network-Tab sichtbar ist. Für echtes Live-Setup
  // kann das später wieder entfernt oder über ein Flag geschützt werden.
  return NextResponse.json({ ok: true, magicUrl: callbackUrl });
}


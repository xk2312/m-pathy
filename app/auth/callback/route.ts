import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifyMagicLinkToken,
} from "@/lib/auth";

// GET /auth/callback?token=...
// Prüft Magic-Link-Token, setzt Session-Cookie und leitet weiter.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";

  const origin = url.origin;
  const successPath =
    process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT || "/subscription?auth=ok";
  const errorPath =
    process.env.NEXT_PUBLIC_AUTH_ERROR_REDIRECT || "/subscription?auth=error";

  if (!token) {
    return NextResponse.redirect(new URL(errorPath, origin));
  }

  const payload = verifyMagicLinkToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL(errorPath, origin));
  }

  const sessionToken = createSessionToken(payload.email);

  const res = NextResponse.redirect(new URL(successPath, origin));
  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  });

  return res;
}

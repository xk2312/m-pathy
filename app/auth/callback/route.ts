// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifyMagicLinkToken,
} from "@/lib/auth";

// GET /auth/callback?token=...
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";

  // Basis-URL für Redirects (immer Staging-Domain bevorzugen)
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.MAGIC_LINK_BASE_URL ||
    process.env.STAGING_BASE_URL ||
    url.origin;

  const successPath =
    process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT || "/page2?auth=ok";
  const errorPath =
    process.env.NEXT_PUBLIC_AUTH_ERROR_REDIRECT || "/page2?auth=error";

  const toUrl = (path: string) => {
    try {
      return new URL(path, base);
    } catch {
      // Fallback: origin aus Request
      return new URL(path, url.origin);
    }
  };

  try {
    if (!token) {
      console.warn("[auth/callback] Missing token");
      return NextResponse.redirect(toUrl(errorPath));
    }

    const payload = verifyMagicLinkToken(token);
    if (!payload) {
      console.warn("[auth/callback] Invalid token (no payload)");
      return NextResponse.redirect(toUrl(errorPath));
    }

    const sessionToken = createSessionToken(payload.email);

    const res = NextResponse.redirect(toUrl(successPath));
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
  } catch (err) {
    console.error("[auth/callback] Unhandled error:", err);
    return NextResponse.redirect(toUrl(errorPath));
  }
}

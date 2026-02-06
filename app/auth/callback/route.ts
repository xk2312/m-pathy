// app/auth/callback/route.ts ❤️
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifyMagicLinkToken,
} from "@/lib/auth";
import { getPool } from "@/lib/ledger";

export const runtime = "nodejs";

// GET /auth/callback?token=...
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";

  console.log("[AUTH_CB] === CALLBACK HIT ===");
  console.log("[AUTH_CB] url", url.toString());
  console.log("[AUTH_CB] token present", !!token);
  console.log("[AUTH_CB] token preview", token ? token.slice(0, 16) : null);

  console.log("[AUTH_CB] env snapshot", {
    NODE_ENV: process.env.NODE_ENV,
    MAGIC_LINK_SECRET_present: !!process.env.MAGIC_LINK_SECRET,
    AUTH_SECRET_present: !!process.env.AUTH_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    MAGIC_LINK_BASE_URL: process.env.MAGIC_LINK_BASE_URL,
    NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT:
      process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT,
    NEXT_PUBLIC_AUTH_ERROR_REDIRECT:
      process.env.NEXT_PUBLIC_AUTH_ERROR_REDIRECT,
  });

  // Basis-URL für Redirects
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.MAGIC_LINK_BASE_URL ||
    url.origin;

  console.log("[AUTH_CB] resolved base url", base);

  const successPath =
    process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT || "/page2?auth=ok";
  const errorPath =
    process.env.NEXT_PUBLIC_AUTH_ERROR_REDIRECT || "/page2?auth=error";

  console.log("[AUTH_CB] redirect paths", {
    successPath,
    errorPath,
  });

  const toUrl = (path: string) => {
    try {
      const u = new URL(path, base);
      console.log("[AUTH_CB] resolved redirect url", u.toString());
      return u;
    } catch (e) {
      console.error("[AUTH_CB] redirect url build failed, fallback", {
        path,
        origin: url.origin,
        error: String(e),
      });
      return new URL(path, url.origin);
    }
  };

  try {
    if (!token) {
      console.warn("[AUTH_CB] Missing token");
      return NextResponse.redirect(toUrl(errorPath));
    }

    let payload: any;
    try {
      payload = verifyMagicLinkToken(token);
      console.log("[AUTH_CB] magic link payload", payload);
    } catch (e) {
      console.error("[AUTH_CB] verifyMagicLinkToken threw", e);
      return NextResponse.redirect(toUrl(errorPath));
    }

    if (!payload) {
      console.warn("[AUTH_CB] Invalid token (payload is null)");
      return NextResponse.redirect(toUrl(errorPath));
    }

    const email = String(payload.email || "").trim().toLowerCase();
    console.log("[AUTH_CB] extracted email", email);

    if (!email) {
      console.warn("[AUTH_CB] Payload without email");
      return NextResponse.redirect(toUrl(errorPath));
    }

    let userId: number | null = null;

    // === User-Provisioning ===
    try {
      const pool = await getPool();
      console.log("[AUTH_CB] DB pool acquired");

      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id as number;
        console.log("[AUTH_CB] existing user found", userId);
      } else {
        const insertedUser = await pool.query(
          "INSERT INTO users (email) VALUES ($1::citext) RETURNING id",
          [email]
        );
        userId = insertedUser.rows[0].id as number;
        console.log("[AUTH_CB] new user created", userId);
      }

      const existingBalance = await pool.query(
        "SELECT user_id FROM balances WHERE user_id = $1 LIMIT 1",
        [userId]
      );

      if (existingBalance.rows.length === 0) {
        await pool.query(
          "INSERT INTO balances (user_id, tokens_left) VALUES ($1, 0)",
          [userId]
        );
        console.log("[AUTH_CB] balance row created");
      } else {
        console.log("[AUTH_CB] balance row exists");
      }
    } catch (provisionErr) {
      console.error("[AUTH_CB] user provisioning failed", provisionErr);
      return NextResponse.redirect(toUrl(errorPath));
    }

    console.log("[AUTH_CB] issuing session token", {
      email,
      userId,
      AUTH_SECRET_present: !!process.env.AUTH_SECRET,
    });

    let sessionToken: string;
    try {
      sessionToken = createSessionToken(
        payload.email,
        userId ?? undefined
      );
      console.log("[AUTH_CB] session token created, length", sessionToken.length);
    } catch (e) {
      console.error("[AUTH_CB] createSessionToken failed", e);
      return NextResponse.redirect(toUrl(errorPath));
    }

    const res = NextResponse.redirect(toUrl(successPath));

    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    console.log("[AUTH_CB] auth cookie set", {
      name: AUTH_COOKIE_NAME,
      secure: process.env.NODE_ENV === "production",
      domain: res.headers.get("location"),
    });

    console.log("[AUTH_CB] === CALLBACK SUCCESS ===");
    return res;
  } catch (err) {
    console.error("[AUTH_CB] Unhandled error", err);
    return NextResponse.redirect(toUrl(errorPath));
  }
}

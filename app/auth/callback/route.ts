// app/auth/callback/route.ts ❤️ DEBUG VERSION
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
  console.log("[auth/callback] HIT");

  const url = new URL(req.url);
  console.log("[auth/callback] url =", url.toString());

  const token = url.searchParams.get("token") || "";
  console.log("[auth/callback] token present =", Boolean(token));

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.MAGIC_LINK_BASE_URL ||
    url.origin;

  console.log("[auth/callback] base url resolved =", base);
  console.log("[auth/callback] ENV SNAPSHOT", {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    MAGIC_LINK_BASE_URL: process.env.MAGIC_LINK_BASE_URL,
    MAGIC_LINK_SECRET_PRESENT: Boolean(process.env.MAGIC_LINK_SECRET),
    AUTH_SECRET_PRESENT: Boolean(process.env.AUTH_SECRET),
    AUTH_COOKIE_NAME,
  });

  const successPath =
    process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT || "/page2?auth=ok";
  const errorPath =
    process.env.NEXT_PUBLIC_AUTH_ERROR_REDIRECT || "/page2?auth=error";

  console.log("[auth/callback] successPath =", successPath);
  console.log("[auth/callback] errorPath =", errorPath);

  const toUrl = (path: string) => {
    try {
      const u = new URL(path, base);
      console.log("[auth/callback] redirect resolved =", u.toString());
      return u;
    } catch (err) {
      console.error("[auth/callback] redirect URL build failed", err);
      return new URL(path, url.origin);
    }
  };

  try {
    if (!token) {
      console.warn("[auth/callback] FAIL: missing token");
      return NextResponse.redirect(toUrl(errorPath));
    }

    console.log("[auth/callback] verifying magic link token");
    const payload = verifyMagicLinkToken(token);

    console.log("[auth/callback] token payload =", payload);

    if (!payload) {
      console.warn("[auth/callback] FAIL: invalid token payload");
      return NextResponse.redirect(toUrl(errorPath));
    }

    const email = String(payload.email || "").trim().toLowerCase();
    console.log("[auth/callback] email =", email);

    if (!email) {
      console.warn("[auth/callback] FAIL: empty email in payload");
      return NextResponse.redirect(toUrl(errorPath));
    }

    let userId: number | null = null;

    try {
      console.log("[auth/callback] connecting to DB");
      const pool = await getPool();

      console.log("[auth/callback] DB connected");

      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1",
        [email]
      );

      console.log(
        "[auth/callback] user lookup rows =",
        existingUser.rows.length
      );

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id as number;
      } else {
        const insertedUser = await pool.query(
          "INSERT INTO users (email) VALUES ($1::citext) RETURNING id",
          [email]
        );
        userId = insertedUser.rows[0].id as number;
        console.log("[auth/callback] user created id =", userId);
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
        console.log("[auth/callback] balance row created");
      } else {
        console.log("[auth/callback] balance row exists");
      }
    } catch (provisionErr) {
      console.error(
        "[auth/callback] FAIL: user provisioning error",
        provisionErr
      );
      return NextResponse.redirect(toUrl(errorPath));
    }

    console.log("[auth/callback] issuing session token", {
      email,
      userId,
    });

    const sessionToken = createSessionToken(email, userId ?? undefined);
    console.log(
      "[auth/callback] session token length =",
      sessionToken.length
    );

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

    console.log("[auth/callback] cookie set =", AUTH_COOKIE_NAME);

    return res;
  } catch (err) {
    console.error("[auth/callback] FATAL ERROR", err);
    return NextResponse.redirect(toUrl(errorPath));
  }
}

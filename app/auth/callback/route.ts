// app/auth/callback/route.ts ❤️ DEBUG BUILD
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifyMagicLinkToken,
} from "@/lib/auth";
import { getPool } from "@/lib/ledger";

export const runtime = "nodejs";

function log(step: string, data?: any) {
  try {
    console.log(`[auth/callback][${step}]`, data ?? "");
  } catch {}
}

// GET /auth/callback?token=...
export async function GET(req: Request) {
  log("ENTER", { url: req.url });

  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  log("TOKEN_EXTRACTED", { hasToken: !!token });

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.MAGIC_LINK_BASE_URL ||
    url.origin;

  log("BASE_URL_RESOLVED", {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    MAGIC_LINK_BASE_URL: process.env.MAGIC_LINK_BASE_URL,
    origin: url.origin,
    base,
  });

  const successPath =
    process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT || "/page2?auth=ok";
  const errorPath =
    process.env.NEXT_PUBLIC_AUTH_ERROR_REDIRECT || "/page2?auth=error";

  log("REDIRECT_PATHS", { successPath, errorPath });

  const toUrl = (path: string) => {
    try {
      return new URL(path, base);
    } catch (e) {
      log("URL_BUILD_FAILED", { path, error: String(e) });
      return new URL(path, url.origin);
    }
  };

  try {
    if (!token) {
      log("ABORT_NO_TOKEN");
      return NextResponse.redirect(toUrl(errorPath));
    }

    log("VERIFY_MAGIC_LINK_START");
    const payload = verifyMagicLinkToken(token);
    log("VERIFY_MAGIC_LINK_RESULT", payload);

    if (!payload) {
      log("ABORT_INVALID_TOKEN");
      return NextResponse.redirect(toUrl(errorPath));
    }

    const email = String(payload.email || "").trim().toLowerCase();
    log("EMAIL_PARSED", { email });

    if (!email) {
      log("ABORT_NO_EMAIL_IN_PAYLOAD", payload);
      return NextResponse.redirect(toUrl(errorPath));
    }

    let userId: number | null = null;

    try {
      log("DB_POOL_GET_START");
      const pool = await getPool();
      log("DB_POOL_GET_OK");

      log("DB_USER_LOOKUP_START", { email });
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1",
        [email]
      );
      log("DB_USER_LOOKUP_RESULT", existingUser.rows);

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id as number;
        log("USER_FOUND", { userId });
      } else {
        log("USER_CREATE_START");
        const insertedUser = await pool.query(
          "INSERT INTO users (email) VALUES ($1::citext) RETURNING id",
          [email]
        );
        userId = insertedUser.rows[0].id as number;
        log("USER_CREATED", { userId });
      }

      log("BALANCE_LOOKUP_START", { userId });
      const existingBalance = await pool.query(
        "SELECT user_id FROM balances WHERE user_id = $1 LIMIT 1",
        [userId]
      );
      log("BALANCE_LOOKUP_RESULT", existingBalance.rows);

      if (existingBalance.rows.length === 0) {
        log("BALANCE_CREATE_START");
        await pool.query(
          "INSERT INTO balances (user_id, tokens_left) VALUES ($1, 0)",
          [userId]
        );
        log("BALANCE_CREATED");
      }
    } catch (provisionErr) {
      log("ABORT_PROVISIONING_ERROR", String(provisionErr));
      return NextResponse.redirect(toUrl(errorPath));
    }

    log("SESSION_CREATE_START", {
      email,
      userId,
      AUTH_COOKIE_NAME,
      NODE_ENV: process.env.NODE_ENV,
    });

    const sessionToken = createSessionToken(
      payload.email,
      userId ?? undefined
    );

    log("SESSION_TOKEN_CREATED", {
      tokenLength: sessionToken?.length,
    });

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

    log("COOKIE_SET_AND_REDIRECT", {
      redirect: toUrl(successPath).toString(),
    });

    return res;
  } catch (err) {
    log("UNHANDLED_EXCEPTION", String(err));
    return NextResponse.redirect(toUrl(errorPath));
  }
}

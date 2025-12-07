// app/auth/callback/route.ts ❤️
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifyMagicLinkToken,
} from "@/lib/auth";
import { getPool } from "@/lib/ledger";

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

    const email = String(payload.email || "").trim().toLowerCase();
    if (!email) {
      console.warn("[auth/callback] Payload without email");
      return NextResponse.redirect(toUrl(errorPath));
    }

    let userId: number | null = null;

    // === User-Provisioning: Nutzer + Balance-Eintrag sicherstellen ======
    try {
      const pool = await getPool();

      // User suchen oder anlegen (citext-Kolumne)
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id as number;
      } else {
        const insertedUser = await pool.query(
          "INSERT INTO users (email) VALUES ($1::citext) RETURNING id",
          [email]
        );
        userId = insertedUser.rows[0].id as number;
      }


      // Balance-Record mit 0 Tokens sicherstellen
      const existingBalance = await pool.query(
        "SELECT user_id FROM balances WHERE user_id = $1 LIMIT 1",
        [userId]
      );

      if (existingBalance.rows.length === 0) {
        await pool.query(
          "INSERT INTO balances (user_id, tokens_left) VALUES ($1, 0)",
          [userId]
        );
      }
    } catch (provisionErr) {
      console.error("[auth/callback] user provisioning failed:", provisionErr);
      return NextResponse.redirect(toUrl(errorPath));
    }
    // ====================================================================

    // ====================================================================

    console.log("[auth/callback] issuing session", {
      email: payload.email,
      userId,
    });

    const sessionToken = createSessionToken(
      payload.email,
      userId ?? undefined
    );

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

// app/api/me/balance/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getBalance } from "@/lib/ledger";

export async function GET() {
  try {
    const store = cookies();
    const raw = store.get(AUTH_COOKIE_NAME)?.value;

    // Nicht eingeloggt → kein Fehler, nur "anonymous"
    if (!raw) {
      return NextResponse.json(
        {
          ok: true,
          authenticated: false,
          email: null,
          balance: null,
        },
        { status: 200 },
      );
    }

    const payload = verifySessionToken(raw);
    if (!payload || !payload.email) {
      return NextResponse.json(
        {
          ok: true,
          authenticated: false,
          email: null,
          balance: null,
        },
        { status: 200 },
      );
    }

    // Für Payment v1 nehmen wir die E-Mail direkt als User-ID im Ledger
    const userId = payload.email.trim().toLowerCase();

    const balance = await getBalance(userId);

    return NextResponse.json(
      {
        ok: true,
        authenticated: true,
        email: userId,
        balance,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[/api/me/balance] error", error);
    return NextResponse.json(
      {
        ok: false,
        authenticated: false,
        email: null,
        balance: null,
        error: "balance_unavailable",
      },
      { status: 500 },
    );
  }
}

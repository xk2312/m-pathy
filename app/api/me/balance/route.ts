/*** =======================================================================
 *  INVENTUS INDEX — app/api/me/balance/route.ts
 *  Token-Read Endpoint · Session → Ledger → AccountPanel
 * =======================================================================
 *
 *  [ANCHOR:0] IMPORTS & LAYER
 *    – NextResponse, cookies, AUTH_COOKIE_NAME, verifySessionToken, getBalance.
 *    – Brücke zwischen HTTP-Request, Auth-System und Ledger.
 *
 *  [ANCHOR:1] SESSION-EXTRACT
 *    – Liest AUTH_COOKIE_NAME aus den Request-Cookies.
 *    – Frühe Entscheidung: Gast (kein/invalid Cookie) vs. authentifizierter User.
 *
 *  [ANCHOR:2] UNAUTHENTICATED-PATH
 *    – Kein oder ungültiger Session-Token → ok:true, authenticated:false,
 *      email:null, balance:null (200).
 *    – UI interpretiert dies als „Gast / keine Balance-Daten“.
 *
 *  [ANCHOR:3] USER-ID-MAPPING (TOKEN HOTSPOT)
 *    – E-Mail wird normalisiert: email = payload.email.trim().toLowerCase().
 *    – userId = String(payload.id) nutzt die echte users.id als Ledger-Key.
 *    – Diese ID ist durch FK an users.id gebunden.
 *
 *  [ANCHOR:4] LEDGER-READ (TOKEN HOTSPOT)
 *    – getBalance(userId) liefert den tatsächlichen Token-Stand.
 *    – Single Source of Truth für die sichtbare Balance im AccountPanel.
 *
 *  [ANCHOR:5] SUCCESS-RESPONSE
 *    – Antwort bei erfolgreichem Read:
 *        ok:true,
 *        authenticated:true,
 *        email,               // Original-E-Mail
 *        balance              // number
 *      (Status 200)
 *
 *  [ANCHOR:6] ERROR-PATH (TOKEN HOTSPOT)
 *    – Fehler in Cookie-Access, Token-Verify oder getBalance →
 *      ok:false, authenticated:false, email:null, balance:null,
 *      error:"balance_unavailable", error_message:string (500).
 *
 *  TOKEN-RELEVANZ (SUMMARY)
 *    – Offizieller Read-Endpunkt für das Token-Guthaben.
 *    – Kette:
 *        AUTH_COOKIE
 *        → verifySessionToken
 *        → email + userId (users.id)
 *        → getBalance(userId)
 *        → JSON
 *        → AccountPanel.
 *    – Alle Schreiboperationen (Stripe-Webhooks, später Chat-Debit)
 *      müssen dieselbe userId (users.id) verwenden.
 *
 *  INVENTUS NOTE
 *    – Reiner Inventur- und Strukturspiegel für das Dev-Team.
 * ======================================================================= */

// app/api/me/balance/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getBalance } from "@/lib/ledger";

export async function GET() {
  try {
    const store = cookies();
    const raw = store.get(AUTH_COOKIE_NAME)?.value ?? null;

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

    let payload: any;
    try {
      payload = verifySessionToken(raw);
    } catch (err) {
      console.error("[/api/me/balance] invalid session token", err);
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

    const email = String(payload.email).trim().toLowerCase();
    const userId = payload.id != null ? String(payload.id) : "";

    // Falls aus irgendeinem Grund keine users.id im Token → als 0 Tokens behandeln
    if (!userId) {
      console.error("[/api/me/balance] missing user id in session payload", payload);
      return NextResponse.json(
        {
          ok: true,
          authenticated: true,
          email,
          balance: 0,
        },
        { status: 200 },
      );
    }

    const balance = await getBalance(userId);

    return NextResponse.json(
      {
        ok: true,
        authenticated: true,
        email,
        balance,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[/api/me/balance] error", error);
    return NextResponse.json(
      {
        ok: false,
        authenticated: false,
        email: null,
        balance: null,
        error: "balance_unavailable",
        error_message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

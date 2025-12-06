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
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getBalance } from "@/lib/ledger";
import { ledgerUserIdFromEmail } from "@/lib/ledgerIds";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Session-Cookie auslesen
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    // Nicht eingeloggt → für das Frontend klarer Status
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

  try {
    // 2. Token prüfen
    const payload = verifySessionToken(token);

    if (!payload || !payload.email) {
      return NextResponse.json(
        {
          ok: false,
          authenticated: false,
          email: null,
          balance: null,
          error: "invalid_session",
        },
        { status: 401 },
      );
    }

    // Für Payment v1 nutzen wir eine deterministische numerische Ledger-ID aus der E-Mail
    const email = payload.email.trim().toLowerCase();
    const userId = ledgerUserIdFromEmail(email);

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

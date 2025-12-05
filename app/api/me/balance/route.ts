/*** =======================================================================
 *  INVENTUS INDEX — app/api/me/balance/route.ts
 *  Token-Read Endpoint · Session → Ledger → AccountPanel
 * =======================================================================
 *
 *  [ANCHOR:0] IMPORTS & LAYER
 *    – NextResponse, cookies, AUTH_COOKIE_NAME, verifySessionToken,
 *      getBalance, ledgerUserIdFromEmail.
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
 *    – ledgerUserId = ledgerUserIdFromEmail(email) erzeugt eine deterministische,
 *      BIGINT-kompatible numerische Ledger-ID.
 *    – Dieser Wert ist der einzige gültige Schlüssel ins Ledger.
 *
 *  [ANCHOR:4] LEDGER-READ (TOKEN HOTSPOT)
 *    – getBalance(ledgerUserId) liefert den tatsächlichen Token-Stand.
 *    – Single Source of Truth für die sichtbare Balance im AccountPanel.
 *    – Jede Divergenz zwischen Email ↔ Ledger-ID war historisch Ursache für
 *      „keine Tokens sichtbar“.
 *
 *  [ANCHOR:5] SUCCESS-RESPONSE
 *    – Antwort bei erfolgreichem Read:
 *        ok:true,
 *        authenticated:true,
 *        email,               // Original-E-Mail, nicht die Ledger-ID
 *        balance              // number oder null
 *      (Status 200)
 *    – Wird direkt vom Account-Overlay konsumiert.
 *
 *  [ANCHOR:6] ERROR-PATH (TOKEN HOTSPOT)
 *    – Fehler in Cookie-Access, Token-Verify oder getBalance →
 *      ok:false, authenticated:false, email:null, balance:null,
 *      error:"balance_unavailable" (500).
 *    – UI zeigt dies als „Balance nicht geladen“.
 *
 *  TOKEN-RELEVANZ (SUMMARY)
 *    – Offizieller Read-Endpunkt für das Token-Guthaben.
 *    – Kette:
 *        AUTH_COOKIE
 *        → verifySessionToken
 *        → email
 *        → ledgerUserIdFromEmail(email)
 *        → getBalance(ledgerUserId)
 *        → JSON
 *        → AccountPanel.
 *    – Alle Schreiboperationen (Stripe-Webhooks, später Chat-Debit)
 *      müssen exakt dieselbe ledgerUserId verwenden.
 *
 *  INVENTUS NOTE
 *    – Reiner Inventur- und Strukturspiegel für das Dev-Team.
 * ======================================================================= */


// app/api/me/balance/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getBalance } from "@/lib/ledger";
import { ledgerUserIdFromEmail } from "@/lib/ledgerIds";

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

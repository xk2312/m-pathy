// app/api/me/balance/route.ts
// Payment v1 – Stub-Route für AccountPanel
// Liefert vorerst eine feste Balance zurück und kann später
// an das echte Ledger (balances-Tabelle) angebunden werden.

import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Hier später echte Ledger-Logik einhängen.
  // Für jetzt: stabiler Stub-Wert.
  const balance = 0;

  return NextResponse.json({
    ok: true,
    balance,
  });
}

// app/api/live/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

export async function GET() {
  // Schneller Liveness-Ping (keine externen Abhängigkeiten)
  return NextResponse.json(
    { ok: true, service: "m-pathy", status: "live", ts: new Date().toISOString() },
    { status: 200 }
  );
}

// app/api/ledger/test/route.ts
import { NextResponse } from "next/server";
import { getPool } from "@/lib/ledger";

export async function GET() {
  try {
    const pool = await getPool();
    const res = await pool.query("SELECT 1 AS ok");


    const ok = res?.rows?.[0]?.ok === 1;

    return NextResponse.json(
      { ok, rows: res.rows, ts: new Date().toISOString() },
      { status: ok ? 200 : 503 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 503 }
    );
  }
}

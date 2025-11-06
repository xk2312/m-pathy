// app/api/ledger/probe/route.ts
import { NextResponse } from "next/server";

/**
 * Ledger Runtime Probe (read-only)
 * - prüft: Tabellen-Existenz (users, balances, purchases, webhook_events)
 * - gibt: existence-Flags + optional Rowcounts zurück (sofern vorhanden)
 * - verändert keine Daten
 */
export async function GET() {
  try {
    // Lazy import vermeidet TS/Hot-Reload Zicken
    const ledger = await import("@/lib/ledger");
    const pool = await ledger.getPool();

    // 1) Existence-Flags aus pg_catalog
    const ex = await pool.query<{
      has_users: boolean;
      has_balances: boolean;
      has_purchases: boolean;
      has_webhook_events: boolean;
    }>(`
      SELECT
        to_regclass('public.users')           IS NOT NULL AS has_users,
        to_regclass('public.balances')        IS NOT NULL AS has_balances,
        to_regclass('public.purchases')       IS NOT NULL AS has_purchases,
        to_regclass('public.webhook_events')  IS NOT NULL AS has_webhook_events
    `);

    const flags = ex.rows[0] ?? {
      has_users: false,
      has_balances: false,
      has_purchases: false,
      has_webhook_events: false,
    };

    // 2) Optionale Counts nur, wenn Tabelle existiert (kein Fehler bei frischen DBs)
    const counts: Record<string, number | null> = {
      users: null,
      balances: null,
      purchases: null,
      webhook_events: null,
    };

    if (flags.has_users) {
      const r = await pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM public.users`);
      counts.users = Number(r.rows[0]?.c ?? 0);
    }
    if (flags.has_balances) {
      const r = await pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM public.balances`);
      counts.balances = Number(r.rows[0]?.c ?? 0);
    }
    if (flags.has_purchases) {
      const r = await pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM public.purchases`);
      counts.purchases = Number(r.rows[0]?.c ?? 0);
    }
    if (flags.has_webhook_events) {
      const r = await pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM public.webhook_events`);
      counts.webhook_events = Number(r.rows[0]?.c ?? 0);
    }

    // OK, wenn Kernobjekte existieren (users+balances genügen)
    const ok = !!(flags.has_users && flags.has_balances);

    return NextResponse.json(
      {
        ok,
        exists: flags,
        counts,
        ts: new Date().toISOString(),
      },
      { status: ok ? 200 : 503 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 503 }
    );
  }
}

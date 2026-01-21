/*** =======================================================================
 *  INVENTUS INDEX - lib/ledger.ts
 *  Token-Ledger Core · credit / debit / getBalance
 * =======================================================================
 *
 *  [ANCHOR:0] PG-POOL SINGLETON
 *    – getPool(): zentraler, globaler pg.Pool (globalThis.__MPATHY_PG).
 *    – Nutzt DATABASE_URL / POSTGRES_URL / NEON_DB_URL + optionales SSL.
 *    – Alle Ledger-Operationen hängen an diesem Pool (Connectivity-Kritik).
 *
 *  [ANCHOR:1] HELFER toInt(amount)
 *    – Stellt sicher: amount ist finite, wird auf Integer gekappt, muss > 0 sein.
 *    – Ledger verarbeitet ausschließlich positive, ganze Tokenmengen.
 *
 *  [ANCHOR:2] HELFER assertUser(userId)
 *    – Erwartet nur: userId existiert und ist vom Typ string.
 *    – Prüft NICHT, ob der String numerisch ist (Spannungsfeld zu BIGINT).
 *
 *  [ANCHOR:3] credit(userId, amount)  · TOKEN HOTSPOT
 *    – Erhöht Guthaben via SQL: SELECT ledger_credit($1::bigint, $2::bigint).
 *    – Übergibt Number(userId) und v = toInt(amount).
 *    – Erwartet: userId repräsentiert einen numerischen BIGINT-Schlüssel.
 *
 *  [ANCHOR:4] debit(userId, amount)   · TOKEN HOTSPOT
 *    – Verringert Guthaben via SELECT ledger_debit($1::bigint, $2::bigint).
 *    – Gleiche Annahme: userId → Number(userId) → BIGINT in der DB.
 *
 *  [ANCHOR:5] getBalance(userId)      · TOKEN HOTSPOT
 *    – Liest aktuellen Stand via SELECT ledger_get_balance($1::bigint).
 *    – userId wird zu Number(userId) gegossen (Erwartung: numerischer Key).
 *    – Single Source of Truth für den sichtbaren Token-Stand in der UI.
 *
 *  TOKEN-RELEVANZ (SUMMARY)
 *    – lib/ledger.ts bildet den technischen Kern des Token-Ledgers.
 *    – Alle Credits/Debits/Balances laufen über BIGINT user_id in der DB.
 *    – Systemische Spannung entsteht dort, wo userId als E-Mail-String
 *      verwendet wird, aber hier als Number(userId) im Ledger landet.
 *    – Für die Token-Anzeige im Account-Overlay ist dieses Mapping
 *      entscheidend für „richtige Tokens vs. scheinbar 0 / lädt“.
 *
 *  INVENTUS NOTE
 *    – Reine Inventur & Strukturspiegel für das Dev-Team; keine Vorgabe,
 *      ob User-Identität langfristig numerisch, per E-Mail oder hybrid
 *      gelöst wird – nur Klarstellung des aktuellen Kernverhaltens.
 * ======================================================================= */

/**
 * Ledger core (stubs) – transactional & minimal
 * Runtime: server-only (Node / Next.js server)
 */

import type { Pool } from "pg";

// Lazy PG Pool (Singleton über globalThis) – kein mehrfacher Verbindungsaufbau bei Hot-Reload
// ...
type PgGlobal = typeof globalThis & { __MPATHY_PG?: Pool };
const g = globalThis as PgGlobal;

export async function getPool(): Promise<Pool> {   // <-- export hinzugefügt
  if (!g.__MPATHY_PG) {
    const { Pool: PgPool } = await import("pg");
    const cs = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DB_URL || "";
    if (!cs) throw new Error("DATABASE_URL missing");
    g.__MPATHY_PG = new PgPool({
      connectionString: cs,
      ssl: /amazonaws|neon|azure/i.test(cs) ? { rejectUnauthorized: false } : undefined,
    });
  }
  return g.__MPATHY_PG!;
}

// Hilfen
function toInt(n: number): number {
  if (!Number.isFinite(n)) throw new Error("amount not finite");
  const v = Math.trunc(n);
  if (v <= 0) throw new Error("amount must be > 0");
  return v;
}
function assertUser(userId: string) {
  if (!userId || typeof userId !== "string") throw new Error("userId missing");
}

/**
 * credit – erhöht Guthaben atomar (UPSERT).
 * Erwartet: UNIQUE/PK auf balances.user_id
 * Spaltenkompatibilität: amount|tokens via COALESCE.
 */
export async function credit(userId: string, amount: number): Promise<number> {
  assertUser(userId);
  const v = toInt(amount);
  const pool = await getPool();
  // nutzt DB-Funktion, die Non-Negativ & >0 garantiert
  const { rows } = await pool.query(
    "SELECT ledger_credit($1::bigint, $2::bigint) AS balance",
    [Number(userId), v]
  );
  return Number(rows[0]?.balance ?? 0);
}


/**
 * debit – verringert Guthaben, verhindert Negativsaldo.
 * Falls Datensatz fehlt oder nicht genug Guthaben: Fehler.
 */
export async function debit(userId: string, amount: number): Promise<number> {
  assertUser(userId);
  const v = toInt(amount);
  const pool = await getPool();
  const { rows } = await pool.query(
    "SELECT ledger_debit($1::bigint, $2::bigint) AS balance",
    [Number(userId), v]
  );
  return Number(rows[0]?.balance ?? 0);
}


/**
 * getBalance – liest aktuellen Stand, Default 0.
 */
export async function getBalance(userId: string): Promise<number> {
  assertUser(userId);
  const pool = await getPool();
  const { rows } = await pool.query(
    "SELECT ledger_get_balance($1::bigint) AS balance",
    [Number(userId)]
  );
  return Number(rows[0]?.balance ?? 0);
}


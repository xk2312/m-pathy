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


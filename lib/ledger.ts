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
  const sql = `
    INSERT INTO balances (user_id, amount)
    VALUES ($1, $2)
    ON CONFLICT (user_id)
    DO UPDATE SET amount = COALESCE(balances.amount, balances.tokens, 0) + EXCLUDED.amount
    RETURNING COALESCE(amount, tokens) AS balance
  `;
  const { rows } = await pool.query(sql, [userId, v]);
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
  const sql = `
    UPDATE balances
       SET amount = COALESCE(amount, tokens, 0) - $2
     WHERE user_id = $1
       AND COALESCE(amount, tokens, 0) >= $2
    RETURNING COALESCE(amount, tokens) AS balance
  `;
  const { rowCount, rows } = await pool.query(sql, [userId, v]);
  if (rowCount === 0) throw new Error("insufficient funds or user not found");
  return Number(rows[0]?.balance ?? 0);
}

/**
 * getBalance – liest aktuellen Stand, Default 0.
 */
export async function getBalance(userId: string): Promise<number> {
  assertUser(userId);
  const pool = await getPool();
  const sql = `
    SELECT COALESCE(amount, tokens, 0) AS balance
      FROM balances
     WHERE user_id = $1
  `;
  const { rows } = await pool.query(sql, [userId]);
  return Number(rows[0]?.balance ?? 0);
}

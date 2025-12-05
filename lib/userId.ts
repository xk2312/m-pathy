// lib/userId.ts
import { getPool } from "@/lib/ledger";

export async function userIdFromEmail(email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const pool = await getPool();
  const { rows } = await pool.query(
    "SELECT id FROM users WHERE lower(email) = $1 LIMIT 1",
    [normalized]
  );

  const id = rows[0]?.id;
  if (id === null || id === undefined) return null;
  return String(id);
}

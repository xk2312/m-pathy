import { getPool } from "@/lib/ledger";

export async function findTriketonAnchor(publicKey: string, truthHash: string): Promise<boolean> {
  const pool = await getPool();
  const r = await pool.query(
    `select 1
     from triketon_anchors
     where public_key = $1 and truth_hash = $2
     limit 1`,
    [publicKey, truthHash]
  );
  return r.rowCount === 1;
}

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

export type TriketonAnchorMeta = {
  protocol_version?: string;
  hash_profile?: string;
  key_profile?: string;
  orbit_context?: string;
};

export async function insertTriketonAnchor(
  publicKey: string,
  truthHash: string,
  meta: TriketonAnchorMeta = {},
): Promise<boolean> {
  const pool = await getPool();

  // 🔒 server-side defaults (authoritative)
  const protocol_version = meta.protocol_version ?? "v1";
  const hash_profile = meta.hash_profile ?? "TRIKETON_HASH_V1";
  const key_profile = meta.key_profile ?? "TRIKETON_KEY_V1";
  const orbit_context = meta.orbit_context ?? "archive";

  const r = await pool.query(
    `insert into triketon_anchors (
       public_key,
       truth_hash,
       protocol_version,
       hash_profile,
       key_profile,
       orbit_context
     )
     values ($1, $2, $3, $4, $5, $6)
     on conflict do nothing`,
    [
      publicKey,
      truthHash,
      protocol_version,
      hash_profile,
      key_profile,
      orbit_context,
    ],
  );

  return r.rowCount === 1;
}


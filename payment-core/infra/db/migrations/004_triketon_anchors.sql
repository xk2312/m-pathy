-- TRIKETON v1 - anchors only (no text)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS triketon_anchors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_key TEXT NOT NULL,
  truth_hash TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1',
  hash_profile TEXT NOT NULL DEFAULT 'TRIKETON_HASH_V1',
  key_profile TEXT NOT NULL DEFAULT 'TRIKETON_KEY_V1',
  orbit_context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT triketon_anchors_pk_hash_unique UNIQUE (public_key, truth_hash)
);

CREATE INDEX IF NOT EXISTS triketon_anchors_key_hash_idx
ON triketon_anchors (public_key, truth_hash);

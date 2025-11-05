-- ============================================================
-- 001_init_ledger.sql  (GPTM-Galaxy+ Payment v1 — Core Schema)
-- Idempotent-ish: erstellt fehlende Objekte; doppelte Events gesperrt.
-- ============================================================

-- 0) Extensions (optional, aber nützlich)
CREATE EXTENSION IF NOT EXISTS citext;

-- 1) users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'users' AND n.nspname = 'public'
  ) THEN
    CREATE TABLE public.users (
      id            BIGSERIAL PRIMARY KEY,
      email         CITEXT UNIQUE,         -- nullable, UNIQUE wenn gesetzt
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  END IF;
END$$;

-- 2) balances (1:1 zu users)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'balances' AND n.nspname = 'public'
  ) THEN
    CREATE TABLE public.balances (
      user_id       BIGINT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
      tokens_left   BIGINT NOT NULL DEFAULT 0 CHECK (tokens_left >= 0),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  END IF;
END$$;

-- 3) purchases (Käufe; Stripe Session/Payment referenzieren)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'purchases' AND n.nspname = 'public'
  ) THEN
    CREATE TABLE public.purchases (
      id                BIGSERIAL PRIMARY KEY,
      user_id           BIGINT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
      amount_tokens     BIGINT NOT NULL CHECK (amount_tokens > 0), -- z.B. 1_000_000
      stripe_session_id TEXT UNIQUE,   -- idempotent pro Session
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  END IF;
END$$;

-- 4) webhook_events (Idempotenzsperre + Audit)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'webhook_events' AND n.nspname = 'public'
  ) THEN
    CREATE TABLE public.webhook_events (
      event_id     TEXT PRIMARY KEY,           -- Stripe Event-ID -> verhindert Doppeltbuchung
      event_type   TEXT NOT NULL,              -- z.B. 'checkout.session.completed'
      received_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      payload      JSONB NOT NULL              -- Rohdaten für späteres Re-Verify
    );
  END IF;
END$$;

-- 5) Helper-Trigger: balances.updated_at aktualisieren
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'set_balances_updated_at'
  ) THEN
    CREATE OR REPLACE FUNCTION set_balances_updated_at()
    RETURNS TRIGGER AS $f$
    BEGIN
      NEW.updated_at := now();
      RETURN NEW;
    END;
    $f$ LANGUAGE plpgsql;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_balances_touch'
  ) THEN
    CREATE TRIGGER trg_balances_touch
      BEFORE UPDATE ON public.balances
      FOR EACH ROW EXECUTE FUNCTION set_balances_updated_at();
  END IF;
END$$;

-- 6) Seed (nur, wenn keine balances existieren)
INSERT INTO public.users (email)
SELECT NULL
WHERE NOT EXISTS (SELECT 1 FROM public.users);

INSERT INTO public.balances (user_id, tokens_left)
SELECT u.id, 0
FROM public.users u
LEFT JOIN public.balances b ON b.user_id = u.id
WHERE b.user_id IS NULL;

-- EOF

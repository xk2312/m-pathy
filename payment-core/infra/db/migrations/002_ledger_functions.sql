-- ============================================================
-- 002_ledger_functions.sql  (GPTM-Galaxy+ Payment v1 — Ledger)
-- Transaktionale Kernfunktionen für credit/debit/get_balance.
-- Guarantees:
--  - Beträge > 0
--  - Kein Negativsaldo
--  - Zeilen in balances werden bei Bedarf angelegt (upsert)
-- ============================================================

-- 0) Hilfsfunktion: stellt sicher, dass es eine balance-Zeile gibt
CREATE OR REPLACE FUNCTION ensure_balance_row(p_user_id BIGINT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.balances (user_id, tokens_left)
  VALUES (p_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- 1) Lesen: aktuelles Guthaben
CREATE OR REPLACE FUNCTION ledger_get_balance(p_user_id BIGINT)
RETURNS BIGINT AS $$
DECLARE
  v_balance BIGINT;
BEGIN
  PERFORM ensure_balance_row(p_user_id);
  SELECT tokens_left INTO v_balance
  FROM public.balances
  WHERE user_id = p_user_id;
  RETURN COALESCE(v_balance, 0);
END;
$$ LANGUAGE plpgsql;

-- 2) Gutschrift: Betrag muss > 0, Ergebnis zurückgeben
CREATE OR REPLACE FUNCTION ledger_credit(p_user_id BIGINT, p_amount BIGINT)
RETURNS BIGINT AS $$
DECLARE
  v_new BIGINT;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'invalid_amount: credit must be > 0' USING ERRCODE = '22023';
  END IF;

  PERFORM ensure_balance_row(p_user_id);

  -- Zeile exklusiv sperren, dann addieren
  UPDATE public.balances
     SET tokens_left = tokens_left + p_amount,
         updated_at  = now()
   WHERE user_id = p_user_id
   RETURNING tokens_left INTO v_new;

  RETURN v_new;
END;
$$ LANGUAGE plpgsql;

-- 3) Abbuchung: Betrag muss > 0, kein Negativsaldo
CREATE OR REPLACE FUNCTION ledger_debit(p_user_id BIGINT, p_amount BIGINT)
RETURNS BIGINT AS $$
DECLARE
  v_curr BIGINT;
  v_new  BIGINT;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'invalid_amount: debit must be > 0' USING ERRCODE = '22023';
  END IF;

  PERFORM ensure_balance_row(p_user_id);

  -- Zeile exklusiv sperren
  SELECT tokens_left
    INTO v_curr
    FROM public.balances
   WHERE user_id = p_user_id
   FOR UPDATE;

  IF v_curr IS NULL THEN
    v_curr := 0;
  END IF;

  IF v_curr < p_amount THEN
    RAISE EXCEPTION 'insufficient_funds' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.balances
     SET tokens_left = v_curr - p_amount,
         updated_at  = now()
   WHERE user_id = p_user_id
   RETURNING tokens_left INTO v_new;

  RETURN v_new;
END;
$$ LANGUAGE plpgsql;

-- EOF

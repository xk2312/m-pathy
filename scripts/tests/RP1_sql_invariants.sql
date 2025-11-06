-- Read-only Checks (kein Write!): Non-Negativ-Invariante und Tabellen-Existenz
SELECT
  to_regclass('public.users')           IS NOT NULL AS has_users,
  to_regclass('public.balances')        IS NOT NULL AS has_balances,
  to_regclass('public.purchases')       IS NOT NULL AS has_purchases,
  to_regclass('public.webhook_events')  IS NOT NULL AS has_webhook_events;

-- Balance darf nie negativ sein (Schema nutzt CHECK >= 0, sofern Migration korrekt)
SELECT COUNT(*) AS negative_balances
FROM public.balances
WHERE COALESCE(tokens_left, 0) < 0;

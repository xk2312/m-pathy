-- 003_webhook_index.sql
-- Minimaler Unterstützungsindex für häufige Filter/Audits
CREATE INDEX IF NOT EXISTS idx_webhook_events_type
  ON public.webhook_events(event_type);

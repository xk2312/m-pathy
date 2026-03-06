export function normalizeTimestamp(ts: unknown): string {
  const t = Date.parse(String(ts))
  if (Number.isFinite(t)) return new Date(t).toISOString()
  return new Date().toISOString()
}
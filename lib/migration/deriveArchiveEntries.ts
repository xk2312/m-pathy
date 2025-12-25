// AFTER
// lib/migration/deriveArchiveEntries.ts
// Phase B · Baby-Step B2
// Deterministische Ableitung: ChatMessage[] → ArchiveEntry[]
// KEIN Schreiben · KEINE Pairs speichern · Reihenfolge bleibt exakt

import type { ChatMessage, ArchiveEntry } from '@/lib/types'

export function deriveArchiveEntries(
  messages: ChatMessage[],
  publicKey: string
): ArchiveEntry[] {
  if (!Array.isArray(messages)) return []

  return messages.map((m) => ({
    id: m.id,
    origin_chat: m.chat_serial,
    role: m.role,
    content: m.content,
    timestamp: m.timestamp,
    truth_hash: m.truth_hash ?? '',
    public_key: publicKey,
    verified: Boolean(m.truth_hash),
  }))
}

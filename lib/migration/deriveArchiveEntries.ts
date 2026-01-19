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
    id:
      typeof m.id === 'string' && m.id.length > 0
        ? m.id
        : (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function'
            ? (crypto as any).randomUUID()
            : `${Date.now()}_${Math.random().toString(16).slice(2)}`),
    origin_chat: m.chat_serial ?? 0,
    role: m.role,
    content: m.content ?? '',
    timestamp: m.timestamp ?? new Date().toISOString(),
    truth_hash: m.truth_hash ?? '',
    public_key: publicKey ?? '',
    verified: Boolean(m.truth_hash),
  }))
}


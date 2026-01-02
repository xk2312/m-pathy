// lib/archiveProjection.ts
// GPTM-Galaxy+ · Archive Projection v1
// Deterministic, persistent projection from Triketon ledger (MEFL compliant)

import { readLS, writeLS } from './storage'
import { extractTopKeywords } from './keywordExtract'
import type { TArchiveEntry } from './types'

export interface ArchivChat {
  chat_id: number
  entries: TArchiveEntry[]
  first_timestamp: string
  last_timestamp: string
  keywords: string[]
  verified: true
}

const TRIKETON_KEY = 'mpathy:triketon:v1'
const ARCHIVE_KEY = 'mpathy:archive:v1'

/**
 * Builds AND persists archive chats purely from Triketon ledger.
 * – Deterministic
 * – Idempotent
 * – Includes active chat
 * – No dependency on mpathy:chat:v1
 */
export function syncArchiveFromTriketon(): ArchivChat[] {
  const anchors = readLS<TArchiveEntry[]>(TRIKETON_KEY) || []

  if (anchors.length === 0) {
    writeLS(ARCHIVE_KEY, [])
    return []
  }

  const grouped = new Map<number, TArchiveEntry[]>()

  for (const a of anchors) {
    if (typeof a.origin_chat !== 'number') continue

    if (!grouped.has(a.origin_chat)) {
      grouped.set(a.origin_chat, [])
    }
    grouped.get(a.origin_chat)!.push(a)
  }

  const chats: ArchivChat[] = []

  for (const [chatId, entries] of grouped.entries()) {
    if (entries.length === 0) continue

    const ordered = entries.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    chats.push({
      chat_id: chatId,
      entries: ordered,
      first_timestamp: ordered[0].timestamp,
      last_timestamp: ordered[ordered.length - 1].timestamp,
      keywords: extractTopKeywords(ordered).slice(0, 7),
      verified: true, // Ledger-implizit
    })
  }

  const sorted = chats.sort(
    (a, b) =>
      new Date(b.last_timestamp).getTime() -
      new Date(a.last_timestamp).getTime(),
  )

  // 🔒 Persistenter Debug- & UI-Spiegel
  writeLS(ARCHIVE_KEY, sorted)

  return sorted
}

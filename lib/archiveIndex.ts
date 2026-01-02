// lib/archiveIndex.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Archive Index & Retrieval – Projection-only, MEFL conform

import type { TArchiveEntry } from './types'
import type { ArchivChat } from './archiveProjection'
import { syncArchiveFromTriketon } from './archiveProjection'
import { readLS } from './storage'

const ARCHIVE_KEY = 'mpathy:archive:v1'

/**
 * Liefert die letzten archivierten Chats (read-only).
 */
export function getRecentChats(limit = 13): {
  chat_serial: number
  first_timestamp: string
  last_timestamp: string
  messages: TArchiveEntry[]
  keywords: string[]
}[] {
  // 🔒 sicherstellen, dass Archiv aus Triketon existiert
  syncArchiveFromTriketon()

  const chats = readLS<ArchivChat[]>(ARCHIVE_KEY) || []
  if (chats.length === 0) return []

  return chats.slice(0, limit).map((c: ArchivChat) => ({
    chat_serial: c.chat_id,
    first_timestamp: c.first_timestamp,
    last_timestamp: c.last_timestamp,
    messages: c.entries,
    keywords: c.keywords,
  }))
}

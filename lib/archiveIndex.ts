// lib/archiveIndex.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Archive Index & Retrieval – MEFL conform
// READ-ONLY · derived exclusively from Triketon projection

import { TArchiveEntry } from './types'
import { projectArchiveFromTriketon } from './archiveProjection'

/**
 * Holt das gesamte Archiv
 * (pure in-memory projection from Triketon ledger)
 */
function getArchive(): TArchiveEntry[] {
  return projectArchiveFromTriketon()
}

/**
 * Gruppiert Archiv-Einträge nach Chat-Serial.
 */
function groupByChat(entries: TArchiveEntry[]): Record<number, TArchiveEntry[]> {
  return entries.reduce((acc, e) => {
    if (!acc[e.origin_chat]) acc[e.origin_chat] = []
    acc[e.origin_chat].push(e)
    return acc
  }, {} as Record<number, TArchiveEntry[]>)
}

/**
 * Erzeugt einen zeitbasierten Index der letzten Chats.
 */
export function getRecentChats(limit = 13): {
  chat_serial: number
  first_timestamp: string
  last_timestamp: string
  messages: TArchiveEntry[]
}[] {
  const archive = getArchive()
  if (archive.length === 0) return []

  const grouped = groupByChat(archive)

  const chats = Object.keys(grouped).map((serial) => {
    const msgs = grouped[Number(serial)]
    const ordered = msgs.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime(),
    )

    return {
      chat_serial: Number(serial),
      first_timestamp: ordered[0]?.timestamp ?? '',
      last_timestamp: ordered[ordered.length - 1]?.timestamp ?? '',
      messages: ordered,
    }
  })

  return chats
    .sort(
      (a, b) =>
        new Date(b.last_timestamp).getTime() -
        new Date(a.last_timestamp).getTime(),
    )
    .slice(0, limit)
}

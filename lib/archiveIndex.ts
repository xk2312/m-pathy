// lib/archiveIndex.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Archive Index & Retrieval – MEFL conform

import { TArchiveEntry } from './types'
import { readLS } from './storage'

/**
 * Holt das gesamte Archiv aus LocalStorage.
 */
function getArchive(): TArchiveEntry[] {
  return readLS<TArchiveEntry[]>('mpathy:archive:v1') || []
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
 * Erzeugt einen zeitbasierten Index der letzten 13 Chats.
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
    const first = msgs[0]?.timestamp ?? ''
    const last = msgs[msgs.length - 1]?.timestamp ?? ''
    return {
      chat_serial: Number(serial),
      first_timestamp: first,
      last_timestamp: last,
      messages: msgs.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    }
  })

  // nach letztem Timestamp sortieren → neueste zuerst
  const sorted = chats.sort(
    (a, b) => new Date(b.last_timestamp).getTime() - new Date(a.last_timestamp).getTime(),
  )

  return sorted.slice(0, limit)
}

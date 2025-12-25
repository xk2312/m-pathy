// lib/archiveWrite.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Write Path – automatic archival of chats & messages

import { TChatMessage, TArchiveEntry } from './types'
import { readLS, writeLS } from './storage'

/**
 * Liest das bestehende Archiv (mpathy:archive:v1)
 */
function getArchive(): TArchiveEntry[] {
  return readLS<TArchiveEntry[]>('mpathy:archive:v1') || []
}

/**
 * Schreibt das Archiv vollständig zurück
 */
function saveArchive(entries: TArchiveEntry[]): void {
  writeLS('mpathy:archive:v1', entries)
}

/**
 * Fügt eine neue Nachricht dem Archiv hinzu
 * – erzeugt aus ChatMessage ein unveränderliches ArchiveEntry
 */
export function archiveMessage(msg: TChatMessage, publicKey: string): void {
  const archive = getArchive()
  const entry: TArchiveEntry = {
    id: msg.id,
    origin_chat: msg.chat_serial,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
    truth_hash: msg.truth_hash || '',
    public_key: publicKey,
    verified: !!msg.verified,
  }

  // kein Duplikat: prüfen nach ID
  const exists = archive.some((e) => e.id === entry.id)
  if (!exists) {
    archive.push(entry)
    // chronologische Sortierung nach timestamp
    archive.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
    saveArchive(archive)
  }
}

/**
 * Fügt einen ganzen Chat (Array von Messages) hinzu
 */
export function archiveChat(messages: TChatMessage[], publicKey: string): void {
  messages.forEach((m) => archiveMessage(m, publicKey))
}

/**
 * Gibt das vollständige Archiv zurück
 */
export function getAllArchiveEntries(): TArchiveEntry[] {
  return getArchive()
}

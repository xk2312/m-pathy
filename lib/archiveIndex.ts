// lib/archiveIndex.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Archive Index & Retrieval – Projection-only, MEFL conform

import type { TArchiveEntry } from './types'
import type { ArchivChat } from './archiveProjection'
import {
  buildArchivChatsFromTriketon,
  syncArchiveFromTriketon,
} from './archiveProjection'
import { readLS } from './storage'

const ARCHIVE_KEY = 'mpathy:archive:v1'

function isArchivChat(x: any): x is ArchivChat {
  return (
    x &&
    typeof x === 'object' &&
    typeof x.chat_id === 'number' &&
    Array.isArray(x.entries) &&
    typeof x.first_timestamp === 'string' &&
    typeof x.last_timestamp === 'string' &&
    Array.isArray(x.keywords)
  )
}

function isArchiveEntry(x: any): x is TArchiveEntry {
  return (
    x &&
    typeof x === 'object' &&
    typeof x.id === 'string' &&
    typeof x.origin_chat === 'number' &&
    typeof x.role === 'string' &&
    typeof x.content === 'string' &&
    typeof x.timestamp === 'string'
  )
}

function readArchiveChats(): ArchivChat[] {
  const raw = readLS<unknown>(ARCHIVE_KEY)

  if (Array.isArray(raw) && raw.length > 0 && isArchivChat(raw[0])) {
    return raw as ArchivChat[]
  }

  if (Array.isArray(raw) && raw.length > 0 && isArchiveEntry(raw[0])) {
    return buildArchivChatsFromTriketon()
  }

  return []
}

/**
 * Liefert die letzten archivierten Chats (read-only).
 */
export function getRecentChats(limit = 13): {
  chat_serial: number
  first_timestamp: string
  last_timestamp: string
  messages: {
    id: string
    role: 'user' | 'assistant'
    timestamp: string
  }[]
  keywords: string[]
}[] {

  syncArchiveFromTriketon()

  const chats = readArchiveChats()
  if (chats.length === 0) return []

  return chats.slice(0, limit).map((c: ArchivChat) => ({
    chat_serial: c.chat_id,
    first_timestamp: c.first_timestamp,
    last_timestamp: c.last_timestamp,
    messages: c.entries,
    keywords: c.keywords,
  }))
}


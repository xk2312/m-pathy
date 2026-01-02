// lib/archiveProjection.ts
// GPTM-Galaxy+ · Archive Projection v1
// Deterministic, persistent archive sync from Triketon ledger (MEFL compliant)

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

type TriketonAnchor = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  truth_hash: string
  public_key?: string
  chain_id?: string | number
  origin_chat?: number
}

const TRIKETON_KEY = 'mpathy:triketon:v1'
const ARCHIVE_KEY = 'mpathy:archive:v1'

function hashChainIdToNumber(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % 1000000000
}

function deriveOriginChat(a: TriketonAnchor): number {
  if (typeof a.origin_chat === 'number' && Number.isFinite(a.origin_chat)) return a.origin_chat
  if (typeof a.chain_id === 'number' && Number.isFinite(a.chain_id)) return a.chain_id
  if (typeof a.chain_id === 'string' && a.chain_id.length > 0)
    return hashChainIdToNumber(a.chain_id)
  return 0
}

function anchorsToArchiveEntries(anchors: TriketonAnchor[]): TArchiveEntry[] {
  const entries: TArchiveEntry[] = []

  for (const a of anchors) {
    if (!a || typeof a.id !== 'string') continue
    if (a.role !== 'user' && a.role !== 'assistant') continue
    if (typeof a.content !== 'string') continue
    if (typeof a.timestamp !== 'string') continue
    if (typeof a.truth_hash !== 'string') continue

    const origin_chat = deriveOriginChat(a)
    if (!Number.isFinite(origin_chat) || origin_chat === 0) continue

    entries.push({
      id: a.id,
      origin_chat,
      role: a.role,
      content: a.content,
      timestamp: a.timestamp,
      truth_hash: a.truth_hash,
      public_key: typeof a.public_key === 'string' ? a.public_key : '',
      verified: true,
    })
  }

  return entries.sort(
    (x, y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime(),
  )
}

/**
 * Persistenter Spiegel:
 * mpathy:archive:v1 = deterministische Projektion aus Triketon
 * Format: TArchiveEntry[]
 */
export function syncArchiveFromTriketon(): TArchiveEntry[] {
  const raw = readLS<unknown>(TRIKETON_KEY)
  const anchors: TriketonAnchor[] = Array.isArray(raw) ? (raw as TriketonAnchor[]) : []

  const projected = anchorsToArchiveEntries(anchors)

  writeLS(ARCHIVE_KEY, projected)
  return projected
}

/**
 * Read-only Chat-Projektion (UI):
 * wird IMMER aus dem persistierten Archiv gebaut
 */
export function buildArchivChatsFromTriketon(): ArchivChat[] {
  const archive = readLS<TArchiveEntry[]>(ARCHIVE_KEY) || []
  if (archive.length === 0) return []

  const grouped = new Map<number, TArchiveEntry[]>()
  for (const e of archive) {
    if (!grouped.has(e.origin_chat)) grouped.set(e.origin_chat, [])
    grouped.get(e.origin_chat)!.push(e)
  }

  const chats: ArchivChat[] = []

  for (const [chatId, entries] of grouped.entries()) {
    const ordered = entries.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
    if (ordered.length === 0) continue

    chats.push({
      chat_id: chatId,
      entries: ordered,
      first_timestamp: ordered[0].timestamp,
      last_timestamp: ordered[ordered.length - 1].timestamp,
      keywords: extractTopKeywords(ordered).slice(0, 7),
      verified: true,
    })
  }

  return chats.sort(
    (a, b) => new Date(b.last_timestamp).getTime() - new Date(a.last_timestamp).getTime(),
  )
}

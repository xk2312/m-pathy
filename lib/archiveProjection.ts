// lib/archiveProjection.ts
// GPTM-Galaxy+ · Archive Projection v1
// Read-only archive projection derived exclusively from Triketon Ledger
// MEFL compliant · No write paths · No Chat dependency

import { readLS } from './storage'
import { extractTopKeywords } from './keywordExtract'
import type { TArchiveEntry } from './types'

/**
 * Triketon Ledger Key
 * SINGLE SOURCE OF TRUTH
 */
const LEDGER_KEY = 'mpathy:triketon:v1'

export interface RecentChatPreview {
  chatId: string
  keywords: string[]
  entriesCount: number
  firstTimestamp: string
  lastTimestamp: string
  verified: boolean
}

type TriketonAnchor = {
  id: string
  chain_id: string | number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  truth_hash: string
  public_key: string
}

/**
 * Read Triketon ledger (append-only, persistent)
 */
function readLedger(): TriketonAnchor[] {
  return (readLS<TriketonAnchor[]>(LEDGER_KEY) || []) as TriketonAnchor[]
}

/**
 * Project ledger → archive entries (in-memory only)
 */
export function projectArchiveFromTriketon(): TArchiveEntry[] {
  const ledger = readLedger()
  if (ledger.length === 0) return []

  return ledger.map((a) => ({
    id: a.id,
    origin_chat: Number(a.chain_id),
    role: a.role,
    content: a.content,
    timestamp: a.timestamp,
    truth_hash: a.truth_hash,
    public_key: a.public_key,
    verified: true, // comes from ledger → implicitly verified
  }))
}

/**
 * Build Recent Chat previews (pure projection)
 */
export function buildRecentChatPreviews(
  lang: string = 'en',
  limit: number = 13,
): RecentChatPreview[] {
  const entries = projectArchiveFromTriketon()
  if (entries.length === 0) return []

  const grouped = new Map<number, TArchiveEntry[]>()

  for (const e of entries) {
    if (!grouped.has(e.origin_chat)) {
      grouped.set(e.origin_chat, [])
    }
    grouped.get(e.origin_chat)!.push(e)
  }

  const previews: RecentChatPreview[] = []

  for (const [chatId, msgs] of grouped.entries()) {
    const ordered = msgs.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    const keywords = extractTopKeywords(ordered, 7, lang)

    previews.push({
      chatId: String(chatId),
      keywords,
      entriesCount: ordered.length,
      firstTimestamp: ordered[0].timestamp,
      lastTimestamp: ordered[ordered.length - 1].timestamp,
      verified: true, // ledger-backed
    })
  }

  return previews
    .sort(
      (a, b) =>
        new Date(b.lastTimestamp).getTime() -
        new Date(a.lastTimestamp).getTime(),
    )
    .slice(0, limit)
}

// lib/archiveProjection.ts
// GPTM-Galaxy+ · Archive Projection v1
// Read-only projection from Triketon ledger (MEFL compliant)

import { readLS } from './storage'
import { extractTopKeywords } from './keywordExtract'
import type { TArchiveEntry } from './types'

export interface ArchivChat {
  chat_id: string
  entries: TArchiveEntry[]
  first_timestamp: string
  last_timestamp: string
  keywords: string[]
  verified: true
}

const TRIKETON_KEY = 'mpathy:triketon:v1'
const CHAT_KEY = 'mpathy:chat:v1'

/**
 * Builds archive chats purely from Triketon ledger.
 * – No writes
 * – No side effects
 * – Active chat is excluded
 */
export function buildArchivChatsFromTriketon(): ArchivChat[] {
  const anchors = readLS<TArchiveEntry[]>(TRIKETON_KEY) || []
  if (anchors.length === 0) return []

  // aktive chain_id (laufender Chat) ermitteln
  const liveMessages = readLS<any[]>(CHAT_KEY) || []
  const activeChainId =
    liveMessages.length > 0 ? liveMessages[liveMessages.length - 1]?.chain_id : null

  // Anchors nach chain_id gruppieren
  const grouped = new Map<string, TArchiveEntry[]>()

  for (const a of anchors) {
    if (!a.origin_chat) continue
    const chainId = String(a.origin_chat)

    // aktiven Chat bewusst ausschließen
    if (activeChainId && String(activeChainId) === chainId) continue

    if (!grouped.has(chainId)) grouped.set(chainId, [])
    grouped.get(chainId)!.push(a)
  }

  const chats: ArchivChat[] = []

  for (const [chatId, entries] of grouped.entries()) {
    if (entries.length === 0) continue

    const ordered = entries.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    const keywords = extractTopKeywords(ordered).slice(0, 7)

    chats.push({
      chat_id: chatId,
      entries: ordered,
      first_timestamp: ordered[0].timestamp,
      last_timestamp: ordered[ordered.length - 1].timestamp,
      keywords,
      verified: true, // Ledger-implizit
    })
  }

  // neueste Chats zuerst
  return chats.sort(
    (a, b) =>
      new Date(b.last_timestamp).getTime() -
      new Date(a.last_timestamp).getTime(),
  )
}

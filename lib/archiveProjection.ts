// lib/archiveProjection.ts
// GPTM-Galaxy+ · Archive Projection v1
// Build read-only previews for Recent Chats (MEFL compliant)

import { readLS } from './storage'
import { extractTopKeywords } from './keywordExtract'
import type { TArchiveEntry } from './types'


interface ChatMessage {
  id: string
  chain_id: string
  content: string
  timestamp: string
}

interface ArchiveEntry {
  id: string
  origin_chat: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  truth_hash: string
  public_key: string
  verified: boolean
}

export interface RecentChatPreview {
  chatId: string
  keywords: string[]
  entriesCount: number
  firstTimestamp: string
  lastTimestamp: string
  verified: boolean
}

const MESSAGE_KEY = 'mpathy:chat:v1'
const ANCHOR_KEY = 'mpathy:triketon:v1'

/**
 * Build Recent Chat previews from LocalStorage
 */
export function buildRecentChatPreviews(): RecentChatPreview[] {
  const messages =
    readLS<ChatMessage[]>(MESSAGE_KEY) || []

  const anchors =
    (readLS<any>(ANCHOR_KEY as any) || []) as { chain_id: string }[]

  const grouped = new Map<string, ChatMessage[]>()

  for (const msg of messages) {
    if (!grouped.has(msg.chain_id)) {
      grouped.set(msg.chain_id, [])
    }
    grouped.get(msg.chain_id)!.push(msg)
  }

  const previews: RecentChatPreview[] = []

  for (const [chatId, msgs] of grouped.entries()) {
    const sorted = msgs.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    )

    // 🔒 MEFL-konforme Projektion NUR für Keyword-Extraktion
    const keywordEntries: TArchiveEntry[] = sorted.map((m, idx) => ({
  id: m.id,
  origin_chat: Number(chatId), // 🔑 WICHTIG: number, nicht string
  role: 'user',
  content: m.content,
  timestamp: m.timestamp,
  truth_hash: '',
  public_key: '',
  verified: true,
}))


    const keywords = extractTopKeywords(keywordEntries).slice(0, 7)

    const verified = anchors.some(
      (a) => a.chain_id === chatId
    )

    previews.push({
      chatId,
      keywords,
      entriesCount: sorted.length,
      firstTimestamp: sorted[0].timestamp,
      lastTimestamp: sorted[sorted.length - 1].timestamp,
      verified,
    })
  }

  // newest chats first
  return previews.sort(
    (a, b) =>
      new Date(b.lastTimestamp).getTime() -
      new Date(a.lastTimestamp).getTime()
  )
}

// lib/archiveProjection.ts
// GPTM-Galaxy+ · Archive Projection v2
// Deterministic, persistent chat-level archive from Triketon ledger (MEFL compliant)

import { readLS, writeLS } from './storage'
import { extractTopKeywords } from './keywordExtract'
import type { TArchiveEntry } from './types'

export interface ArchivChat {
  chat_id: number
  first_timestamp: string
  last_timestamp: string
  keywords: string[]
  entries: {
    id: string
    role: 'user' | 'assistant'
    timestamp: string
  }[]
}

type TriketonAnchor = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  truth_hash: string
  public_key?: string
  chain_id?: string | number
  origin_chat?: number
}

const TRIKETON_KEY = 'mpathy:triketon:v1'
const ARCHIVE_KEY = 'mpathy:archive:v1'

function getCurrentLang(): string {
  if (typeof window === 'undefined') return 'en'
  return window.localStorage.getItem('langLast') || 'en'
}

function hashChainIdToNumber(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const n = (h >>> 0) % 1000000000
  return n === 0 ? 1 : n
}


const CHAT_COUNTER_KEY = 'mpathy:archive:chat_counter'
const CHAT_MAP_KEY = 'mpathy:archive:chat_map'

function deriveOriginChat(a: TriketonAnchor): number {
  if (typeof window === 'undefined') return 0
  if (typeof a.chain_id !== 'string' || a.chain_id.length === 0) return 0

  const ls = window.localStorage

  // load or init map
  const rawMap = ls.getItem(CHAT_MAP_KEY)
  const chatMap: Record<string, number> = rawMap ? JSON.parse(rawMap) : {}

  // existing mapping
  if (chatMap[a.chain_id]) {
    return chatMap[a.chain_id]
  }

  // new chain_id → next chat number
  const rawCounter = ls.getItem(CHAT_COUNTER_KEY)
  const next = rawCounter ? parseInt(rawCounter, 10) + 1 : 1

  chatMap[a.chain_id] = next

  ls.setItem(CHAT_COUNTER_KEY, String(next))
  ls.setItem(CHAT_MAP_KEY, JSON.stringify(chatMap))

  return next
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

  return entries.sort((x, y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime())
}

/**
 * Persistenter Spiegel:
 * mpathy:archive:v1 = Chat-Level Anzeige-Vorlage
 */
export function syncArchiveFromTriketon(): ArchivChat[] {
  const lang = getCurrentLang()

const raw = (() => {
  try {
    const r = window.localStorage.getItem(TRIKETON_KEY)
    return r ? JSON.parse(r) : []
  } catch {
    return []
  }
})();  

const anchors: TriketonAnchor[] = Array.isArray(raw) ? (raw as TriketonAnchor[]) : []
const byChain = new Map<string, TriketonAnchor[]>()

  for (const a of anchors) {
  // fallback-chain für alte / chain-lose Ledger-Einträge
  const chainId =
    typeof a.chain_id === 'string' && a.chain_id.length > 0
      ? a.chain_id
      : `legacy:${a.origin_chat ?? 'unknown'}`

  if (!byChain.has(chainId)) byChain.set(chainId, [])
  byChain.get(chainId)!.push(a)
}


  const chains = Array.from(byChain.entries()).sort(
    (a, b) =>
      new Date(a[1][0].timestamp).getTime() -
      new Date(b[1][0].timestamp).getTime(),
  )

  const chatMap: Record<string, number> = {}
  const chats: ArchivChat[] = []

  let counter = 0

  for (const [chainId, messages] of chains) {
    counter += 1
    chatMap[chainId] = counter

    const ordered = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    if (ordered.length === 0) continue

    chats.push({
      chat_id: counter,
      first_timestamp: ordered[0].timestamp,
      last_timestamp: ordered[ordered.length - 1].timestamp,
      keywords: extractTopKeywords(
  ordered.map((m) => ({
    content: m.content,
    verified: true,
  })) as any,
  7,
  lang,
),

      entries: ordered.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: m.timestamp,
      })),
    })
  }

  writeLS(CHAT_MAP_KEY, chatMap)
  writeLS(CHAT_COUNTER_KEY, counter)
  writeLS(ARCHIVE_KEY, chats)

  return chats
}


/**
 * Backward-compatible read helper
 */
export function buildArchivChatsFromTriketon(): ArchivChat[] {
  return readLS<ArchivChat[]>(ARCHIVE_KEY) || []
}

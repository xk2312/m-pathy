// lib/archivePairProjection.ts
// GPTM-Galaxy+ · Archive Pair Projection v1.1
// Deterministic question–answer projection from Triketon ledger
// Purpose: Searchable atomic units (NOT UI rendering)

import { writeLS } from './storage'

/**
 * Triketon anchor (ledger entry)
 */
type TriketonAnchor = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  truth_hash: string
  chain_id?: string
}

/**
 * Searchable pair (question → answer)
 */
export interface ArchivePair {
  pair_id: string
  chain_id: string
  user: {
    id: string
    content: string
    timestamp: string
    truth_hash: string
  }
  assistant: {
    id: string
    content: string
    timestamp: string
    truth_hash: string
  }
  keywords: string[]
}

/**
 * Storage keys
 */
const TRIKETON_KEY = 'mpathy:triketon:v1'
const PAIRS_KEY = 'mpathy:archive:pairs:v1'

/**
 * IMPORTANT:
 * We intentionally bypass readLS(TRIKETON_KEY) here.
 * Reason: storage-layer may apply performance trimming for Triketon reads,
 * which would incorrectly cap pair projection (e.g. 6 pairs).
 * For projections we must read the FULL ledger.
 */
function readFullTriketonLedger(): TriketonAnchor[] {
  try {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(TRIKETON_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as TriketonAnchor[]) : []
  } catch {
    return []
  }
}

function extractTopKeywordsFromText(input: string, limit = 7): string[] {
  try {
    const text = (input || '')
      .toLowerCase()
      .replace(/[\u2019’]/g, "'")
      .replace(/[^a-z0-9äöüß\u0600-\u06FF\u0400-\u04FF\u4e00-\u9fff\s-]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!text) return []

    const stop = new Set([
      'and','or','the','a','an','to','of','in','on','for','with','as','at','by','from','is','are','was','were','be','been','being',
      'ich','du','er','sie','es','wir','ihr','sie','und','oder','der','die','das','ein','eine','einer','eines','einem','einen','zu',
      'von','mit','für','auf','im','in','am','an','ist','sind','war','waren','sein','bin','bist','seid','nicht','ja','nein','bitte',
    ])

    const freq = new Map<string, number>()
    const parts = text.split(' ')

    for (const p of parts) {
      const w = p.trim()
      if (!w) continue
      if (w.length < 3) continue
      if (stop.has(w)) continue
      freq.set(w, (freq.get(w) || 0) + 1)
    }

    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([w]) => w)
  } catch {
    return []
  }
}

/**
 * Build deterministic Q→A pairs from Triketon ledger
 *
 * Rules:
 * - Only user → assistant
 * - Assistant must immediately follow the user (ignoring system)
 * - Same chain_id required
 * - Order strictly by timestamp
 */
export function syncArchivePairsFromTriketon(): ArchivePair[] {
  const anchors = readFullTriketonLedger()

  // group by chain_id
  const byChain = new Map<string, TriketonAnchor[]>()

  for (const a of anchors) {
    if (!a || typeof a.chain_id !== 'string') continue
    if (!byChain.has(a.chain_id)) byChain.set(a.chain_id, [])
    byChain.get(a.chain_id)!.push(a)
  }

  const pairs: ArchivePair[] = []

  for (const [chain_id, messages] of byChain.entries()) {
    const ordered = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    for (let i = 0; i < ordered.length - 1; i++) {
      const current = ordered[i]
      const next = ordered[i + 1]

      if (current.role !== 'user') continue
      if (next.role !== 'assistant') continue

      const combinedText = `${current.content}\n${next.content}`
      const keywords = extractTopKeywordsFromText(combinedText, 7)

      pairs.push({
        pair_id: `${current.truth_hash}→${next.truth_hash}`,
        chain_id,
        user: {
          id: current.id,
          content: current.content,
          timestamp: current.timestamp,
          truth_hash: current.truth_hash,
        },
        assistant: {
          id: next.id,
          content: next.content,
          timestamp: next.timestamp,
          truth_hash: next.truth_hash,
        },
        keywords,
      })
    }
  }

  writeLS(PAIRS_KEY, pairs)

  // 🔔 notify UI that archive pairs changed
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mpathy:archive:updated'))
  }

  return pairs
}


/**
 * Backward-compatible read helper (pairs are already materialized)
 */
export function readArchivePairs(): ArchivePair[] {
  try {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(PAIRS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ArchivePair[]) : []
  } catch {
    return []
  }
}

// lib/archivePairProjection.ts
// GPTM-Galaxy+ · Archive Pair Projection v1
// Deterministic question–answer projection from Triketon ledger
// Purpose: Searchable atomic units (NOT UI rendering)

import { readLS, writeLS } from './storage'
import { extractTopKeywords } from './keywordExtract'

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
 * Build deterministic Q→A pairs from Triketon ledger
 *
 * Rules:
 * - Only user → assistant
 * - Assistant must immediately follow the user (ignoring system)
 * - Same chain_id required
 * - Order strictly by timestamp
 */
export function syncArchivePairsFromTriketon(): ArchivePair[] {
  const raw = readLS<unknown>(TRIKETON_KEY)
  const anchors: TriketonAnchor[] = Array.isArray(raw)
    ? (raw as TriketonAnchor[])
    : []

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
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime(),
      )

    for (let i = 0; i < ordered.length - 1; i++) {
      const current = ordered[i]
      const next = ordered[i + 1]

      if (current.role !== 'user') continue
      if (next.role !== 'assistant') continue

      const keywordEntries = [
        {
          id: current.id,
          role: 'user',
          content: current.content,
          timestamp: current.timestamp,
          truth_hash: current.truth_hash,
        },
        {
          id: next.id,
          role: 'assistant',
          content: next.content,
          timestamp: next.timestamp,
          truth_hash: next.truth_hash,
        },
      ] as Parameters<typeof extractTopKeywords>[0]

      const keywords = extractTopKeywords(keywordEntries, 7)

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
  return pairs
}

/**
 * Backward-compatible read helper
 */
export function readArchivePairs(): ArchivePair[] {
  return readLS<ArchivePair[]>(PAIRS_KEY) || []
}

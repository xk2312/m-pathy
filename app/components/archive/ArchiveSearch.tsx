// components/archive/ArchiveSearch.tsx
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Archive Search - logic only (MEFL)

import { readLS } from '@/lib/storage'
import { limitNodes } from '@/lib/performance'

type TriketonAnchor = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  chain_id: string
}

export type SearchResult = {
  pair_id: string
  chain_id: string
  timestamp_start: string
  timestamp_end: string
  user: {
    preview: string
    matched: boolean
    matched_keywords: string[]
  }
  assistant: {
    preview: string
    matched: boolean
    matched_keywords: string[]
  }
}

export function runArchiveSearch(query: string): SearchResult[] {
  if (query.length < 3) return []

  const q = query.toLowerCase()
  const anchors =
    readLS<TriketonAnchor[]>('mpathy:triketon:v1') ?? []

  const results: SearchResult[] = []

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]
    const b = anchors[i + 1]

    if (a.chain_id !== b.chain_id) continue
    if (a.role !== 'user') continue
    if (b.role !== 'assistant') continue

    const userMatch = a.content.toLowerCase().includes(q)
    const assistantMatch = b.content.toLowerCase().includes(q)

    if (!userMatch && !assistantMatch) continue

    results.push({
      pair_id: `${a.chain_id}:${a.id}`,
      chain_id: a.chain_id,
      timestamp_start: a.timestamp,
      timestamp_end: b.timestamp,
      user: {
        preview: a.content,
        matched: userMatch,
        matched_keywords: userMatch ? [query] : [],
      },
      assistant: {
        preview: b.content,
        matched: assistantMatch,
        matched_keywords: assistantMatch ? [query] : [],
      },
    })
  }

  return limitNodes(results, 100)
}

export function getArchiveSearchPreview(query: string): string[] {
  if (query.length < 3) return []

  const q = query.toLowerCase()
  const results = runArchiveSearch(query)

  const out: string[] = []
  const seen = new Set<string>()

  const pushWord = (w: string) => {
    const key = w.toLowerCase()
    if (!key.startsWith(q)) return
    if (seen.has(key)) return
    seen.add(key)
    out.push(w)
  }

  for (const r of results) {
    const texts = [r.user.preview, r.assistant.preview]

    for (const t of texts) {
      const words = t.split(/[^0-9A-Za-zÀ-ÿ_'-]+/g).filter(Boolean)
      for (const w of words) {
        pushWord(w)
        if (out.length >= 13) return out
      }
    }

    if (out.length >= 13) return out
  }

  return out
}


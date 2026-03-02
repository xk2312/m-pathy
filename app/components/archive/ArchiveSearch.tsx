// components/archive/ArchiveSearch.tsx
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Archive Search - logic only (MEFL)

import { storageVault } from '@/lib/storageVault'
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

export async function runArchiveSearch(query: string): Promise<SearchResult[]> {  if (query.length < 3) return []

  const q = query.toLowerCase()
const pairs =
  ((await storageVault.get('mpathy:archive:pairs:v1')) as
    | {
        pair_id: string
        chain_id: string
        timestamp_start: string
        timestamp_end: string
        user: { content: string }
        assistant: { content: string }
      }[]
    | undefined) ?? []
  const results: SearchResult[] = []

  for (const p of pairs) {
  const userText = p.user.content
  const assistantText = p.assistant.content

   const userMatch = userText.toLowerCase().includes(q)
const assistantMatch = assistantText.toLowerCase().includes(q)

    if (!userMatch && !assistantMatch) continue

    results.push({
  pair_id: p.pair_id,
  chain_id: p.chain_id,
  timestamp_start: p.timestamp_start,
  timestamp_end: p.timestamp_end,
  user: {
    preview: userText,
        matched: userMatch,
        matched_keywords: userMatch ? [query] : [],
      },
      assistant: {
preview: assistantText,        matched: assistantMatch,
        matched_keywords: assistantMatch ? [query] : [],
      },
    })
  }

  return limitNodes(results, 100)
}

export async function getArchiveSearchPreview(query: string): Promise<string[]> {  if (query.length < 3) return []

  const q = query.toLowerCase()
 const results = await runArchiveSearch(query)

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


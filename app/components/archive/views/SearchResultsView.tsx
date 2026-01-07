'use client'

import type { SearchResult } from '@/components/archive/ArchiveSearch'

type Props = {
  results: SearchResult[]
  selection: { pair_id: string }[]
  addPair: (pair: { pair_id: string }) => void
  removePair: (pair_id: string) => void
  onOpenChat?: (chainId: string) => void
}



function highlightText(text: string, keywords: string[]) {
  if (!keywords.length) return text

  const escaped = keywords.map(k =>
    k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )

  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')

  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-cyan-400">
        {part}
      </span>
    ) : (
      part
    )
  )
}

export default function SearchResultsView({
  results,
  selection,
  addPair,
  removePair,
}: Props) {
  if (!results.length) return null

  return (
    <section className="space-y-6">
      {results.map((pair) => (
        <div
          key={pair.pair_id}
          className="rounded-lg border border-white/10 p-4 space-y-3"
        >
          <div className="text-xs text-white/50">
            {new Date(pair.timestamp_start).toLocaleString()}
          </div>

          <div className="text-sm">
            {highlightText(pair.user.preview, pair.user.matched_keywords)}
          </div>

          <div className="text-sm text-white/80">
            {highlightText(pair.assistant.preview, pair.assistant.matched_keywords)}
          </div>
        </div>
      ))}
    </section>
  )
}

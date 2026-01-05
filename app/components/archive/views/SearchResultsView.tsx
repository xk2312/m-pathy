'use client'

import type { SearchResult } from '@/components/archive/ArchiveSearch'

type Props = {
  results: SearchResult[]
}

export default function SearchResultsView({ results }: Props) {
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
            {pair.user.preview}
          </div>

          <div className="text-sm text-white/80">
            {pair.assistant.preview}
          </div>
        </div>
      ))}
    </section>
  )
}

'use client'

import type { SearchResult } from '@/components/archive/ArchiveSearch'

type SelectedPair = {
  pair_id: string
}

type Props = {
  results: SearchResult[]
  selection: SelectedPair[]
  addPair: (pair: SelectedPair) => void
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

  const isSelected = (pair_id: string) =>
    selection.some(p => p.pair_id === pair_id)


  return (
    <section className="space-y-6">
      {results.map((pair) => {
  const selected = isSelected(pair.pair_id)

  return (
    <div
      key={pair.pair_id}
      className="rounded-lg border border-white/10 p-4 space-y-3 relative"
    >
      <button
        type="button"
        onClick={() =>
          selected
            ? removePair(pair.pair_id)
            : addPair({ pair_id: pair.pair_id })
        }
        className="
          absolute
          top-3
          right-3
          w-7
          h-7
          rounded-full
          flex
          items-center
          justify-center
          text-sm
          font-medium
          border
          transition
          cursor-pointer
          bg-[#121418]
          border-border-soft
          hover:border-cyan-500
          hover:text-cyan-400
        "
        aria-label={selected ? 'Remove from selection' : 'Add to selection'}
      >
        {selected ? '−' : '+'}
      </button>

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
  )
})}

    </section>
  )
}

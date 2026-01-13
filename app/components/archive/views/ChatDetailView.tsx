'use client'

import { readLS } from '@/lib/storage'
import type { ArchivePair } from '@/lib/storage'

type TriketonAnchor = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  chain_id: string
}

type MessagePair = {
  pair_id: string
  timestamp_start: string
  timestamp_end: string
  user: {
    content: string
  }
  assistant: {
    content: string
  }
}
function highlightText(text: string, term?: string) {
  if (!term || term.length < 3) return text

  const parts = text.split(new RegExp(`(${term})`, 'gi'))

  return parts.map((p, i) =>
    p.toLowerCase() === term.toLowerCase() ? (
      <span
  key={i}
  className="
    text-cyan-400
    font-medium
    bg-cyan-400/10
    rounded-sm
    px-[5px]
  "
>
  {p}
</span>

    ) : (
      p
    )
  )
}

type SelectedPair = {
  pair_id: string
}

type Props = {
  chain_id: string
  onClose: () => void
  highlight?: string
  selection: SelectedPair[]
addPair: (pair: ArchivePair) => void
  removePair: (pair_id: string) => void
}




export default function ChatDetailView({
  chain_id,
  onClose,
  highlight,
  selection,
  addPair,
  removePair,
}: Props) {

  const isSelected = (pair_id: string) =>
    selection.some(p => p.pair_id === pair_id)

  const anchors =
    readLS<TriketonAnchor[]>('mpathy:triketon:v1') ?? []

  const pairs: MessagePair[] = []

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]
    const b = anchors[i + 1]

    if (a.chain_id !== chain_id) continue
    if (b.chain_id !== chain_id) continue
    if (a.role !== 'user') continue
    if (b.role !== 'assistant') continue

    pairs.push({
      pair_id: `${chain_id}:${a.id}`,
      timestamp_start: a.timestamp,
      timestamp_end: b.timestamp,
      user: {
        content: a.content,
      },
      assistant: {
        content: b.content,
      },
    })
  }

 return (
  <section className="flex flex-col gap-6">
    <button
      onClick={onClose}
      className="
        self-start
        text-sm
        text-text-muted
        hover:text-text-primary
        transition
      "
    >
      ← Back
    </button>

    <div className="space-y-6">
      {pairs.map((pair) => {


  const selected = isSelected(pair.pair_id)

  return (
    <div
      key={pair.pair_id}
      className="rounded-lg border border-white/10 p-4 space-y-3 relative"
    >
      <button
        type="button"
       onClick={() => {
  if (selected) {
    removePair(pair.pair_id)
    return
  }

  const archivePair: ArchivePair = {
    pair_id: pair.pair_id,
    chain_id,
    user: {
      id: `${pair.pair_id}:user`,
      content: pair.user.content,
      timestamp: pair.timestamp_start,
    },
    assistant: {
      id: `${pair.pair_id}:assistant`,
      content: pair.assistant.content,
      timestamp: pair.timestamp_end,
    },
  }

  addPair(archivePair)
}}

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
        {highlightText(pair.user.content, highlight)}
      </div>

      <div className="text-sm text-white/80">
        {highlightText(pair.assistant.content, highlight)}
      </div>
    </div>
  )
})}

      </div>
    </section>
  )
}

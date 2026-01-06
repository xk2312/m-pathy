'use client'

import { readLS } from '@/lib/storage'

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

type Props = {
  chain_id: string
  onClose: () => void
  highlight?: string
}


export default function ChatDetailView({ chain_id, onClose, highlight }: Props) {

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
    <section className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">Chat</div>
        <button
          onClick={onClose}
          className="text-sm text-text-muted hover:text-text-primary transition"
        >
          Close
        </button>
      </div>

      <div className="space-y-6">
        {pairs.map((pair) => (
          <div
            key={pair.pair_id}
            className="rounded-lg border border-white/10 p-4 space-y-3"
          >
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
        ))}
      </div>
    </section>
  )
}

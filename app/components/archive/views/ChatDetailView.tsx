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

type Props = {
  chain_id: string
  onClose: () => void
}

export default function ChatDetailView({ chain_id, onClose }: Props) {
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
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="text-lg font-medium">Chat</div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
        {pairs.map((pair) => (
          <div
            key={pair.pair_id}
            className="rounded-lg border border-white/10 p-4 space-y-3"
          >
            <div className="text-xs text-white/50">
              {new Date(pair.timestamp_start).toLocaleString()}
            </div>

            <div className="text-sm">
              {pair.user.content}
            </div>

            <div className="text-sm text-white/80">
              {pair.assistant.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

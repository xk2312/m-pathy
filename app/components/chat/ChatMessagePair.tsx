  // ChatMessagePair.tsx ist aktuell nicht im EInsatz, aber startklar für die Formatiering der Archivnachichten-Pairs


'use client'

import clsx from 'clsx'

type Props = {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  mode?: 'live' | 'archive'
  highlight?: string
  selectable?: boolean
  selected?: boolean
  onToggleSelect?: () => void
}

function highlightText(text: string, term?: string) {
  if (!term || term.length < 3) return text

  const regex = new RegExp(`(${term})`, 'ig')
  const parts = text.split(regex)

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-cyan-400/20 text-cyan-300 rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export default function ChatMessagePair({
  role,
  content,
  timestamp,
  mode = 'live',
  highlight,
  selectable = false,
  selected = false,
  onToggleSelect,
}: Props) {
  const isUser = role === 'user'

  return (
    <div
      className={clsx(
        'group relative flex w-full gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Selection (+ / −) */}
      {selectable && (
        <button
          onClick={onToggleSelect}
          className={clsx(
            'absolute top-2',
            isUser ? 'right-full mr-2' : 'left-full ml-2',
            'opacity-0 group-hover:opacity-100 transition',
            'text-xs rounded-full w-6 h-6 flex items-center justify-center',
            selected
              ? 'bg-cyan-500 text-black'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          )}
          aria-label={selected ? 'Unselect message' : 'Select message'}
        >
          {selected ? '−' : '+'}
        </button>
      )}

      {/* Bubble */}
      <div
        className={clsx(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-white/10 text-white'
            : 'bg-black/40 text-white/90'
        )}
      >
        <div className="whitespace-pre-wrap break-words">
          {highlightText(content, highlight)}
        </div>

        {timestamp && (
          <div className="mt-1 text-[10px] text-white/40">
            {new Date(timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}

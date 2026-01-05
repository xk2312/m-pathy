'use client'

import { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { MessageSquare } from 'lucide-react'

type ChatDisplay = {
  chat_serial: number
  keywords: string[]
  messageCount: number
  lastTimestamp: string
}

type Props = {
  onOpenChat?: (chainId: string) => void
}

export default function RecentChatsView({ onOpenChat }: Props) {
  const [chats, setChats] = useState<ChatDisplay[]>([])

  useEffect(() => {
    const base = getRecentChats(13)

    const mapped = base.map((chat) => ({
      chat_serial: chat.chat_serial,
      keywords: chat.keywords ?? [],
      messageCount: chat.messages?.length ?? 0,
      lastTimestamp: chat.last_timestamp,
    }))

    setChats(mapped)
  }, [])

  return (
    <section className="flex flex-col gap-16">
      <div className="text-xs text-text-muted tracking-wide">
        Recent chats
      </div>

      {chats.map((chat) => (
        <article
          key={chat.chat_serial}
          className="
            group
            rounded-xl
            px-8
            py-7
            -mx-4
            cursor-pointer
            transition
            bg-surface-1
            hover:bg-surface-2
          "
        >
          <div className="flex gap-6">
            <div className="pt-1 text-text-muted group-hover:text-text-secondary transition">
              <MessageSquare size={18} />
            </div>

            <div className="flex flex-col gap-5 flex-1">
              <div className="flex items-baseline justify-between gap-6">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <div className="text-sm text-text-primary">
                    Chat {chat.chat_serial}
                  </div>

                  <div className="text-xs text-text-muted tracking-wide">
                    [{chat.messageCount} msgs ·{' '}
                    {new Date(chat.lastTimestamp).toLocaleDateString()}]
                  </div>
                </div>

                <div className="text-xs text-text-muted opacity-0 group-hover:opacity-100 transition">
                  View →
                </div>
              </div>

              {chat.keywords.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] uppercase tracking-wider text-text-muted">
                    Keywords
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {chat.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs text-text-secondary select-none"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

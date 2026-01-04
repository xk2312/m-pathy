'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { Input } from '@/components/ui/Input'
import { MessageSquare } from 'lucide-react'

/**
 * NOTE
 * All visible strings are temporary EN placeholders.
 * TODO i18n bindings are marked explicitly.
 *
 * ArchiveOverlay defines the ARCHIVE SPACE.
 * No verify / add actions live here yet.
 */

type ChatDisplay = {
  chat_serial: number
  keywords: string[]
  messageCount: number
  lastTimestamp: string
}

export default function ArchiveOverlay() {
  const [query, setQuery] = useState('')
  const [chats, setChats] = useState<ChatDisplay[]>([])

  useEffect(() => {
    const base = getRecentChats(13)

    const mapped = base.map((chat) => ({
      chat_serial: chat.chat_serial,
      keywords: chat.keywords ?? [],
      messageCount: chat.messages?.length ?? 0,
      lastTimestamp: chat.last_timestamp, // ISO string
    }))

    setChats(mapped)
  }, [])

  return (
    <div className="w-full h-full bg-bg-0 text-text-primary overflow-hidden">
      <div className="mx-auto h-full max-w-[720px] px-8 flex flex-col">

        {/* ───────── Header ───────── */}
        <header className="pt-14 pb-8">
          {/* TODO i18n: archive.title */}
          <h1 className="text-sm font-medium text-text-secondary">
            Archive
          </h1>
        </header>

        {/* ───────── Search ───────── */}
        <section className="pb-10">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // TODO i18n: archive.searchPlaceholder
            placeholder="Search archive…"
            className="
              w-full
              bg-surface-1
              border border-border-soft
              rounded-pill
              px-5 py-3
              text-base
              text-text-primary
              placeholder:text-text-muted
              focus-visible:ring-2
              focus-visible:ring-cyan-500
            "
          />
        </section>

        {/* ───────── Archive Body ───────── */}
        <main className="flex-1 overflow-y-auto pb-32">

          {query.length < 3 && (
            <section className="flex flex-col gap-10">

              {/* TODO i18n: archive.defaultHeader */}
              <div className="text-xs text-text-muted">
                Recent chats
              </div>

              {chats.map((chat) => (
                <article
                  key={chat.chat_serial}
                  className="
                    group
                    flex gap-4
                    cursor-pointer
                  "
                >
                  {/* Icon */}
                  <div className="pt-1 text-text-muted group-hover:text-text-secondary transition">
                    <MessageSquare size={16} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2">

                    {/* Title + Meta */}
                    <div className="flex items-baseline gap-3 flex-wrap">

                      {/* TODO i18n: archive.chatNumber */}
                      <div className="text-sm text-text-secondary">
                        Chat {chat.chat_serial}
                      </div>

                      {/* Meta capsule */}
                      <div className="text-xs text-text-muted tracking-wide">
                        [
                        {/* TODO i18n: archive.totalMessages */}
                        {chat.messageCount} msgs ·{' '}
                        {/* TODO i18n: archive.lastUpdated */}
                        {new Date(chat.lastTimestamp).toLocaleDateString()}
                        ]
                      </div>
                    </div>

                    {/* Keywords */}
                    {chat.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 pl-0.5">
                        {chat.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="
                              text-xs
                              text-text-muted
                              select-none
                            "
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* SEARCH STATE (placeholder) */}
          {query.length >= 3 && (
            <section className="pt-8">
              {/* TODO i18n: archive.noResults */}
              <div className="text-sm text-text-muted">
                No matches.
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

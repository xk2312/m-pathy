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
 * UX is optimized for non-technical users.
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
      lastTimestamp: chat.last_timestamp,
    }))

    setChats(mapped)
  }, [])

  return (
    <div className="w-full h-full bg-bg-0 text-text-primary overflow-hidden">
      <div className="mx-auto h-full max-w-[760px] px-8 flex flex-col">

        {/* ───────── Header ───────── */}
        <header className="pt-14 pb-8">
          {/* TODO i18n: archive.title */}
          <h1 className="text-lg font-medium text-text-primary">
            Archive
          </h1>
        </header>

        {/* ───────── Search (primary entry) ───────── */}
        <section className="pb-12">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // TODO i18n: archive.searchPlaceholder
            placeholder="Search your chats…"
            className="
              w-full
              bg-surface-1
              border border-border-soft
              rounded-pill
              px-6 py-4
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
            <section className="flex flex-col gap-8">

              {/* TODO i18n: archive.defaultHeader */}
              <div className="text-xs text-text-muted">
                Recent chats
              </div>

              {chats.map((chat) => (
                <article
                  key={chat.chat_serial}
                  className="
                    group
                    rounded-m
                    px-4 py-3
                    -mx-4
                    transition
                    hover:bg-surface-1
                    cursor-pointer
                  "
                >
                  <div className="flex gap-4">

                    {/* Icon */}
                    <div className="pt-1 text-text-muted group-hover:text-text-secondary transition">
                      <MessageSquare size={16} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2 flex-1">

                      {/* Title + Meta + CTA */}
                      <div className="flex items-baseline justify-between gap-4">

                        <div className="flex items-baseline gap-3 flex-wrap">
                          {/* TODO i18n: archive.chatNumber */}
                          <div className="text-sm text-text-secondary">
                            Chat {chat.chat_serial}
                          </div>

                          <div className="text-xs text-text-muted tracking-wide">
                            [
                            {chat.messageCount} msgs ·{' '}
                            {new Date(chat.lastTimestamp).toLocaleDateString()}
                            ]
                          </div>
                        </div>

                        {/* CTA */}
                        <div
                          className="
                            text-xs
                            text-text-muted
                            opacity-60
                            group-hover:opacity-100
                            transition
                          "
                        >
                          {/* TODO i18n: archive.viewChat */}
                          View →
                        </div>
                      </div>

                      {/* Keywords */}
                      {chat.keywords.length > 0 && (
                        <div className="pt-1 flex flex-col gap-1">

                          {/* TODO i18n: archive.keywords */}
                          <div className="text-[10px] uppercase tracking-wider text-text-muted">
                            Keywords
                          </div>

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
                        </div>
                      )}
                    </div>
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

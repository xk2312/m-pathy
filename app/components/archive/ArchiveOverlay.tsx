'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { Input } from '@/components/ui/Input'

/**
 * NOTE
 * All visible strings are temporary EN placeholders.
 * Each marked TODO must later be wired to i18nArchive.en.*
 *
 * This file defines the ARCHIVE AS A SPACE.
 * No verify / add actions live here yet.
 */

type ChatDisplay = {
  chat_serial: number
  keywords: string[]
}

export default function ArchiveOverlay() {
  const [query, setQuery] = useState('')
  const [chats, setChats] = useState<ChatDisplay[]>([])

  useEffect(() => {
    const base = getRecentChats(13)

    const mapped = base.map((chat) => ({
      chat_serial: chat.chat_serial,
      keywords: chat.keywords ?? [],
    }))

    setChats(mapped)
  }, [])

  return (
    <div className="w-full h-full bg-bg-0 text-text-primary overflow-hidden">
      {/* ───────────── Outer quiet space ───────────── */}
      <div className="mx-auto h-full max-w-[720px] px-8 flex flex-col">

        {/* ───────────── Header ───────────── */}
        <header className="pt-14 pb-10">
          {/* TODO i18n: archive.title */}
          <h1 className="text-sm font-medium text-text-secondary">
            Archive
          </h1>
        </header>

        {/* ───────────── Search ───────────── */}
        <section className="pb-16">
          <Input
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
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

        {/* ───────────── Archive Body ───────────── */}
        <main className="flex-1 overflow-y-auto pb-32">

          {/* DEFAULT STATE */}
          {query.length < 3 && (
            <section className="flex flex-col gap-16">

              {/* TODO i18n: archive.defaultHeader */}
              <div className="text-xs text-text-muted">
                Recent chats
              </div>

              {chats.map((chat) => (
                <article
                  key={chat.chat_serial}
                  className="
                    group
                    flex flex-col
                    gap-4
                    cursor-pointer
                    transition
                  "
                >
                  {/* Chat header */}
                  <div className="flex items-baseline justify-between">
                    {/* TODO i18n: archive.chatNumber */}
                    <div className="text-sm text-text-secondary">
                      Chat {chat.chat_serial}
                    </div>

                    {/* subtle affordance */}
                    <div
                      className="
                        text-xs
                        text-text-muted
                        opacity-0
                        transition-opacity
                        group-hover:opacity-100
                      "
                    >
                      {/* TODO i18n: archive.tapToOpen */}
                      Open
                    </div>
                  </div>

                  {/* Keywords */}
                  {chat.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pl-1">
                      {chat.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="
                            text-xs
                            text-text-muted
                            tracking-wide
                            select-none
                          "
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* invisible separator via space */}
                  <div className="h-px" />
                </article>
              ))}
            </section>
          )}

          {/* SEARCH STATE */}
          {query.length >= 3 && (
            <section className="pt-8">
              {/* TODO i18n: archive.noResults (placeholder logic only) */}
              <div className="text-sm text-text-muted">
                No matches.
              </div>
            </section>
          )}
        </main>

        {/* ───────────── Sticky Action Container (future) ───────────── */}
        {/*
          NOTE:
          This container is intentionally inactive.
          It will appear only once Selection logic exists.

          TODO i18n targets later:
          - archive.verify
          - archive.addToNewChat
          - archive.clearSelection
        */}
        {/*
        <div className="fixed bottom-6 left-0 right-0 pointer-events-none">
          <div className="mx-auto max-w-[720px] px-8">
            <div
              className="
                pointer-events-auto
                bg-surface-1
                border border-border-soft
                rounded-l
                px-6 py-4
                flex items-center justify-between
              "
            >
              <div className="text-sm text-text-secondary">
                2 / 6 selected
              </div>

              <button className="text-sm text-text-primary">
                Verify
              </button>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  )
}

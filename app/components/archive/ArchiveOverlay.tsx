'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { getChatKeywordClusters } from '@/lib/keywordExtract'
import { Input } from '@/components/ui/Input'

/**
 * NOTE:
 * All visible strings are temporary EN placeholders.
 * These must later be wired to i18nArchive.en.*
 * Each location is explicitly marked.
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

const clusters = base.map((chat) => ({
  chat_serial: chat.chat_serial,
  keywords: chat.keywords ?? [],
}))

setChats(clusters)

  }, [])

  return (
    <div className="w-full h-full bg-bg-0 text-text-primary overflow-hidden">
      {/* Outer quiet space */}
      <div className="mx-auto h-full max-w-[720px] px-8 flex flex-col">

        {/* ───────────────────────────────── Header ───────────────────────────────── */}
        <header className="pt-12 pb-10">
          {/* TODO i18n: archive.title */}
          <h1 className="text-sm font-medium text-text-secondary">
            Archive
          </h1>
        </header>

        {/* ───────────────────────────────── Search ───────────────────────────────── */}
        <section className="pb-14">
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

        {/* ─────────────────────────────── Archive Body ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pb-24">

          {/* Default state: no search */}
          {query.length < 3 && (
            <div className="flex flex-col gap-12">

              {/* TODO i18n: archive.defaultHeader */}
              <div className="text-xs text-text-muted">
                Recent chats
              </div>

              {chats.map((chat) => (
                <article
                  key={chat.chat_serial}
                  className="flex flex-col gap-3"
                >
                  {/* TODO i18n: archive.chatNumber */}
                  <div className="text-xs text-text-muted">
                    Chat {chat.chat_serial}
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {chat.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="
                          text-xs
                          text-text-secondary
                          tracking-wide
                          select-none
                        "
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Search state */}
          {query.length >= 3 && (
            <div className="pt-8">
              {/* TODO i18n: archive.noResults (placeholder logic only) */}
              <div className="text-sm text-text-muted">
                No matches.
              </div>
            </div>
          )}
        </main>

        {/* ─────────────────────────── Sticky Action Container ─────────────────────────── */}
        {/*
          NOTE:
          This container is intentionally NOT active yet.
          It will later render based on Selection.length > 0.

          TODO i18n targets later:
          - archive.verify
          - archive.addToNewChat
          - archive.clearSelection
        */}
        {/* 
        <div className="fixed bottom-6 left-0 right-0 pointer-events-none">
          <div className="mx-auto max-w-[720px] px-8">
            <div className="pointer-events-auto bg-surface-1 border border-border-soft rounded-l px-6 py-4 flex items-center justify-between">
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

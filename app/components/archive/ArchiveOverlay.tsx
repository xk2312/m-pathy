'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { Input } from '@/components/ui/Input'
import { MessageSquare } from 'lucide-react'

/**
 * ============================================================
 * ARCHIVE OVERLAY — COUNCIL FIX
 * ============================================================
 *
 * Goals:
 * - full-height sovereign archive space
 * - clear vertical zoning (Header / Search / Content)
 * - object-level hover (not CTA-only)
 * - DAU-friendly interaction
 *
 * All strings = EN placeholders
 * TODO i18n bindings marked explicitly
 * ============================================================
 */

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type ChatDisplay = {
  chat_serial: number
  keywords: string[]
  messageCount: number
  lastTimestamp: string
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function ArchiveOverlay() {
  const [query, setQuery] = useState('')
  const [chats, setChats] = useState<ChatDisplay[]>([])

  /* -------------------------------------------------------------- */
  /* Data bootstrap                                                 */
  /* -------------------------------------------------------------- */

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

  /* -------------------------------------------------------------- */
  /* Render                                                         */
  /* -------------------------------------------------------------- */

  return (
    <div
      className="
        w-full
        h-full
        bg-bg-0
        text-text-primary
      "
    >
      {/* ========================================================= */}
      {/* CENTER COLUMN                                             */}
      {/* ========================================================= */}
      <div
        className="
          mx-auto
          h-full
          max-w-[760px]
          px-8
          flex
          flex-col
        "
      >

        {/* ===================================================== */}
        {/* HEADER ZONE (Orientation)                              */}
        {/* ===================================================== */}
        <header
          className="
            pt-20
            pb-14
            flex
            flex-col
            gap-4
          "
        >
          {/* TODO i18n: archive.title */}
          <h1
            className="
              text-2xl
              font-medium
              text-text-primary
              tracking-tight
            "
          >
            Archive
          </h1>
        </header>

        {/* ===================================================== */}
        {/* SEARCH ZONE (Primary Action)                           */}
        {/* ===================================================== */}
        <section
          className="
            pb-20
          "
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // TODO i18n: archive.searchPlaceholder
            placeholder="Search your chats…"
            className="
              w-full
              bg-surface-1
              border
              border-border-soft
              rounded-pill
              px-7
              py-6
              text-base
              text-text-primary
              placeholder:text-text-muted
              focus-visible:ring-2
              focus-visible:ring-cyan-500
            "
          />
        </section>

        {/* ===================================================== */}
        {/* CONTENT ZONE (Scrollable)                              */}
        {/* ===================================================== */}
        <main
          className="
            flex-1
            overflow-y-auto
            pb-32
          "
        >

          {/* ---------------- Default state ---------------- */}
          {query.length < 3 && (
            <section
              className="
                flex
                flex-col
                gap-12
              "
            >
              {/* TODO i18n: archive.defaultHeader */}
              <div className="text-xs text-text-muted">
                Recent chats
              </div>

              {/* ================= Chat list ================= */}
              {chats.map((chat) => (
                <article
                  key={chat.chat_serial}
                  className="
                    group
                    rounded-l
                    px-6
                    py-5
                    -mx-6
                    cursor-pointer
                    transition
                    bg-transparent
                    hover:bg-surface-2
                  "
                >
                  <div className="flex gap-5">

                    {/* Icon */}
                    <div
                      className="
                        pt-1
                        text-text-muted
                        group-hover:text-text-secondary
                        transition
                      "
                    >
                      <MessageSquare size={18} />
                    </div>

                    {/* Content */}
                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        flex-1
                      "
                    >
                      {/* Title + Meta + CTA */}
                      <div
                        className="
                          flex
                          items-baseline
                          justify-between
                          gap-6
                        "
                      >
                        <div
                          className="
                            flex
                            items-baseline
                            gap-4
                            flex-wrap
                          "
                        >
                          {/* TODO i18n: archive.chatNumber */}
                          <div className="text-sm text-text-secondary">
                            Chat {chat.chat_serial}
                          </div>

                          <div
                            className="
                              text-xs
                              text-text-muted
                              tracking-wide
                            "
                          >
                            [
                            {chat.messageCount} msgs ·{' '}
                            {new Date(chat.lastTimestamp).toLocaleDateString()}
                            ]
                          </div>
                        </div>

                        {/* CTA (part of object) */}
                        <div
                          className="
                            text-xs
                            text-text-muted
                            opacity-0
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
                        <div className="flex flex-col gap-2">
                          {/* TODO i18n: archive.keywords */}
                          <div
                            className="
                              text-[10px]
                              uppercase
                              tracking-wider
                              text-text-muted
                            "
                          >
                            Keywords
                          </div>

                          <div
                            className="
                              flex
                              flex-wrap
                              gap-x-4
                              gap-y-1.5
                            "
                          >
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

          {/* ---------------- Search state ---------------- */}
          {query.length >= 3 && (
            <section className="pt-16">
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

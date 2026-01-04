'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { Input } from '@/components/ui/Input'
import { MessageSquare } from 'lucide-react'

/**
 * ============================================================
 * ARCHIVE OVERLAY — RESET BUILD (README v1.1 + Addendum v1.2)
 * ============================================================
 *
 * - sovereign system layer (opaque, blocking)
 * - clear vertical dramaturgy
 * - archive is a mode, not a list
 * - DAU-readable, CI-bound
 *
 * No legacy assumptions.
 * No chat bleed-through.
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
  /* Bootstrap                                                      */
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
    /* ============================================================ */
    /* SYSTEM LAYER (blocks chat beneath)                            */
    /* ============================================================ */
    <div
      className="
        fixed inset-0 z-50
        bg-bg-0
        text-text-primary
        overflow-hidden
      "
    >
      {/* Dim & deactivate underlying app */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-black/40
        "
      />

      {/* ========================================================== */}
      {/* ARCHIVE SPACE                                              */}
      {/* ========================================================== */}
      <div
        className="
          relative z-10
          mx-auto
          h-full
          max-w-[820px]
          px-10
          flex
          flex-col
        "
      >
        {/* ====================================================== */}
        {/* HEADER — ORIENTATION                                   */}
        {/* ====================================================== */}
        <header
          className="
            pt-24
            pb-16
            flex
            flex-col
            gap-6
          "
        >
          {/* TODO i18n: archive.title */}
          <h1
            className="
              text-3xl
              font-medium
              tracking-tight
            "
          >
            Archive
          </h1>

          {/* TODO i18n: archive.subtitle */}
          <p
            className="
              text-sm
              text-text-secondary
              max-w-[520px]
            "
          >
            Browse, review, and select past conversations.
          </p>
        </header>

        {/* ====================================================== */}
        {/* SEARCH — PRIMARY ACTION                                 */}
        {/* ====================================================== */}
        <section
          className="
            pb-24
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
              px-8
              py-7
              text-base
              placeholder:text-text-muted
              focus-visible:ring-2
              focus-visible:ring-cyan-500
            "
          />
        </section>

        {/* ====================================================== */}
        {/* CONTENT — SCROLLABLE LIST                               */}
        {/* ====================================================== */}
        <main
          className="
            flex-1
            overflow-y-auto
            pb-40
          "
        >
          {/* ================= DEFAULT STATE ================= */}
          {query.length < 3 && (
            <section
              className="
                flex
                flex-col
                gap-14
              "
            >
              {/* TODO i18n: archive.recent */}
              <div className="text-xs text-text-muted tracking-wide">
                Recent chats
              </div>

              {/* ================= CHAT CARDS ================= */}
              {chats.map((chat) => (
                <article
                  key={chat.chat_serial}
                  className="
                    group
                    rounded-xl
                    px-7
                    py-6
                    -mx-2
                    cursor-pointer
                    transition
                    bg-surface-1
                    hover:bg-surface-2
                  "
                >
                  <div className="flex gap-6">
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
                    <div className="flex flex-col gap-5 flex-1">
                      {/* Title + Meta */}
                      <div className="flex items-baseline gap-4 flex-wrap">
                        {/* TODO i18n: archive.chatLabel */}
                        <div className="text-sm text-text-primary">
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

                          <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {chat.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="
                                  text-xs
                                  text-text-secondary
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

          {/* ================= SEARCH STATE ================= */}
          {query.length >= 3 && (
            <section className="pt-20">
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

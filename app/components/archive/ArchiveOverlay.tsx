'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { Input } from '@/components/ui/Input'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * ============================================================
 * ARCHIVE OVERLAY — FULL RESET (FIXED)
 * ============================================================
 *
 * - Full sovereign system space (no dim-layer tricks)
 * - Overlay REPLACES the app visually
 * - No prompt, no sidebar, no bleed-through
 * - Strong vertical dramaturgy
 * - VIEW affordance restored
 *
 * Canonical per README + Addendum.
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
  const router = useRouter()


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

  // 🔒 hard block background (prompt, chat, scroll)
  const originalOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  return () => {
    document.body.style.overflow = originalOverflow
  }
}, [])


  /* -------------------------------------------------------------- */
  /* Render                                                         */
  /* -------------------------------------------------------------- */

  return (
    /* ============================================================ */
    /* SYSTEM SPACE — FULL TAKEOVER                                  */
    /* ============================================================ */
  <div
  className="
    fixed inset-0 z-[2147483647]
    bg-gradient-to-b
    from-[#121418]
    via-[#0C0C0C]
    to-[#080808]
    text-text-primary
    overflow-hidden
  "
>


      {/* ========================================================== */}
      {/* CONTENT FRAME — FULL BLEED                                 */}
      {/* ========================================================== */}
      <div className="w-full h-full overflow-y-auto">
        <div
          className="
            max-w-[920px]
            mx-auto
            px-12
            flex
            flex-col
          "
        >
          {/* ====================================================== */}
          {/* HEADER — ORIENTATION                                   */}
          {/* ====================================================== */}
         <header
  className="
    pt-28
    pb-18
    flex
    flex-col
    gap-6
    relative
  "
>
  {/* Close Overlay */}
  <button
  aria-label="Close archive"
  className="
    absolute
    top-8
    right-8
    text-text-muted
    hover:text-text-primary
    transition
  "
  onClick={() => router.push('/page2')}
>
  ✕
</button>


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
                max-w-[560px]
              "
            >
              Browse, review, and select past conversations.
            </p>
          </header>

          {/* ====================================================== */}
          {/* SEARCH — PRIMARY ACTION                                 */}
          {/* ====================================================== */}
          <section className="pb-24">
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
          {/* CONTENT — CHAT LIST                                    */}
          {/* ====================================================== */}
          <main className="pb-40">
            {/* ================= DEFAULT STATE ================= */}
            {query.length < 3 && (
              <section
                className="
                  flex
                  flex-col
                  gap-16
                "
              >
                {/* TODO i18n: archive.recent */}
                <div className="text-xs text-text-muted tracking-wide">
                  Recent chats
                </div>

                {/* ================= CHAT OBJECTS ================= */}
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
                        {/* Title / Meta / VIEW */}
                        <div
                          className="
                            flex
                            items-baseline
                            justify-between
                            gap-6
                          "
                        >
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

                          {/* VIEW affordance */}
                          <div
                            className="
                              text-xs
                              text-text-muted
                              opacity-0
                              group-hover:opacity-100
                              transition
                            "
                          >
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
    </div>
  )
}

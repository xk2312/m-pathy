/**
 * =========================================================
 *  ARCHIVE OVERLAY — SYSTEM STAGE (Canonical)
 * =========================================================
 *
 *  ROLE
 *  ----
 *  Owns the Archive as a SYSTEM SPACE.
 *  Orchestrates structure, not content.
 *
 *  This file is allowed to be LARGE.
 *  This file is NOT allowed to render domain logic.
 *
 *  =========================================================
 *  INDEX (Jump Anchors)
 *  =========================================================
 *
 *  [ANCHOR:INTENT]
 *    - File responsibility & non-responsibility
 *    - What this file MUST do
 *    - What this file MUST NEVER do
 *
 *  [ANCHOR:SPACE]
 *    - Overlay as system room
 *    - Chat blocking & ownership
 *    - Scroll & background contract
 *
 *  [ANCHOR:STATE]
 *    - Archive view state (Recent | Search | Detail | Empty)
 *    - Search threshold rules (0–2 | ≥3)
 *    - No business logic, only switching
 *
 *  [ANCHOR:LAYOUT]
 *    - Structural composition
 *    - Header / Search / Body / Footer
 *    - Z-order & stacking context
 *
 *  [ANCHOR:HEADER]
 *    - ArchiveHeader integration
 *    - Title invariance ("Archive")
 *    - Context label switching (view descriptor only)
 *
 *  [ANCHOR:SEARCH]
 *    - ArchiveSearch wiring
 *    - Input → Body decision flow
 *    - No filtering logic here
 *
 *  [ANCHOR:BODY]
 *    - Body as the ONLY dynamic region
 *    - View switch:
 *        • RecentChatsView
 *        • SearchResultsView
 *        • ChatDetailView
 *        • EmptyStateView
 *
 *  [ANCHOR:SELECTION]
 *    - Global Selection container ownership
 *    - Selection visibility rules (0 | 1–5 | 6)
 *    - No intent binding here
 *
 *  [ANCHOR:ACTIONS]
 *    - ArchiveActions integration
 *    - Intent dispatch (verify | add)
 *    - Post-action cleanup responsibility
 *
 *  [ANCHOR:FOOTER]
 *    - ArchiveUIFinish integration
 *    - Branding & trust closure
 *    - No primary actions allowed
 *
 *  [ANCHOR:REPORTS]
 *    - Explicit NON-OWNERSHIP of reports
 *    - Archive may link, never render
 *
 *  [ANCHOR:EXTENSION]
 *    - How to add new Archive views
 *    - Rules for future overlays
 *
 *  [ANCHOR:ANTI-DRIFT]
 *    - Forbidden patterns
 *    - Stop conditions
 *
 * =========================================================
 *  ANTI-DRIFT GUARANTEE
 * =========================================================
 *
 *  If any of the following appears in this file,
 *  the implementation is INVALID:
 *
 *  - Rendering of message pairs
 *  - Search filtering or scoring logic
 *  - Report rendering
 *  - Business rules beyond view switching
 *  - CSS-based prompt suppression
 *
 * =========================================================
 *  CANONICAL MENTAL MODEL
 * =========================================================
 *
 *  Header  → Identity
 *  Search  → Decision
 *  Body    → Truth
 *  Footer  → Closure
 *
 *  Overlay = Stage
 *  Views   = Scenes
 *  Logic   = Orchestra Pit
 *
 * =========================================================
 */

'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { readLS } from '@/lib/storage'
import { Input } from '@/components/ui/Input'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SearchResultsView from './views/SearchResultsView'
import RecentChatsView from './views/RecentChatsView'
import EmptyStateView from './views/EmptyStateView'
import ChatDetailView from './views/ChatDetailView'
import { runArchiveSearch } from './ArchiveSearch'






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
  const [openChainId, setOpenChainId] = useState<string | null>(null)
  const router = useRouter()
  const resolveChainIdFromChatSerial = (chatSerial: string) => {
  const chat = getRecentChats(13).find(
    (c) => String(c.chat_serial) === chatSerial
  )

  if (!chat) return null

  const anchors =
    readLS<{ timestamp: string; chain_id: string }[]>('mpathy:triketon:v1') ?? []

  const start = Date.parse(chat.first_timestamp)
  const end = Date.parse(chat.last_timestamp)

  const hit = anchors.find((a) => {
    const t = Date.parse(a.timestamp)
    return t >= start && t <= end
  })

  return hit?.chain_id ?? null
}



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

  // ✅ hard-hide prompt while archive is mounted (no routing assumptions)
  const promptEl = document.querySelector('.prompt-root-scene') as HTMLElement | null
  const originalPromptDisplay = promptEl?.style.display
  if (promptEl) promptEl.style.display = 'none'

  return () => {
    document.body.style.overflow = originalOverflow
    if (promptEl) promptEl.style.display = originalPromptDisplay ?? ''
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
    fixed
    inset-0
    z-[2147483647]
    bg-gradient-to-b
    from-[#121418]
    via-[#0C0C0C]
    to-[#080808]
    text-text-primary
    overflow-hidden
    pr-[30px]
    pb-[30px]
    pl-[30px]
  "
>








      {/* ========================================================== */}
{/* CONTENT FRAME — FULL BLEED                                 */}
{/* ========================================================== */}
<div className="w-full h-full flex flex-col">

  <div
    className="
      w-full
      max-w-[920px]
      mx-auto
      flex
      flex-col
      h-full
      relative
    "
  >

    {/* ====================================================== */}
    {/* HEADER — ORIENTATION                                   */}
    {/* ====================================================== */}
    <header
      className="
        pb-4
        flex
        flex-col
        gap-4
      "
    >
      <h1
        className="
          text-3xl
          font-medium
          tracking-tight
        "
      >
        Archive
      </h1>

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
    {/* SEARCH + CLOSE                                         */}
    {/* ====================================================== */}
    <section
      className="
        w-full
        bg-[#0C0C0C]
        rounded-xl
        px-6
        py-4
        relative
      "
    >
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your chats…"
        className="
          w-full
          bg-[#121418]
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

      <button
        type="button"
        aria-label="Close Archive"
        onClick={(e) => {
          e.stopPropagation()
          window.dispatchEvent(
            new CustomEvent('mpathy:archive:close')
          )
        }}
        className="
          absolute
          -top-3
          right-0
          translate-x-[30px]
          z-50
          cursor-pointer
          pointer-events-auto
          text-sm
          text-secondary
          hover:text-text-primary
          transition
        "
      >
        ✕
      </button>
    </section>

    {/* ====================================================== */}
    {/* BODY                                                   */}
    {/* ====================================================== */}
    <div className="flex-1 overflow-y-auto mt-[15px]">
      {(() => {
        type ArchiveView = 'recent' | 'search' | 'detail' | 'empty'

let view: ArchiveView

if (openChainId) {
  view = 'detail'
} else if (query.length < 3) {
  view = 'recent'
} else {
  view = 'search'
}


        switch (view) {
  case 'recent':
    return (
     <RecentChatsView
  onOpenChat={(chatSerial: string) => {
    const chainId = resolveChainIdFromChatSerial(chatSerial)
    if (chainId) {
      setOpenChainId(chainId)
    }
  }}
/>

    )

  case 'search': {
    const results = runArchiveSearch(query)
    return (
      <SearchResultsView
  results={results}
  onOpenChat={(chatSerial: string) => {
    const chainId = resolveChainIdFromChatSerial(chatSerial)
    if (chainId) {
      setOpenChainId(chainId)
    }
  }}
/>

    )
  }

  case 'detail':
  if (!openChainId) return null

  return (
    <ChatDetailView
      chain_id={openChainId}
      onClose={() => {
        setOpenChainId(null)
      }}
    />
  )


  default:
    return null
}

      })()}
    </div>

    {/* ====================================================== */}
    {/* FOOTER FADE                                            */}
    {/* ====================================================== */}
    <footer
      className="
        h-16
        mt-6
        bg-gradient-to-t
        from-[#080808]
        to-transparent
        pointer-events-none
      "
    />

  </div>
</div>

    </div>
  )
}


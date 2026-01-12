/**
 * ============================================================================
 * INVENTUS INDEX — ArchiveOverlay.tsx
 * ============================================================================
 *
 * ZWECK
 * -----
 * Vollständiger UI-Orchestrator für das Archiv-System.
 * Diese Datei ist die zentrale Steuerinstanz für:
 *   - Anzeige vergangener Chats
 *   - Suche & Preview
 *   - Auswahl einzelner Message-Paare
 *   - Übergabe der Selection an Verify / Add-to-Chat
 *   - Initialisierung systemweiter Listener (Verify)
 *
 * KEINE Business-Logik.
 * KEINE Kryptographie.
 * KEINE Server-Logik.
 *
 *
 * ============================================================================
 * HAUPTVERANTWORTUNG
 * ============================================================================
 *
 * - UI-State (Query, View, Selection, Open Chat)
 * - Event-Dispatching (Verify, Close, Selection-Clear)
 * - Persistenz der Selection (SessionStorage)
 * - Reine Weitergabe von Daten an Subviews
 *
 *
 * ============================================================================
 * EXTERNE ABHÄNGIGKEITEN (KRITISCH)
 * ============================================================================
 *
 * Storage:
 *   - readSS / writeSS
 *     Key: 'mpathy:archive:selection:v1'
 *
 * Listener:
 *   - initArchiveVerifyListener()
 *     → MUSS exakt EINMAL beim Mount ausgeführt werden
 *
 * Archive-Daten:
 *   - getRecentChats()
 *   - runArchiveSearch()
 *   - getArchiveSearchPreview()
 *
 *
 * ============================================================================
 * ZENTRALER UI-STATE
 * ============================================================================
 *
 * query:
 *   - aktueller Suchstring
 *
 * chats:
 *   - reduzierte Metadaten der letzten Chats
 *
 * openChainId:
 *   - wenn gesetzt → Detail-View aktiv
 *
 * selectionState:
 *   {
 *     pairs: ArchivePair[],
 *     updated_at: ISOString
 *   }
 *
 * selection:
 *   - Alias auf selectionState.pairs
 *
 *
 * ============================================================================
 * SELECTION-LIFECYCLE (ABSOLUT KRITISCH)
 * ============================================================================
 *
 * Initialisierung:
 *   - aus SessionStorage ('mpathy:archive:selection:v1')
 *
 * addPair(pair):
 *   - prüft auf Duplicate (pair_id)
 *   - updated State + persistiert
 *
 * removePair(pair_id):
 *   - filtert Pair
 *   - updated State + persistiert
 *
 * clearSelection():
 *   - leert State
 *   - überschreibt SessionStorage
 *
 * Externer Clear:
 *   - hört auf Event 'mpathy:archive:selection:clear'
 *   - wird NUR vom Verify-Listener ausgelöst
 *
 *
 * ============================================================================
 * VERIFY-FLOW (NUR DISPATCH, KEINE LOGIK)
 * ============================================================================
 *
 * Button: "Verify N"
 *
 * onClick:
 *   window.dispatchEvent(
 *     new CustomEvent('mpathy:archive:verify', {
 *       detail: {
 *         intent: 'verify',
 *         pairs: selection
 *       }
 *     })
 *   )
 *
 * WICHTIG:
 *   - ArchiveOverlay erwartet KEINE Rückgabe
 *   - KEIN await
 *   - KEINE Server-Kommunikation hier
 *
 *
 * ============================================================================
 * ADD-TO-CHAT (AKTUELL GLEICHER DISPATCH)
 * ============================================================================
 *
 * Button: "Add N/6 to new chat"
 *
 * - nutzt aktuell denselben Event-Namen
 * - Semantische Trennung erfolgt im Listener
 * - Maximal 6 Paare erlaubt
 *
 *
 * ============================================================================
 * VIEW-LOGIK (DETERMINISTISCH)
 * ============================================================================
 *
 * view =
 *   - 'detail' → openChainId !== null
 *   - 'recent' → query.length < 3
 *   - 'search' → query.length >= 3
 *
 * Subviews:
 *   - RecentChatsView
 *   - SearchResultsView
 *   - ChatDetailView
 *
 *
 * ============================================================================
 * CHAIN-ID-RESOLUTION
 * ============================================================================
 *
 * resolveChainIdFromChatSerial(chatSerial):
 *   - mappt ChatSerial → Time-Range
 *   - matched gegen Triketon Anchors (LS: 'mpathy:triketon:v1')
 *   - liefert chain_id oder null
 *
 *
 * ============================================================================
 * BOOTSTRAP-EFFEKT (useEffect, EINMAL)
 * ============================================================================
 *
 * - initArchiveVerifyListener()
 * - Laden der letzten Chats
 * - Blockieren des Body-Scrolls
 * - Hard-Hide des Prompt-Roots
 *
 * Cleanup:
 *   - Restore Body Overflow
 *   - Restore Prompt Display
 *
 *
 * ============================================================================
 * EVENT-VERTRÄGE (AUS SICHT DIESER DATEI)
 * ============================================================================
 *
 * Dispatcht:
 *   - 'mpathy:archive:verify'
 *   - 'mpathy:archive:close'
 *
 * Hört:
 *   - 'mpathy:archive:selection:clear'
 *
 *
 * ============================================================================
 * BEKANNTE FEHLERQUELLEN
 * ============================================================================
 *
 * - Verify klickt → nichts passiert:
 *     → Ursache liegt IMMER im archiveVerifyListener
 *     → Diese Datei dispatcht korrekt
 *
 * - Selection inkonsistent:
 *     → SessionStorage überschrieben / nicht gelesen
 *
 * - Reports öffnen sich nicht:
 *     → Listener dispatcht kein 'verify:report'
 *
 *
 * ============================================================================
 * NICHT VERHANDELBAR
 * ============================================================================
 *
 * - Keine Server-Logik hier
 * - Keine Hash-Berechnung
 * - Keine Report-Erstellung
 * - Keine Verify-Entscheidung
 *
 * ArchiveOverlay ist reiner ORCHESTRATOR.
 *
 * ============================================================================
 */


'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { readLS, readSS, writeSS } from '@/lib/storage'
import { Input } from '@/components/ui/Input'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SearchResultsView from './views/SearchResultsView'
import RecentChatsView from './views/RecentChatsView'
import EmptyStateView from './views/EmptyStateView'
import ChatDetailView from './views/ChatDetailView'
import { runArchiveSearch, getArchiveSearchPreview } from './ArchiveSearch'
import { initArchiveVerifyListener } from '@/lib/archiveVerifyListener'





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

import type { ArchivePair } from '@/lib/storage'

type SelectionState = {
  pairs: ArchivePair[]
  updated_at: string
}


const EMPTY_SELECTION: SelectionState = {
  pairs: [],
  updated_at: new Date().toISOString(),
}


/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function ArchiveOverlay() {
  const [query, setQuery] = useState('')
  const [chats, setChats] = useState<ChatDisplay[]>([])
  const [openChainId, setOpenChainId] = useState<string | null>(null)

  const [selectionState, setSelectionState] = useState<SelectionState>(() => {
    if (typeof window === 'undefined') return EMPTY_SELECTION
    return (
      readSS<SelectionState>('mpathy:archive:selection:v1') ??
      EMPTY_SELECTION
    )
  })

  const selection = selectionState.pairs


const router = useRouter()

function persistSelection(next: ArchivePair[]) {
  const nextState: SelectionState = {
    pairs: next,
    updated_at: new Date().toISOString(),
  }
  writeSS('mpathy:archive:selection:v1', nextState)
}



function addPair(pair: ArchivePair) {
  setSelectionState(prev => {
    const next = prev.pairs.some(p => p.pair_id === pair.pair_id)
      ? prev.pairs
      : [...prev.pairs, pair]
    persistSelection(next)
    return { ...prev, pairs: next }
  })
}


function removePair(pair_id: string) {
  setSelectionState(prev => {
    const next = prev.pairs.filter(p => p.pair_id !== pair_id)
    persistSelection(next)
    return { ...prev, pairs: next }
  })
}


function clearSelection() {
  persistSelection([])
  setSelectionState(EMPTY_SELECTION)
}

useEffect(() => {
  function onSelectionClear() {
    clearSelection()
  }

  function onVerifyError(event: Event) {
    const custom = event as CustomEvent<{ message?: string }>
    const msg = custom.detail?.message ?? 'Verify failed.'
    window.alert(msg)
  }

  function onVerifyInfo(event: Event) {
    const custom = event as CustomEvent<{ message?: string }>
    const msg =
      custom.detail?.message ??
      'The text has already been verified and the report already exists in the Reports section.'
    window.alert(msg)
  }

  window.addEventListener(
    'mpathy:archive:selection:clear',
    onSelectionClear
  )
  window.addEventListener(
    'mpathy:archive:verify:error',
    onVerifyError
  )
  window.addEventListener(
    'mpathy:archive:verify:info',
    onVerifyInfo
  )

  return () => {
    window.removeEventListener(
      'mpathy:archive:selection:clear',
      onSelectionClear
    )
    window.removeEventListener(
      'mpathy:archive:verify:error',
      onVerifyError
    )
    window.removeEventListener(
      'mpathy:archive:verify:info',
      onVerifyInfo
    )
  }
}, [])





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
  // 🔌 init bulk verify listener (EPIC 4 / T-09)
  initArchiveVerifyListener()

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

{selection.length > 0 && (
  <div
    className="
      mt-2
      flex
      items-center
      gap-6
    "
  >
    <div
      className="
        text-sm
        text-text-secondary
      "
    >
      {selection.length} message pairs selected
    </div>

    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent('mpathy:archive:verify', {
            detail: {
              intent: 'verify',
              pairs: selection,
            },
          })
        )
      }}

      className="
        text-sm
        font-medium
        text-cyan-400
        hover:text-cyan-300
        transition
      "
    >
      Verify {selection.length}
    </button>


     <button
      type="button"
      disabled={selection.length > 6}
      onClick={() => {
        if (selection.length <= 6) {
          window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify', {
    detail: {
      intent: 'verify',
      pairs: selection,
    },
  }),
)


        }
      }}

      className={`
        text-sm
        font-medium
        transition
        ${
          selection.length > 6
            ? 'text-text-muted cursor-not-allowed'
            : 'text-cyan-400 hover:text-cyan-300'
        }
      `}
    >
      {selection.length > 6
        ? 'Too many to add'
        : `Add ${selection.length}/6 to new chat`}
    </button>
  </div>
)}


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

   {query.length >= 3 && !openChainId && (() => {
  const preview = getArchiveSearchPreview(query)

  if (preview.length === 0) return null

  const q = query.trim()
  const qLower = q.toLowerCase()

  return (
    <div
      className="
        mt-4
        flex
        flex-wrap
        gap-2
        text-xs
      "
    >
      {preview.map((p, i) => {
        const pLower = p.toLowerCase()
        const idx = qLower.length > 0 ? pLower.indexOf(qLower) : -1

        const before = idx >= 0 ? p.slice(0, idx) : ''
        const hit = idx >= 0 ? p.slice(idx, idx + q.length) : p
        const after = idx >= 0 ? p.slice(idx + q.length) : ''

        return (
          <span
            key={i}
            className="
              select-none
              p-[5px]
              rounded-md
              bg-cyan-500/10
              border
              border-cyan-500/20
            "
          >
            {idx >= 0 ? (
              <>
                <span className="text-text-secondary">{before}</span>
                <span className="text-cyan-400">{hit}</span>
                <span className="text-text-secondary">{after}</span>
              </>
            ) : (
              <span className="text-cyan-400">{hit}</span>
            )}
          </span>
        )
      })}
    </div>
  )
})()}


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
  selection={selection}
  addPair={addPair}
  removePair={removePair}
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
  highlight={query}
  selection={selection}
  addPair={addPair}
  removePair={removePair}
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


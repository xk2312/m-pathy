/* ======================================================================
   FILE INDEX — components/archive/ArchiveOverlay.tsx
   ======================================================================

   ROLLE DER DATEI
   ----------------------------------------------------------------------
   Zentrales UI-Overlay für das ARCHIVE-System.
   Diese Datei ist der visuelle und logische Einstiegspunkt für:
   - Chat-Archiv (Recent / Search / Detail)
   - REPORTS-Modus
   - Verify-Flow-Trigger
   - Modus-Umschaltung (CHAT ↔ REPORTS)

   Sie ist:
   - Root-Container (Full-Screen Overlay)
   - Event-Listener-Hub
   - Mode-Controller
   - Mount-Owner aller Archive-Views

   ----------------------------------------------------------------------
   GLOBALE VERANTWORTUNG
   ----------------------------------------------------------------------
   - Initialisiert Verify-Listener (initArchiveVerifyListener)
   - Versteckt Hintergrund (Prompt / Scroll / Chat)
   - Kontrolliert Sichtbarkeit von ReportList
   - Schreibt/liest Selection aus SessionStorage
   - Dispatcht Verify-Events

   ----------------------------------------------------------------------
   MODI & VIEW-STATE
   ----------------------------------------------------------------------
   mode: 'chat' | 'reports'
     - steuert, ob ReportList oder Chat-Views gerendert werden
     - Umschaltung:
         • Header Buttons (CHAT / REPORTS)
         • Verify-Success Event

   chatView: 'recent' | 'search' | 'detail'
     - Unterzustand von CHAT
     - beeinflusst ausschließlich Chat-Rendering

   query:
     - Suchstring
     - beeinflusst:
         • chatView (search/recent)
         • Highlighting
         • hat KEINEN Einfluss auf REPORTS

   openChainId:
     - bestimmt Detail-View eines Chats
     - nur relevant im CHAT-Modus

   ----------------------------------------------------------------------
   SELECTION (SESSION STORAGE)
   ----------------------------------------------------------------------
   selectionState:
     - Initialwert:
         readSS('mpathy:archive:selection:v1')
     - Struktur:
         { pairs: ArchivePair[], updated_at }

   persistSelection():
     - schreibt Selection nach SessionStorage
     - überschreibt immer den kompletten State

   addPair / removePair / clearSelection:
     - reine State + SessionStorage-Operationen
     - keine Side-Effects Richtung Reports

   ----------------------------------------------------------------------
   VERIFY-EVENT-PIPELINE (LISTENER)
   ----------------------------------------------------------------------
   useEffect([]) — Listener-Setup

   LISTENED EVENTS:
     - 'mpathy:archive:selection:clear'
         → clearSelection()

     - 'mpathy:archive:verify:error'
         → alert()

     - 'mpathy:archive:verify:info'
         → alert()

     - 'mpathy:archive:verify:success'
         → setMode('chat') → requestAnimationFrame → setMode('reports')

   WICHTIG:
   - ArchiveOverlay reagiert NUR auf Events
   - Es liest oder schreibt KEINE Reports
   - Es übergibt KEINE Daten an ReportList

   ----------------------------------------------------------------------
   BOOTSTRAP-EFFECT
   ----------------------------------------------------------------------
   useEffect([]) — beim Mount

   - initArchiveVerifyListener()
   - lädt letzte 13 Chats via getRecentChats()
   - mapped Chats → local state (chats)
   - blockiert Hintergrund:
       • body overflow hidden
       • prompt-root-scene display none
   - Cleanup:
       • restore overflow
       • restore prompt display

   ----------------------------------------------------------------------
   REPORTS-RENDERING
   ----------------------------------------------------------------------
   Render-Pfad:
     if (mode === 'reports'):
       <ReportList key="reports" />

   Eigenschaften:
     - ReportList erhält KEINE Props
     - Kein expliziter Daten-Refresh
     - Kein Übergabezeitpunkt von Storage → UI
     - ArchiveOverlay kennt Reports NICHT

   ----------------------------------------------------------------------
   CHAT-RENDERING
   ----------------------------------------------------------------------
   CHAT-Modus rendert abhängig von chatView:
     - RecentChatsView
     - SearchResultsView
     - ChatDetailView

   resolveChainIdFromChatSerial():
     - liest Triketon-Ledger aus LocalStorage
       KEY: 'mpathy:triketon:v1'
     - bestimmt chain_id für Detail-View
     - hat KEINE Verbindung zu Reports

   ----------------------------------------------------------------------
   VERIFY-TRIGGER (DISPATCH)
   ----------------------------------------------------------------------
   Button "Verify":
     dispatchEvent 'mpathy:archive:verify'
       detail:
         { intent: 'verify', pairs: selection }

   Dieser Event ist der EINZIGE Einstieg
   in den Report-Erzeugungsprozess.

   ----------------------------------------------------------------------
   KRITISCHE BEOBACHTUNGEN (OHNE WERTUNG)
   ----------------------------------------------------------------------
   - ArchiveOverlay kennt KEINE Reports-Daten
   - Es gibt KEINEN expliziten Read-Punkt für Reports
   - ReportList wird rein über mode sichtbar
   - Es existiert KEIN Datenvertrag zwischen:
       ArchiveOverlay ↔ ReportList
   - REPORTS-Modus ist rein visuell

   ----------------------------------------------------------------------
   AUSSCHLUSS
   ----------------------------------------------------------------------
   ❌ Kein Zugriff auf verificationStorage
   ❌ Kein Zugriff auf loadReports()
   ❌ Kein Report-State
   ❌ Kein Render-Guard außer mode === 'reports'

   ====================================================================== */


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
import ReportList from '@/components/reports/ReportList'

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
type ArchiveMode = 'chat' | 'reports'

const [mode, setMode] = useState<ArchiveMode>('chat')
const [chatView, setChatView] = useState<'recent' | 'search' | 'detail'>('recent')
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

function onVerifySuccess() {
  // deterministic post-verify handling
  clearSelection();                     // reset selection in SessionStorage
  setSelectionState(EMPTY_SELECTION);    // reset local state
  setMode('reports');                    // switch to REPORTS once, no remount loop
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
 window.addEventListener(
  'mpathy:archive:verify:success',
  onVerifySuccess
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
    window.removeEventListener(
      'mpathy:archive:verify:success',
      onVerifySuccess
    )
  }
}, [])

/* -------------------------------------------------------------- */
/* REPORTS REFRESH — TRIGGER ON MODE CHANGE                        */
/* -------------------------------------------------------------- */
useEffect(() => {
  if (mode === 'reports') {
    // dispatch refresh event for ReportList
    window.dispatchEvent(new CustomEvent('mpathy:archive:reports:refresh'))
  }
}, [mode])








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

// (entfernt – ungültiger Scope, kein useEffect)




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
  <h1 className="text-3xl font-medium tracking-tight">
    Archive
  </h1>

  <div className="flex gap-4 text-sm">
   <button
  onClick={() => {
    setMode('chat')
    setChatView('recent')
    setOpenChainId(null)
  }}
  className={mode === 'chat' ? 'text-cyan-400' : 'text-text-secondary'}
>
  CHAT
</button>

    <button
      onClick={() => setMode('reports')}
      className={mode === 'reports' ? 'text-cyan-400' : 'text-text-secondary'}
    >
      REPORTS
    </button>
  </div>

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
  onChange={(e) => {
    const next = e.target.value
    setQuery(next)

    if (next.trim().length >= 3) {
      setChatView('search')
    } else {
      setChatView('recent')
    }
  }}
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
    setMode('chat')
    setOpenChainId(null)
    window.dispatchEvent(
      new CustomEvent('mpathy:archive:close')
    )
  }}
className="
  absolute
  -top-[60px]
  left-full
  -translate-x-[13px]
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

  {/* REPORTS ROOT — ALWAYS OVERVIEW */}
  {mode === 'reports' && (
    <div className="reports-root">
      <ReportList />
    </div>
  )}

  {/* CHAT ROOT — INDEPENDENT */}
  {mode === 'chat' && (
    <div className="chat-root">
      {(() => {
        switch (chatView) {
          case 'recent':
            return (
              <RecentChatsView
                onOpenChat={(chatSerial: string) => {
                  const chainId =
                    resolveChainIdFromChatSerial(chatSerial)
                  if (chainId) {
                    setOpenChainId(chainId)
                    setChatView('detail')
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
                  const chainId =
                    resolveChainIdFromChatSerial(chatSerial)
                  if (chainId) {
                    setOpenChainId(chainId)
                    setChatView('detail')
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
                  setChatView('recent')
                }}
              />
            )

          default:
            return null
        }
      })()}
    </div>
  )}

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


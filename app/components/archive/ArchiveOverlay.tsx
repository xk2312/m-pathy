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
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/Input'
import ReportList from '@/components/reports/ReportList'

import { getRecentChats } from '@/lib/archiveIndex'
import { readLS, readSS, writeSS } from '@/lib/storage'
import { initArchiveVerifyListener } from '@/lib/archiveVerifyListener'

import RecentChatsView from './views/RecentChatsView'
import SearchResultsView from './views/SearchResultsView'
import ChatDetailView from './views/ChatDetailView'
import { runArchiveSearch, getArchiveSearchPreview } from './ArchiveSearch'

import type { ArchivePair } from '@/lib/storage'

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type ArchiveMode = 'chat' | 'reports'

type ChatDisplay = {
  chat_serial: number
  keywords: string[]
  messageCount: number
  lastTimestamp: string
}

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
  const router = useRouter()

  const [mode, setMode] = useState<ArchiveMode>('chat')
  const [query, setQuery] = useState('')
  const [openChainId, setOpenChainId] = useState<string | null>(null)
  const [chats, setChats] = useState<ChatDisplay[]>([])

  const [selectionState, setSelectionState] = useState<SelectionState>(() => {
    if (typeof window === 'undefined') return EMPTY_SELECTION
    return (
      readSS<SelectionState>('mpathy:archive:selection:v1') ??
      EMPTY_SELECTION
    )
  })

  const selection = selectionState.pairs

  /* ---------------- Selection helpers ---------------- */

  function persistSelection(next: ArchivePair[]) {
    writeSS('mpathy:archive:selection:v1', {
      pairs: next,
      updated_at: new Date().toISOString(),
    })
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

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    initArchiveVerifyListener()

    const onVerifyReport = () => {
      setMode('reports')
      setOpenChainId(null)
    }

    window.addEventListener('mpathy:archive:verify:report', onVerifyReport)
    window.addEventListener('mpathy:archive:selection:clear', clearSelection)

    return () => {
      window.removeEventListener('mpathy:archive:verify:report', onVerifyReport)
      window.removeEventListener('mpathy:archive:selection:clear', clearSelection)
    }
  }, [])


  /* ---------------- Helpers ---------------- */

  const resolveChainIdFromChatSerial = (chatSerial: string) => {
    const chat = getRecentChats(13).find(
      c => String(c.chat_serial) === chatSerial
    )
    if (!chat) return null

    const anchors =
      readLS<{ timestamp: string; chain_id: string }[]>('mpathy:triketon:v1') ??
      []

    const start = Date.parse(chat.first_timestamp)
    const end = Date.parse(chat.last_timestamp)

    return (
      anchors.find(a => {
        const t = Date.parse(a.timestamp)
        return t >= start && t <= end
      })?.chain_id ?? null
    )
  }

  /* ---------------- Render ---------------- */

  let chatView: 'recent' | 'search' | 'detail'
  if (openChainId) chatView = 'detail'
  else if (query.length < 3) chatView = 'recent'
  else chatView = 'search'

  return (
    <div className="fixed inset-0 z-[2147483647] bg-[#080808] text-text-primary">
      {/* HEADER */}
      <header className="px-6 py-4 space-y-4">
        <h1 className="text-3xl font-medium">Archive</h1>
        <p className="text-sm text-text-secondary">
          Browse, review, and select past conversations.
        </p>

        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search your chats…"
        />

        <div className="flex gap-4 text-sm">
          <button
            className={mode === 'chat' ? 'text-white' : 'text-text-muted'}
            onClick={() => setMode('chat')}
          >
            Chat
          </button>
          <button
            className={mode === 'reports' ? 'text-white' : 'text-text-muted'}
            onClick={() => setMode('reports')}
          >
            Reports
          </button>
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 overflow-y-auto px-6">
        {mode === 'reports' && <ReportList />}

        {mode === 'chat' && (
          <>
            {chatView === 'recent' && (
              <RecentChatsView
                onOpenChat={(chatSerial: string) => {
                  const chainId =
                    resolveChainIdFromChatSerial(chatSerial)
                  if (chainId) setOpenChainId(chainId)
                }}
              />
            )}

            {chatView === 'search' && (
              <SearchResultsView
                results={runArchiveSearch(query)}
                selection={selection}
                addPair={addPair}
                removePair={removePair}
                onOpenChat={(chatSerial: string) => {
                  const chainId =
                    resolveChainIdFromChatSerial(chatSerial)
                  if (chainId) setOpenChainId(chainId)
                }}
              />
            )}

            {chatView === 'detail' && openChainId && (
              <ChatDetailView
                chain_id={openChainId}
                highlight={query}
                selection={selection}
                addPair={addPair}
                removePair={removePair}
                onClose={() => setOpenChainId(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  )


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


  {mode !== 'reports' && (
    <p
      className="
        text-sm
        text-text-secondary
        max-w-[560px]
      "
    >
      Browse, review, and select past conversations.
    </p>
  )}


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
  setMode('browse' as ArchiveMode)
    setOpenChainId(null)
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
  {mode === 'reports' ? (
    <ReportList />
  ) : (
    (() => {
      type ArchiveView = 'recent' | 'search' | 'detail'

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
                const chainId =
                  resolveChainIdFromChatSerial(chatSerial)
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
                const chainId =
                  resolveChainIdFromChatSerial(chatSerial)
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
        chain_id={openChainId!}
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
    })()
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
}
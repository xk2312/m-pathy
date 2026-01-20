/* ======================================================================
   FILE INDEX — ArchiveOverlay.tsx
   MODE: GranularFileIndexDeveloper · CodeForensik
   SCOPE: ARCHIVE UI · SELECTION · START-CHAT-TRIGGER · SPINNER
   STATUS: IST-ZUSTAND (KANONISCH, OHNE INTERPRETATION)
   ======================================================================

   1. ROLLE DER DATEI
   ----------------------------------------------------------------------
   Diese Datei implementiert das vollständige ARCHIVE-Overlay als
   eigenständigen Systemraum.

   Sie ist verantwortlich für:
   - Darstellung & Navigation (CHAT | REPORTS)
   - Auswahl von Archiv-Paaren
   - Triggern von Verify- und Start-Chat-Flows
   - UI-Blocking (Overlay + Spinner)
   - Lifecycle des Overlays (open / close)

   → Diese Datei ist der **UI-Auslöser** des fehlerhaften Flows.


   2. ZENTRALE IMPORTS (RELEVANT)
   ----------------------------------------------------------------------
   import { readLS, readSS, writeSS } from '@/lib/storage'
   import SystemSpinner from '@/components/system/SystemSpinner'

   TODO-RELEVANZ:
   - readSS / writeSS: Zugriff auf
     `mpathy:archive:selection:v1`
   - SystemSpinner: UI-Blocker, der aktuell
     **nicht beendet wird**


   3. ZUSTAND: MODE / CHATVIEW
   ----------------------------------------------------------------------
   type ArchiveMode = 'chat' | 'reports'

   const [mode, setMode]
   const [chatView, setChatView]

   Bedeutung:
   - mode steuert EBENE 1 (CHAT vs REPORTS)
   - chatView steuert Unterzustände (recent/search/detail)

   TODO-RELEVANZ:
   - Nach erfolgreichem Start eines neuen Chats
     muss das ARCHIVE **geschlossen** werden
     (über Event, Router oder State-Reset)


   4. SELECTION-STATE (SESSION STORAGE)
   ----------------------------------------------------------------------
   const [selectionState, setSelectionState] = useState(...)
   readSS('mpathy:archive:selection:v1')

   Funktionen:
   - persistSelection
   - addPair
   - removePair
   - clearSelection

   Status:
   - Selection wird korrekt gepflegt
   - Maximal 4 Paare enforced (UI-seitig)

   TODO-RELEVANZ:
   - selection ist die **Quelle**
     für den Start-Chat-Event
   - clearSelection muss NACH Erfolg
     sicher ausgeführt werden


   5. VERIFY-LISTENER (SEPARAT)
   ----------------------------------------------------------------------
   Events:
   - mpathy:archive:verify
   - mpathy:archive:verify:success
   - mpathy:archive:verify:error
   - mpathy:archive:verify:info

   Wichtig:
   - onVerifySuccess:
     clearSelection()
     setMode('reports')

   TODO-RELEVANZ:
   - Verify-Flow ist sauber getrennt
   - Start-Chat-Flow DARF diesen
     Mechanismus nicht stören


   6. BOOTSTRAP-EFFECT
   ----------------------------------------------------------------------
   useEffect(() => { ... }, [])

   Aufgaben:
   - initArchiveVerifyListener()
   - getRecentChats()
   - UI-Hard-Block:
     - body overflow hidden
     - prompt-root-scene ausblenden

   TODO-RELEVANZ:
   - Overlay ist ein „Full Takeover“
   - Muss nach Start-Chat wieder sauber
     verlassen werden


   7. SPINNER-STATE (KRITISCH)
   ----------------------------------------------------------------------
   const [isPreparing, setIsPreparing] = useState(false)

   Rendering:
   {isPreparing && <SystemSpinner />}

   Aktivierung:
   - Beim Klick auf „Add X/4 to new chat“:
     setIsPreparing(true)

   Deaktivierung:
   - ❌ EXISTIERT AKTUELL NICHT

   TODO-RELEVANZ (MAXIMAL):
   - isPreparing muss nach erfolgreichem
     neuen Chat explizit auf false gesetzt werden
   - Aktuell bleibt Spinner dauerhaft aktiv


   8. START-CHAT-TRIGGER (KERNSTELLE)
   ----------------------------------------------------------------------
   Button:
   “Add X/4 to new chat”

   onClick:
   - setIsPreparing(true)
   - dispatch CustomEvent:
     'mpathy:archive:start-chat'
     detail: { pairs: selection }

   Status:
   - Event wird korrekt dispatcht
   - archiveChatPreparationListener
     empfängt dieses Event

   TODO-RELEVANZ:
   - NACH erfolgreichem Flow:
     - Spinner stoppen
     - Archive schließen
     - ggf. Routing in neuen Chat


   9. ARCHIVE SCHLIESSEN
   ----------------------------------------------------------------------
   Close-Button:
   dispatch 'mpathy:archive:close'

   Status:
   - Schließt Overlay zuverlässig

   TODO-RELEVANZ:
   - Muss programmatisch nach
     erfolgreichem Start-Chat ausgelöst werden


   10. BODY-RENDERING
   ----------------------------------------------------------------------
   - mode === 'reports' → ReportList
   - mode === 'chat' → Recent / Search / Detail

   TODO-RELEVANZ:
   - Nach neuem Chat darf
     KEIN Archive-Content mehr sichtbar sein


   11. ZUSAMMENFASSUNG (KANONISCH)
   ----------------------------------------------------------------------
   - Diese Datei ist UI-seitig korrekt
   - Sie triggert den Start-Chat sauber
   - Sie blockiert die UI bewusst (Spinner)
   - Sie hat aktuell KEINEN Mechanismus,
     um den Flow wieder freizugeben

   → Für die ToDos relevant sind:
     - setIsPreparing(true / false)
     - dispatch 'mpathy:archive:start-chat'
     - dispatch 'mpathy:archive:close'

   ====================================================================== */


'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'
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
import SystemSpinner from '@/components/system/SystemSpinner'

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
  const { t, lang } = useLanguage()   // 🔁 dynamischer Translator aus Provider
  
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

  const mapped = base.map((chat) => {
  const totalMessages = chat.messages?.length ?? 0
  const pairCount = Math.floor(totalMessages / 2)

  return {
    chat_serial: chat.chat_serial,
    keywords: chat.keywords ?? [],
    messageCount: pairCount,
    lastTimestamp: chat.last_timestamp,
  }
})


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
const [isPreparing, setIsPreparing] = useState(false);

useEffect(() => {
  const handleArchiveClose = () => {
    console.info('[ARCHIVE→CHAT] archive closed → reset isPreparing');
    setIsPreparing(false);
  };

  window.addEventListener('mpathy:archive:close', handleArchiveClose);

  return () => {
    window.removeEventListener('mpathy:archive:close', handleArchiveClose);
  };
}, []);

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

  {isPreparing && (
    <div
      className="
        absolute
        inset-0
        z-[2147483648]
        flex
        items-center
        justify-center
        bg-black/60
      "
    >
      <div className="flex items-center gap-3">
        <SystemSpinner />
        <span className="text-sm text-text-secondary">
          {t("overlay.preparing")}
        </span>
      </div>
    </div>
  )}

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
{t("archive.title")}
  </h1>

  <div className="flex gap-4 text-sm">
    <button
      onClick={() => {
        setMode('chat')
        setChatView('recent')
        setOpenChainId(null)
      }}
      className={`${mode === 'chat' ? 'text-cyan-400' : 'text-text-secondary'} cursor-pointer`}
    >
{t("archive.modes.chat")}
    </button>

    <button
      onClick={() => setMode('reports')}
      className={`${mode === 'reports' ? 'text-cyan-400' : 'text-text-secondary'} cursor-pointer`}
    >
{t("archive.modes.reports")}
    </button>
  </div>

  <p
    className="
      text-sm
      text-text-secondary
      max-w-[560px]
    "
  >
{t("archive.introText")}  </p>

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
{t("archive.selectionStatus").replace('{{count}}', String(selection.length))}      </div>

      {/* VERIFY — unverändert */}
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
{t("archive.verify").replace('{{count}}', String(selection.length))}      
</button>

      {/* ARCHIVE → CHAT (Injection Start) */}
      
        <button
  type="button"
  disabled={selection.length > 4 || isPreparing}
  onClick={() => {
    if (selection.length <= 4 && !isPreparing) {
      setIsPreparing(true)
      window.dispatchEvent(
        new CustomEvent('mpathy:archive:start-chat', {
          detail: {
            pairs: selection,
          },
        })
      )
      router.push('/page2')
    }
  }}
  className={`
    text-sm
    font-medium
    transition
    ${
      selection.length > 4 || isPreparing
        ? 'text-text-muted cursor-not-allowed'
        : 'text-cyan-400 hover:text-cyan-300'
    }
  `}
>

  {selection.length > 4
  ? t("archive.tooMany")
  : t("archive.addToChat").replace("{{count}}", String(selection.length))}

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
placeholder={t("archive.searchUserChats")}
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
aria-label={t("overlay.close")}  onClick={(e) => {
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


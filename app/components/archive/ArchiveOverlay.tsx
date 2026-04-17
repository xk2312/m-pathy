'use client'

import React, { useEffect, useState } from 'react'
import { LanguageProvider, useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'
import { getRecentChats } from '@/lib/archiveIndex'
import { readSS, writeSS } from '@/lib/storage'
import { storageVault } from '@/lib/storageVault'
import { Input } from '@/components/ui/Input'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SearchResultsView from './views/SearchResultsView'
import RecentChatsView from './views/RecentChatsView'
import EmptyStateView from './views/EmptyStateView'
import ChatDetailView from './views/ChatDetailView'
import { runArchiveSearch, getArchiveSearchPreview, type SearchResult } from './ArchiveSearch'
import { initArchiveVerifyListener } from '@/lib/archiveVerifyListener'
import ReportList from '@/components/reports/ReportList'
import SystemSpinner from '@/components/system/SystemSpinner'
import ArchiveIcon from "@/components/icons/wall/archive"

function flattenI18n(obj: any, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const k in obj) {
    const v = obj[k]
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') {
      Object.assign(out, flattenI18n(v, key))
    } else {
      out[key] = String(v ?? '')
    }
  }
  return out
}

/**
 * ============================================================
 * ARCHIVE OVERLAY - FULL RESET (FIXED)
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
  return (
    <LanguageProvider
      dict={{
        en: flattenI18n(i18nArchive.en),
        de: flattenI18n(i18nArchive.de),
        fr: flattenI18n(i18nArchive.fr),
        es: flattenI18n(i18nArchive.es),
        it: flattenI18n(i18nArchive.it),
        pt: flattenI18n(i18nArchive.pt),
        nl: flattenI18n(i18nArchive.nl),
        ru: flattenI18n(i18nArchive.ru),
        zh: flattenI18n(i18nArchive.zh),
        ja: flattenI18n(i18nArchive.ja),
        ko: flattenI18n(i18nArchive.ko),
        ar: flattenI18n(i18nArchive.ar),
        hi: flattenI18n(i18nArchive.hi),
      }}
    >
      <ArchiveOverlayInner />
    </LanguageProvider>
  )
}

function ArchiveOverlayInner() {
  const { t, lang } = useLanguage()   // 🔁 dynamischer Translator aus Provider

  // 🧪 TEMP: I18N diagnostic output
  console.info("[TEST:getActiveDict]", lang, t("archive.title"))


  // 🧪 TEMP: I18N diagnostic output
  console.info("[TEST:getActiveDict]", lang, t("archive.title"))

  type ArchiveMode = 'chat' | 'reports'


const [mode, setMode] = useState<ArchiveMode>('chat')
const [chatView, setChatView] = useState<'recent' | 'search' | 'detail'>('recent')
const [query, setQuery] = useState('')

const [chats, setChats] = useState<ChatDisplay[]>([])
const [openChainId, setOpenChainId] = useState<string | null>(null)
const [searchPreview, setSearchPreview] = useState<string[]>([])
const [searchResults, setSearchResults] = useState<SearchResult[]>([])



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
  const msg = custom.detail?.message ?? t('overlay.fail')
  window.alert(msg)
}

function onVerifyInfo(event: Event) {
  const custom = event as CustomEvent<{ message?: string }>
  const msg = custom.detail?.message ?? t('overlay.cancelled')
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
/* REPORTS REFRESH - TRIGGER ON MODE CHANGE                        */
/* -------------------------------------------------------------- */
useEffect(() => {
  if (mode === 'reports') {
    // dispatch refresh event for ReportList
    window.dispatchEvent(new CustomEvent('mpathy:archive:reports:refresh'))
  }
}, [mode])


  const resolveChainIdFromChatSerial = async (chatSerial: string) => {
  const chats = await getRecentChats(13)

  const chat = chats.find(
    (c) => String(c.chat_serial) === chatSerial
  )

  if (!chat) return null

  const anchors =
    ((await storageVault.get('mpathy:triketon:v1')) as
      | { timestamp: string; chain_id: string }[]
      | undefined) ?? []

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
  const load = async () => {
    initArchiveVerifyListener()

    const base = await getRecentChats(13)

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
  }

  void load()

  // 🔒 hard block background
  const originalOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  const promptEl = document.querySelector('.prompt-root-scene') as HTMLElement | null
  const originalPromptDisplay = promptEl?.style.display
  if (promptEl) promptEl.style.display = 'none'

  return () => {
    document.body.style.overflow = originalOverflow
    if (promptEl) promptEl.style.display = originalPromptDisplay ?? ''
  }
}, [])

useEffect(() => {
  const run = async () => {
    if (query.trim().length < 3) {
      setSearchPreview([])
      setSearchResults([])
      return
    }

    const p = await getArchiveSearchPreview(query)
    const r = await runArchiveSearch(query)

    setSearchPreview(p)
    setSearchResults(r)
  }

  void run()
}, [query])

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
    /* SYSTEM SPACE - FULL TAKEOVER                                  */
    /* ============================================================ */
<div
  className="
    w-full
    h-full
    bg-gradient-to-b
    from-[#121418]
    via-[#0C0C0C]
    to-[#080808]
    text-text-primary
    overflow-y-auto
    overflow-x-hidden    
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
{/* CONTENT FRAME - FULL BLEED                                 */}
{/* ========================================================== */}
<div className="w-full h-full flex flex-col px-4 md:px-0">

<div className="w-full max-w-[920px] mx-auto flex flex-col relative px-[12px] md:px-0">
  
{/* ====================================================== */}
{/* HEADER - ORIENTATION                                   */}
{/* ====================================================== */}
<header className="pb-4 flex flex-col gap-4 mt-[32px]">

 <div className="flex items-center gap-3">
  <ArchiveIcon className="w-10 h-10 text-[#875DC2]" />
  <h1 className="text-3xl font-medium tracking-tight">
    {t("archive.title")}
  </h1>
</div>

  <div className="flex gap-4 text-sm">
    <button
      onClick={() => {
        setMode('chat')
        setChatView('recent')
        setOpenChainId(null)
      }}
className={`${mode === 'chat' ? '!text-[#875DC2]' : 'text-text-secondary'} cursor-pointer`}    >
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

      {/* VERIFY - unverändert */}
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
text-[#875DC2]
hover:text-[#6A4A97]
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
    mx-[8px]
    md:mx-0
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
focus-visible:ring-[#875DC2]  "
/>


{query.length >= 3 && !openChainId && searchPreview.length > 0 && (() => {
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
      {searchPreview.map((p: string, i: number) => {
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
<div className="flex-1 min-h-0 overflow-y-auto mt-[15px]">

  {/* REPORTS ROOT - ALWAYS OVERVIEW */}
 {mode === 'reports' && (
  <div className="reports-root">
    {query.trim().length >= 3 ? (
      <SearchResultsView
        results={searchResults}
        selection={selection}
        addPair={addPair}
        removePair={removePair}
        onOpenChat={async (chatSerial: string) => {
          const chainId =
            await resolveChainIdFromChatSerial(chatSerial)
          if (chainId) {
            setOpenChainId(chainId)
            setChatView('detail')
            setMode('chat')
          }
        }}
      />
    ) : (
      <ReportList />
    )}
  </div>
)}

  {/* CHAT ROOT - INDEPENDENT */}
  {mode === 'chat' && (
    <div className="chat-root">
      {(() => {
        switch (chatView) {
          case 'recent':
            return (
              <RecentChatsView
  headerLabel={t('archive.defaultHeader')}
  chatLabel={(n) =>
    t('archive.chatNumber').replace('{{chatNumber}}', String(n))
  }
  totalMessagesLabel={(count) =>
    t('archive.totalMessages').replace('{{count}}', String(count))
  }
  viewLabel={t('archive.viewChat')}
  keywordsLabel={t('archive.keywords')}
    onOpenChat={async (chatSerial: string) => {
    const chainId =
      await resolveChainIdFromChatSerial(chatSerial)
    if (chainId) {
      setOpenChainId(chainId)
      setChatView('detail')
    }
  }}
/>

            )

         case 'search': {
  return (
    <SearchResultsView
      results={searchResults}
      selection={selection}
      addPair={addPair}
      removePair={removePair}
                  onOpenChat={async (chatSerial: string) => {
                  const chainId =
                    await resolveChainIdFromChatSerial(chatSerial)
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
  backLabel={t('archive.back')}
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


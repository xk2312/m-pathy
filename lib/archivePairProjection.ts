/***
 * =====================================================================
 *  M — ARCHIVE PAIR PROJECTION (Deterministic Q→A Index)
 * =====================================================================
 *
 *  FILE
 *  - lib/archivePairProjection.ts
 *
 *  PURPOSE
 *  - Deterministic projection of Triketon ledger entries into
 *    atomic, searchable Question→Answer pairs.
 *  - Produces the storage layer:
 *      mpathy:archive:pairs:v1
 *  - This file is PURE DATA LOGIC:
 *    ❌ no UI
 *    ❌ no rendering
 *    ❌ no side effects beyond LocalStorage + event dispatch
 *
 *  CONTEXT (aus Übergangsprotokoll + Page2-Index)
 *  - ❌ archive pairs are currently NOT updating
 *  - ❌ root cause is NOT primarily inside this file
 *  - 🔴 this module is a *downstream consumer* of Triketon integrity
 *
 *  If this file produces ZERO or STALE pairs,
 *  the upstream truth layer (Triketon) is already broken.
 *
 * =====================================================================
 *
 *  INDEX (Sprunganker)
 *  ---------------------------------------------------------------------
 *  [ANCHOR:OVERVIEW]            – High-level role in the system
 *  [ANCHOR:TYPES]               – TriketonAnchor / ArchivePair
 *  [ANCHOR:STORAGE-KEYS]        – LocalStorage keys used
 *  [ANCHOR:TRIKETON-READ]       – readFullTriketonLedger()
 *  [ANCHOR:KEYWORD-EXTRACT]     – extractTopKeywordsFromText()
 *  [ANCHOR:PAIR-RULES]          – Deterministic pairing rules
 *  [ANCHOR:PAIR-BUILD]          – syncArchivePairsFromTriketon()
 *  [ANCHOR:WRITE-PAIRS]         – writeLS + archive update event
 *  [ANCHOR:READ-PAIRS]          – readArchivePairs()
 *
 *  PROBLEM-RELEVANCE MAP
 *  ---------------------------------------------------------------------
 *  🔴 CRITICAL DEPENDENCY:
 *     - This file REQUIRES:
 *         • assistant Triketon entries
 *         • correct chain_id
 *         • monotonic timestamps
 *
 *  ❌ This file CANNOT:
 *     - invent assistant messages
 *     - repair missing Triketon entries
 *     - guess pairs if assistant is absent
 *
 * =====================================================================
 */


/* =====================================================================
 * [ANCHOR:OVERVIEW]
 * =====================================================================
 *
 * This module materializes Q→A pairs from the Triketon ledger.
 *
 * Conceptually:
 *
 *   Triketon Ledger (append-only, full truth)
 *        ↓
 *   archivePairProjection.ts
 *        ↓
 *   mpathy:archive:pairs:v1   (derived, replaceable)
 *
 * Any failure here means the ledger is incomplete or malformed.
 */


/* =====================================================================
 * [ANCHOR:TYPES]
 * =====================================================================
 *
 * TriketonAnchor
 * - Minimal ledger entry required for pairing
 * - MUST contain:
 *     id
 *     role ('user' | 'assistant')
 *     content
 *     timestamp
 *     truth_hash
 *     chain_id
 *
 * ArchivePair
 * - Atomic searchable unit
 * - Built ONLY from:
 *     user → assistant (direct succession)
 * - pair_id = `${user.truth_hash}→${assistant.truth_hash}`
 *
 * PROBLEM NOTE:
 * - If assistant entries are missing from Triketon,
 *   ArchivePair can NEVER be constructed.
 */


/* =====================================================================
 * [ANCHOR:STORAGE-KEYS]
 * =====================================================================
 *
 * TRIKETON_KEY = "mpathy:triketon:v1"
 * PAIRS_KEY    = "mpathy:archive:pairs:v1"
 *
 * IMPORTANT DESIGN DECISION:
 * - We intentionally DO NOT use readLS(TRIKETON_KEY)
 * - We read raw localStorage to avoid any trimming/capping.
 *
 * This explicitly disproves the idea that "only 6 pairs" are a bug here.
 */


/* =====================================================================
 * [ANCHOR:TRIKETON-READ]
 * =====================================================================
 *
 * readFullTriketonLedger()
 *
 * - Reads the FULL Triketon ledger from localStorage
 * - No filters
 * - No limits
 * - No pagination
 *
 * FAILURE MODES (observed system-wide):
 * - Ledger contains ONLY user entries
 * - Ledger contains mixed chain_id values
 * - Ledger order is valid, but assistant rows are absent
 *
 * If ledger is incomplete, downstream pairing halts silently.
 */


/* =====================================================================
 * [ANCHOR:KEYWORD-EXTRACT]
 * =====================================================================
 *
 * extractTopKeywordsFromText(input, limit=7)
 *
 * - Language-agnostic
 * - Stopword-filtered
 * - Deterministic frequency-based
 *
 * NOT RELEVANT for current bug:
 * - Even if keywords fail, pairs should still exist.
 */


/* =====================================================================
 * [ANCHOR:PAIR-RULES]
 * =====================================================================
 *
 * Pair construction rules (STRICT):
 *
 * 1. Only roles: 'user' → 'assistant'
 * 2. Assistant must IMMEDIATELY follow the user
 *    (system messages are ignored earlier)
 * 3. Same chain_id REQUIRED
 * 4. Ordered strictly by timestamp
 *
 * CONSEQUENCE:
 * - If assistant entry is delayed, missing, or chained differently,
 *   NO pair is produced.
 *
 * 🔴 THIS IS WHERE UPSTREAM ERRORS MANIFEST.
 */


/* =====================================================================
 * [ANCHOR:PAIR-BUILD]
 * =====================================================================
 *
 * syncArchivePairsFromTriketon()
 *
 * Steps:
 * 1. Read full Triketon ledger
 * 2. Group anchors by chain_id
 * 3. Filter to user/assistant only
 * 4. Sort by timestamp
 * 5. Walk sequentially and build pairs
 *
 * CRITICAL OBSERVATION:
 * - This function NEVER throws on logical absence.
 * - It simply produces ZERO pairs if conditions are unmet.
 *
 * This explains:
 * - "Archive looks frozen"
 * - "Verify UI shows nothing"
 *
 * The failure is silent but deterministic.
 */


/* =====================================================================
 * [ANCHOR:WRITE-PAIRS]
 * =====================================================================
 *
 * writeLS(PAIRS_KEY, pairs)
 * window.dispatchEvent("mpathy:archive:updated")
 *
 * NOTE:
 * - This write ALWAYS happens, even if pairs = []
 * - UI reacting to update event will still re-render,
 *   but with empty data.
 *
 * This is a SYMPTOM amplifier, not a cause.
 */


/* =====================================================================
 * [ANCHOR:READ-PAIRS]
 * =====================================================================
 *
 * readArchivePairs()
 *
 * - Simple backward-compatible accessor
 * - No logic
 * - No recomputation
 *
 * If this returns empty:
 * - Projection already failed earlier.
 */


/* =====================================================================
 * PROBLEM-RELEVANCE SUMMARY (ABSOLUTE)
 * =====================================================================
 *
 * ❌ archivePairProjection.ts is NOT broken.
 * ❌ No logic error in pairing rules.
 * ❌ No storage trimming issue here.
 *
 * 🔴 The file EXPOSES upstream breakage:
 *
 *   - Missing assistant Triketon entries
 *   - Wrong timing of assistant persistence
 *   - Inconsistent chain_id
 *
 * FIX LOCATION IS UPSTREAM:
 * - app/page2/page.tsx
 *   [ANCHOR:SEND-PIPELINE] → [ANCHOR:SEND-FINALLY]
 *
 * Once assistant entries are:
 *   ✓ final
 *   ✓ persisted
 *   ✓ triketoned
 *
 * This module will immediately recover WITHOUT CHANGES.
 *
 * =====================================================================
 */


import { writeLS } from './storage'

/**
 * Triketon anchor (ledger entry)
 */
type TriketonAnchor = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  truth_hash: string
  chain_id?: string
}

/**
 * Searchable pair (question → answer)
 */
export interface ArchivePair {
  pair_id: string
  chain_id: string
  user: {
    id: string
    content: string
    timestamp: string
    truth_hash: string
  }
  assistant: {
    id: string
    content: string
    timestamp: string
    truth_hash: string
  }
  keywords: string[]
}

/**
 * Storage keys
 */
const TRIKETON_KEY = 'mpathy:triketon:v1'
const PAIRS_KEY = 'mpathy:archive:pairs:v1'

/**
 * IMPORTANT:
 * We intentionally bypass readLS(TRIKETON_KEY) here.
 * Reason: storage-layer may apply performance trimming for Triketon reads,
 * which would incorrectly cap pair projection (e.g. 6 pairs).
 * For projections we must read the FULL ledger.
 */
function readFullTriketonLedger(): TriketonAnchor[] {
  try {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(TRIKETON_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as TriketonAnchor[]) : []
  } catch {
    return []
  }
}

function extractTopKeywordsFromText(input: string, limit = 7): string[] {
  try {
    const text = (input || '')
      .toLowerCase()
      .replace(/[\u2019’]/g, "'")
      .replace(/[^a-z0-9äöüß\u0600-\u06FF\u0400-\u04FF\u4e00-\u9fff\s-]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!text) return []

    const stop = new Set([
      'and','or','the','a','an','to','of','in','on','for','with','as','at','by','from','is','are','was','were','be','been','being',
      'ich','du','er','sie','es','wir','ihr','sie','und','oder','der','die','das','ein','eine','einer','eines','einem','einen','zu',
      'von','mit','für','auf','im','in','am','an','ist','sind','war','waren','sein','bin','bist','seid','nicht','ja','nein','bitte',
    ])

    const freq = new Map<string, number>()
    const parts = text.split(' ')

    for (const p of parts) {
      const w = p.trim()
      if (!w) continue
      if (w.length < 3) continue
      if (stop.has(w)) continue
      freq.set(w, (freq.get(w) || 0) + 1)
    }

    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([w]) => w)
  } catch {
    return []
  }
}

/**
 * Build deterministic Q→A pairs from Triketon ledger
 *
 * Rules:
 * - Only user → assistant
 * - Assistant must immediately follow the user (ignoring system)
 * - Same chain_id required
 * - Order strictly by timestamp
 */
export function syncArchivePairsFromTriketon(): ArchivePair[] {
  const anchors = readFullTriketonLedger()

  // group by chain_id
  const byChain = new Map<string, TriketonAnchor[]>()

  for (const a of anchors) {
    if (!a || typeof a.chain_id !== 'string') continue
    if (!byChain.has(a.chain_id)) byChain.set(a.chain_id, [])
    byChain.get(a.chain_id)!.push(a)
  }

  const pairs: ArchivePair[] = []

  for (const [chain_id, messages] of byChain.entries()) {
    const ordered = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    for (let i = 0; i < ordered.length - 1; i++) {
      const current = ordered[i]
      const next = ordered[i + 1]

      if (current.role !== 'user') continue
      if (next.role !== 'assistant') continue

      const combinedText = `${current.content}\n${next.content}`
      const keywords = extractTopKeywordsFromText(combinedText, 7)

      pairs.push({
        pair_id: `${current.truth_hash}→${next.truth_hash}`,
        chain_id,
        user: {
          id: current.id,
          content: current.content,
          timestamp: current.timestamp,
          truth_hash: current.truth_hash,
        },
        assistant: {
          id: next.id,
          content: next.content,
          timestamp: next.timestamp,
          truth_hash: next.truth_hash,
        },
        keywords,
      })
    }
  }

  writeLS(PAIRS_KEY, pairs)

  // 🔔 notify UI that archive pairs changed
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mpathy:archive:updated'))
  }

  return pairs
}


/**
 * Backward-compatible read helper (pairs are already materialized)
 */
export function readArchivePairs(): ArchivePair[] {
  try {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(PAIRS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ArchivePair[]) : []
  } catch {
    return []
  }
}

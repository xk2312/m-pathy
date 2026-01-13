/**
 * ============================================================================
 * FILE INDEX — lib/archiveVerifyListener.ts
 * PROJECT: GPTM-Galaxy+ · m-pathy Archive + Verification
 * CONTEXT: ARCHIVE Overlay — CHAT → VERIFY → REPORTS Übergang
 * MODE: Research · Documentation · Planning ONLY
 * ============================================================================
 *
 * FILE PURPOSE (IST)
 * ---------------------------------------------------------------------------
 * Zentrale Event-Listener-Logik für den Verify-Flow aus dem ARCHIVE.
 *
 * Aufgaben:
 * - Reagiert auf CustomEvent 'mpathy:archive:verify'
 * - Ermittelt aktuelle Selection (SessionStorage oder Event)
 * - Baut kanonischen Text aus Chat-Pairs
 * - Sendet SEAL-Request an Triketon-API
 * - Erstellt und persistiert Verification Reports
 * - Dispatcht Folge-Events für UI (error | info | report | selection:clear)
 *
 *
 * KANONISCHER SOLLZUSTAND (REFERENZ)
 * ---------------------------------------------------------------------------
 * EBENE 0:
 *   - Nicht relevant (keine UI-Elemente)
 *
 * EBENE 1:
 *   - Umschalten zwischen CHAT und REPORTS erfolgt explizit
 *
 * EBENE 2:
 *   CHAT:
 *     - Selection von Message-Pairs
 *     - Explizite Verify-Aktion
 *
 *   REPORTS:
 *     - Reports Overview
 *     - Anzeige neu erstellter Reports
 *     - Keine CHAT-Logik aktiv
 *
 *
 * STRUKTURELL RELEVANTE BEREICHE (IST)
 * ---------------------------------------------------------------------------
 * 1. Event-System
 *    - EVENT_NAME = 'mpathy:archive:verify'
 *    - Folge-Events:
 *      • mpathy:archive:verify:error
 *      • mpathy:archive:verify:info
 *      • mpathy:archive:verify:report
 *      • mpathy:archive:selection:clear
 *
 * 2. Selection-Ermittlung
 *    - readArchiveSelection() (SessionStorage)
 *    - Fallback auf Event-Detail
 *
 * 3. Canonical Truth Text
 *    - buildCanonicalTruthText()
 *    - Sortierung nach pair_id
 *    - USER / ASSISTANT Serialisierung
 *
 * 4. Verify / Seal Request
 *    - POST /api/triketon/seal
 *    - Client-side Decoy Hashes
 *
 * 5. Report-Erstellung
 *    - Aufbau eines TVerificationReport
 *    - Persistenz in LocalStorage
 *
 *
 * IST–SOLL-DELTAS (EXPLIZIT, OHNE BEWERTUNG)
 * ---------------------------------------------------------------------------
 * Δ1: Kopplung CHAT → REPORTS
 *     SOLL:
 *       - Klare, explizite Übergabe von CHAT zu REPORTS
 *     IST:
 *       - Übergang erfolgt implizit über Events
 *       - Kein formaler Mode-Switch, sondern Seiteneffekt
 *
 * Δ2: REPORTS-Aktivierung
 *     SOLL:
 *       - REPORTS-Mode wird explizit aktiviert
 *     IST:
 *       - UI reagiert auf 'mpathy:archive:verify:report'
 *       - Mode-Umschaltung ist verteilt (nicht zentral)
 *
 * Δ3: State-Rücksetzung
 *     SOLL:
 *       - CHAT-Selection und CHAT-State klar vom REPORTS-State getrennt
 *     IST:
 *       - Selection wird per Event global geleert
 *       - Kein expliziter Scope zwischen CHAT- und REPORTS-Zuständen
 *
 * Δ4: ARCHIVE-Neuaufbau-Schutz
 *     SOLL:
 *       - Kein Neuaufbau von ARCHIVE beim Mode-Wechsel
 *     IST:
 *       - Listener agiert global und zustandslos
 *       - Keine explizite Garantie gegen Re-Initialisierung
 *
 *
 * BEWUSST NICHT IM SCOPE
 * ---------------------------------------------------------------------------
 * - Keine Bewertung der Kryptographie
 * - Keine Sicherheitsanalyse
 * - Keine Aussage zur Decoy-Hash-Strategie
 * - Keine Patch- oder Refactor-Vorschläge
 *
 *
 * FAZIT (DESKRIPTIV)
 * ---------------------------------------------------------------------------
 * Diese Datei implementiert den vollständigen Verify-Flow vom CHAT-Selection-
 * Ereignis bis zur Erstellung eines Reports, steuert jedoch den Übergang in
 * den REPORTS-Mode ausschließlich indirekt über Events und nicht über eine
 * explizite, kanonische Mode-Logik gemäß Sollzustand.
 *
 * ============================================================================
 */

import { readLS, writeLS } from '@/lib/storage'
import { readArchiveSelection } from '@/lib/storage'
import type { ArchivePair } from '@/lib/storage'
import type { TVerificationReport } from '@/lib/types'

const EVENT_NAME = 'mpathy:archive:verify'

type VerifyEventDetail = {
  intent: 'verify'
  pairs?: ArchivePair[]
}


let isInitialized = false

function buildCanonicalTruthText(pairs: ArchivePair[]): string {
  return pairs
    .slice()
    .sort((a, b) => a.pair_id.localeCompare(b.pair_id))
    .map(
      (p) =>
        `USER:\n${p.user.content}\n\nASSISTANT:\n${p.assistant.content}`,
    )
    .join('\n\n')
    .trim()
}

function persistReport(report: TVerificationReport) {
  const key = 'mpathy:verification:reports:v1'
  const existing = readLS<TVerificationReport[]>(key) ?? []
  writeLS(key, [...existing, report])
}

export function initArchiveVerifyListener() {
  if (isInitialized) return
  isInitialized = true

  window.addEventListener(EVENT_NAME, async (event: Event) => {
    const custom = event as CustomEvent<VerifyEventDetail>
    const intent = custom.detail?.intent

    if (intent !== 'verify') return

    const selectionFromSS = readArchiveSelection().pairs ?? []
    const selectionFromEvent = custom.detail?.pairs ?? []
    const selection =
      selectionFromSS.length > 0 ? selectionFromSS : selectionFromEvent

    if (!selection || selection.length === 0) {
      window.dispatchEvent(
        new CustomEvent('mpathy:archive:verify:error', {
          detail: { code: 'NO_SELECTION', message: 'No selection to verify.' },
        }),
      )
      return
    }

    const canonicalText = buildCanonicalTruthText(selection)
    if (!canonicalText) {
      window.dispatchEvent(
        new CustomEvent('mpathy:archive:verify:error', {
          detail: { code: 'EMPTY_TEXT', message: 'Nothing to verify.' },
        }),
      )
      return
    }

   const publicKey = localStorage.getItem(
  'mpathy:triketon:device_public_key_2048',
)

if (!publicKey || typeof publicKey !== 'string') {
  console.error(
    '[ArchiveVerify] Device public key missing or invalid',
  )
  return
}



    // 4. Send WRITE / SEAL request to server
   // --- decoy hashes (client-side distraction only) ---
const decoyHash1 = crypto.randomUUID().replace(/-/g, '')
const decoyHash2 = crypto.randomUUID().replace(/-/g, '')

const response = await fetch('/api/triketon/seal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intent: 'seal',
    publicKey,
    text: canonicalText,

    // noise / distraction (server MUST ignore)
    truthHash: decoyHash1,
    truthHash2: decoyHash2,

    protocol_version: 'v1',
    source: 'archive-selection',
  }),
})

if (!response.ok) {
  window.dispatchEvent(
    new CustomEvent('mpathy:archive:verify:error', {
      detail: { code: 'SEAL_FAILED', message: 'Server seal failed.' },
    }),
  )
  return
}

const result = await response.json()
if (result?.result !== 'SEALED' && result?.result !== 'IGNORED') {
  window.dispatchEvent(
    new CustomEvent('mpathy:archive:verify:error', {
      detail: { code: 'BAD_SERVER_RESULT', message: 'Unexpected server response.' },
    }),
  )
  return
}

// ─────────────────────────────
// NEW: already verified → no new report
// ─────────────────────────────
if (result?.result === 'IGNORED') {
  window.dispatchEvent(
    new CustomEvent('mpathy:archive:verify:info', {
      detail: {
        code: 'ALREADY_VERIFIED',
        message:
          'The text has already been verified and the report already exists in the Reports section.',
      },
    }),
  )

  // Clear selection even if no report is created
  window.dispatchEvent(
    new CustomEvent('mpathy:archive:selection:clear'),
  )
  return
}

// ─────────────────────────────
// SEALED → build report
// ─────────────────────────────
const report: TVerificationReport = {
  protocol_version: 'v1',
  generated_at: new Date().toISOString(),
  source: 'archive-selection',

  pair_count: selection.length,
  status: 'verified',
  last_verified_at: new Date().toISOString(),
  public_key: publicKey,

  content: {
    canonical_text: canonicalText,
    pairs: selection.map((p) => ({
      pair_id: p.pair_id,
      user: {
        content: p.user.content,
        timestamp: p.user.timestamp,
      },
      assistant: {
        content: p.assistant.content,
        timestamp: p.assistant.timestamp,
      },
    })),
  },

  truth_hash: result?.truth_hash,
  hash_profile: result?.hash_profile,
  key_profile: result?.key_profile,
  seal_timestamp: result?.timestamp,
}

// Persist report (append-only)
persistReport(report)

// Notify UI
window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:report', {
    detail: report,
  }),
)

// Clear selection AFTER report is safely stored
window.dispatchEvent(
  new CustomEvent('mpathy:archive:selection:clear'),
)


  })
}

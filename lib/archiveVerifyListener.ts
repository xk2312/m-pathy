/* ======================================================================
   FILE INDEX — archiveVerifyListener.ts
   ======================================================================

   ROLLE DER DATEI
   ----------------------------------------------------------------------
   Diese Datei implementiert den clientseitigen Verify-Listener.
   Sie ist der operative Übergabepunkt zwischen:
   - UI-Selektion (Archive / Selection)
   - Server-Seal (Triketon API)
   - Persistierung von Verification Reports
   - Event-Benachrichtigung der UI

   Sie enthält:
   - Event-Listener
   - Netzwerk-Request
   - Report-Erzeugung
   - Report-Persistierung
   - KEIN Rendering

   ----------------------------------------------------------------------
   ZENTRALE EVENTS
   ----------------------------------------------------------------------
   LISTENED:
     - 'mpathy:archive:verify'
         → Startet den gesamten Verify-Flow

   DISPATCHED:
     - 'mpathy:archive:verify:error'
     - 'mpathy:archive:verify:info'
     - 'mpathy:archive:verify:report'
     - 'mpathy:archive:selection:clear'

   ----------------------------------------------------------------------
   INITIALISIERUNG
   ----------------------------------------------------------------------
   initArchiveVerifyListener()
     - Guard: isInitialized
     - Garantiert: Listener wird genau EINMAL registriert
     - Wird typischerweise beim Mount von ArchiveOverlay initialisiert

   ----------------------------------------------------------------------
   INPUT-QUELLEN FÜR SELEKTION
   ----------------------------------------------------------------------
   readArchiveSelection()
     - liest aus SessionStorage:
         KEY: 'mpathy:archive:selection:v1'

   Event-Detail (optional):
     - custom.detail.pairs

   Auswahlregel:
     - SessionStorage gewinnt gegenüber Event-Detail
     - Fallback: Event-Detail
     - Abbruch bei leerer Auswahl

   ----------------------------------------------------------------------
   KANONISCHER TEXT
   ----------------------------------------------------------------------
   buildCanonicalTruthText(pairs)
     - Sortiert deterministisch nach pair_id
     - Baut Text:
         USER:\n<content>\n\nASSISTANT:\n<content>
     - Trimmt Ergebnis
     - Leerer Text → Verify-Error

   ----------------------------------------------------------------------
   DEVICE-IDENTITÄT
   ----------------------------------------------------------------------
   Public Key:
     - Quelle: localStorage
     - KEY: 'mpathy:triketon:device_public_key_2048'
     - Abbruch bei fehlendem oder ungültigem Key

   ----------------------------------------------------------------------
   SERVER-SEAL
   ----------------------------------------------------------------------
   Endpoint:
     - POST /api/triketon/seal

   Request Body:
     - intent: 'seal'
     - publicKey
     - text (canonicalTruthText)
     - decoy hashes (truthHash, truthHash2)
     - protocol_version
     - source

   Server-Antwort:
     - result === 'SEALED'   → neuer Report
     - result === 'IGNORED'  → bereits verifiziert
     - sonst                → Error

   ----------------------------------------------------------------------
   REPORT-ERZEUGUNG
   ----------------------------------------------------------------------
   TVerificationReport:
     - protocol_version = 'v1'
     - generated_at = now
     - last_verified_at = now
     - status = 'verified'
     - source = 'archive-selection'
     - pair_count = selection.length
     - public_key = device key
     - truth_hash = server result
     - content:
         • canonical_text
         • pairs[] (user / assistant)

   ----------------------------------------------------------------------
   REPORT-PERSISTIERUNG
   ----------------------------------------------------------------------
   persistReport(report)
     - Storage-Key:
         'mpathy:verification:reports:v1'
     - Zugriff:
         readLS → Array
         writeLS → append-only
     - KEINE Deduplikation
     - KEIN Limit
     - KEINE Normalisierung

   ----------------------------------------------------------------------
   UI-BENACHRICHTIGUNG
   ----------------------------------------------------------------------
   Nach erfolgreicher Persistierung:
     - dispatch 'mpathy:archive:verify:report'
         • detail: report
     - dispatch 'mpathy:archive:selection:clear'

   ----------------------------------------------------------------------
   RELEVANZ FÜR REPORTS-SICHTBARKEIT
   ----------------------------------------------------------------------
   - Diese Datei schreibt Reports in den Storage-Key
       'mpathy:verification:reports:v1'
   - Sie rendert nichts selbst
   - Sichtbarkeit hängt davon ab, ob:
       a) writeLS hier erfolgreich ist
       b) UI loadReports() aus derselben Quelle liest
       c) UI auf Events reagiert oder neu lädt

   ----------------------------------------------------------------------
   AUSSCHLUSS
   ----------------------------------------------------------------------
   ❌ Kein React
   ❌ Kein State
   ❌ Keine i18n
   ❌ Keine UI-Logik

   ====================================================================== */


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

// Explicit verify success signal (CHAT → REPORTS)
window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:success', {
    detail: {
      at: new Date().toISOString(),
    },
  }),
)



// Clear selection AFTER report is safely stored
window.dispatchEvent(
  new CustomEvent('mpathy:archive:selection:clear'),
)



  })
}

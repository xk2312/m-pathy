/**
 * ============================================================================
 * INVENTUS INDEX — archiveVerifyListener.ts
 * ============================================================================
 *
 * ZWECK
 * -----
 * Zentrale Client-Seal- & Verify-Bridge für Archive-Selections.
 * Diese Datei verbindet:
 *   UI-Event ("Verify") → Archive Selection → Server-Seal (WRITE)
 *   → Local Report Persistenz → UI-Update → Selection-Clear
 *
 * WICHTIGES PRINZIP
 * -----------------
 * - Der Server berechnet den TruthHash selbst.
 * - Client-seitige TruthHashes sind reines Decoy / Ablenkungsmanöver.
 * - Diese Datei darf KEINE Hash-Logik enthalten.
 * - Kein Zustand wird mutiert, bevor der Server SUCCESS bestätigt.
 *
 * SINGLE ENTRY POINT
 * ------------------
 * initArchiveVerifyListener()
 * → registriert genau EINEN globalen Event-Listener
 *
 *
 * ============================================================================
 * EVENT-VERTRAG (ABSOLUT KRITISCH)
 * ============================================================================
 *
 * EINGEHENDES EVENT (von UI):
 * --------------------------
 * Name:   'mpathy:archive:verify'
 * Detail: { intent: 'verify' }
 *
 * → Fehlt `detail.intent === 'verify'`, passiert GAR NICHTS.
 *
 *
 * AUSGEHENDE EVENTS (von dieser Datei):
 * ------------------------------------
 * 1) 'mpathy:archive:verify:report'
 *    → detail: TVerificationReport
 *    → triggert Report-UI / Overlay
 *
 * 2) 'mpathy:archive:selection:clear'
 *    → leert Archive-Selection NACH erfolgreichem Seal
 *
 *
 * ============================================================================
 * DATA SOURCES (READ ONLY)
 * ============================================================================
 *
 * Archive Selection:
 *   readArchiveSelection()
 *   → SessionStorage: 'mpathy:archive:selection:v1'
 *   → Erwartet: { pairs: ArchivePair[] }
 *
 * Device Public Key:
 *   readLS('mpathy:triketon:device_public_key_2048')
 *
 *
 * ============================================================================
 * SERVER-KOMMUNIKATION (WRITE)
 * ============================================================================
 *
 * Endpoint:
 *   POST /api/triketon/seal
 *
 * Payload (minimal relevant):
 *   {
 *     intent: 'seal',
 *     publicKey: string,
 *     text: canonicalText
 *   }
 *
 * Payload (Decoy / Ablenkung):
 *   - truthHash
 *   - truthHash2
 *   - protocol_version
 *   - source
 *
 * SERVER-ANTWORT (akzeptiert):
 *   result === 'SEALED' | 'IGNORED'
 *
 * → Alles andere führt zu silent abort.
 *
 *
 * ============================================================================
 * KANONISCHE TEXTBILDUNG
 * ============================================================================
 *
 * buildCanonicalTruthText(pairs)
 *
 * Algorithmus:
 *   1. Kopie der Pairs
 *   2. Sortierung nach pair_id (lexikografisch)
 *   3. Mapping:
 *        USER:
 *        <user.content>
 *
 *        ASSISTANT:
 *        <assistant.content>
 *   4. Join mit Leerzeilen
 *   5. trim()
 *
 * Ergebnis:
 *   - deterministisch
 *   - gleiche Selection → gleicher Text
 *
 *
 * ============================================================================
 * REPORT-PERSISTENZ (APPEND-ONLY)
 * ============================================================================
 *
 * Storage-Key:
 *   'mpathy:verification:reports:v1'
 *
 * Persistiert:
 *   {
 *     protocol_version: 'v1',
 *     generated_at: ISO,
 *     source: 'archive-selection',
 *     pair_count: number,
 *     public_key: string,
 *     status: 'verified',
 *     last_verified_at: ISO
 *   }
 *
 * → Reports werden NIE überschrieben.
 *
 *
 * ============================================================================
 * ABLAUF (LINEAR, OHNE ABKÜRZUNGEN)
 * ============================================================================
 *
 * UI klickt "Verify"
 * → UI dispatcht 'mpathy:archive:verify'
 * → Listener prüft intent
 * → Selection wird gelesen
 * → Kanonischer Text wird gebaut
 * → PublicKey wird gelesen
 * → POST /api/triketon/seal
 * → Server bestätigt (SEALED | IGNORED)
 * → Report wird lokal persistiert
 * → UI wird benachrichtigt
 * → Selection wird gelöscht
 *
 *
 * ============================================================================
 * SILENT FAILURE POINTS (WARUM „PASSIERT NICHTS“)
 * ============================================================================
 *
 * - Event ohne detail.intent
 * - Leere / falsche Archive-Selection
 * - PublicKey fehlt
 * - Fetch schlägt fehl
 * - Server antwortet != 200
 * - Response-Schema unerwartet
 *
 * → KEIN Logging. KEINE UI-Fehlermeldung.
 *
 *
 * ============================================================================
 * NICHT VERHANDELBAR
 * ============================================================================
 *
 * - Diese Datei darf KEINE Verify-READ-Logik enthalten
 * - Verify-READ erfolgt AUSSCHLIESSLICH über Reports
 * - Kein direkter TruthHash-Vergleich im Client
 * - Kein Fallback auf alte Server-Logik
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



   // 5. Build report snapshot BEFORE cleanup
const report: TVerificationReport = {
  protocol_version: 'v1',
  generated_at: new Date().toISOString(),
  source: 'archive-selection',

  pair_count: selection.length,
  status: 'verified',
  last_verified_at: new Date().toISOString(),
  public_key: publicKey,

  // content snapshot (reproducible)
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

  // proof placeholders (filled from server context when available)
  truth_hash: result?.truth_hash,
  hash_profile: result?.hash_profile,
  key_profile: result?.key_profile,
  seal_timestamp: result?.timestamp,
}

// 6. Persist report (append-only)
persistReport(report)

// 7. Notify UI
window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:report', {
    detail: report,
  }),
)

// 8. Clear selection AFTER report is safely stored
window.dispatchEvent(
  new CustomEvent('mpathy:archive:selection:clear'),
)

  })
}

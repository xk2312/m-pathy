// lib/archiveVerifyListener.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Archive Verify Listener — A2 (Canonical Seal / Verify Write)
//
// RESPONSIBILITY
// - Listen to archive verify intent
// - Build canonical truth text from archive:selection
// - Send text + public key to server (WRITE / SEAL)
// - Create local report ONLY after server confirmation
//
// MUST NOT
// - Read from archive:pairs or archive:v1
// - Compute or handle truth hashes locally
// - Create reports before server confirmation
// - Render UI or mutate selection directly

import { readLS, writeLS } from '@/lib/storage'
import { readArchiveSelection } from '@/lib/storage'
import type { ArchivePair } from '@/lib/storage'
import type { TVerificationReport } from '@/lib/types'

const EVENT_NAME = 'mpathy:archive:verify'

type VerifyEventDetail = {
  intent: 'verify'
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

    // 1. Read canonical selection (ONLY source of truth)
    const selection = readArchiveSelection().pairs
    if (!selection || selection.length === 0) return

    // 2. Build canonical truth text
    const canonicalText = buildCanonicalTruthText(selection)
    if (!canonicalText) return

    // 3. Read device public key (2048)
    const publicKey =
      readLS<string>('mpathy:triketon:device_public_key_2048')
    if (!publicKey) return

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

if (!response.ok) return

const result = await response.json()
if (result?.result !== 'SEALED' && result?.result !== 'IGNORED') return


    // 5. Create local report ONLY after server confirmation
    const report: TVerificationReport = {
      protocol_version: 'v1',
      generated_at: new Date().toISOString(),
      source: 'archive-selection',
      pair_count: selection.length,
      public_key: publicKey,
      status: 'verified',
      last_verified_at: new Date().toISOString(),
    }

    // 6. Persist report (append-only)
    persistReport(report)

    // 7. Notify UI
    window.dispatchEvent(
      new CustomEvent('mpathy:archive:verify:report', {
        detail: report,
      }),
    )

    // 8. Clear selection AFTER successful seal
    window.dispatchEvent(
      new CustomEvent('mpathy:archive:selection:clear'),
    )
  })
}

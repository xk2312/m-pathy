// lib/archiveVerifyListener.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Bulk Verify Listener — EPIC 4 / T-09
//
// RESPONSIBILITY
// - Listen to archive verify intent
// - Execute async, read-only verification
// - Produce a verification report
//
// MUST NOT
// - Render UI
// - Mutate selection
// - Trigger injection
// - Write to archive or ledger

import { readLS } from '@/lib/storage'
import { verifyAll } from '@/lib/triketonVerify'
import type { TArchiveEntry, TVerificationReport } from '@/lib/types'

const EVENT_NAME = 'mpathy:archive:verify'

type VerifyEventDetail = {
  pairs: { pair_id: string }[]
  intent: 'verify'
}


let isInitialized = false

export function initArchiveVerifyListener() {
  if (isInitialized) return
  isInitialized = true

  window.addEventListener(EVENT_NAME, async (event: Event) => {
    const custom = event as CustomEvent<VerifyEventDetail>
    const pairs = custom.detail?.pairs ?? []
    const intent = custom.detail?.intent

    if (intent !== 'verify') return
    if (pairs.length === 0) return


    // read-only source of truth
    const archive =
      readLS<TArchiveEntry[]>('mpathy:archive:v1') ?? []

    // resolve entries by pair_id (order preserved)
    const entries: TArchiveEntry[] = []
    for (const p of pairs) {
      const hit = archive.find((e) => e.id === p.pair_id)
      if (hit) entries.push(hit)
    }

    // async verification (non-blocking)
    const result = verifyAll(entries)

    const report: TVerificationReport = {
      protocol_version: 'v1',
      generated_at: new Date().toISOString(),
      chat_meta: {
        chat_id: 'bulk',
        chat_serial: -1,
        message_total: entries.length,
      },
      verification_chain: entries.map((e, idx) => ({
        msg_number: idx,
        truth_hash: e.truth_hash,
      })),
      chain_signature: result.chatLevel ? 'valid' : 'invalid',
      public_key: entries[0]?.public_key ?? '',
      verified_true: result.messageLevel.filter(Boolean).length,
      verified_false: result.messageLevel.filter((v) => !v).length,
    }

    // emit report (read-only handoff)
    window.dispatchEvent(
      new CustomEvent('mpathy:archive:verify:report', {
        detail: report,
      }),
    )

    // 📊 audit telemetry (NO PII, NO TEXT, NO HASH LEAK)
    window.dispatchEvent(
      new CustomEvent('mpathy:audit:event', {
        detail: {
          type: 'bulk_verify',
          at: Date.now(),
          pairs_total: entries.length,
          verified_true: report.verified_true,
          verified_false: report.verified_false,
          chain_valid: report.chain_signature === 'valid',
        },
      }),
    )

  })
}

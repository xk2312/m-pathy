// lib/verificationStorage.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Local Verification Reports – storage, retrieval, re-verify

import type { VerificationReport as TVerificationReport } from './types'
import { readLS, writeLS } from './storage'

const KEY = 'mpathy:verification:v1'

type LegacyVerificationReport = {
  generatedAt: string
  truthHash: string
  entriesCount?: number
  lastVerifiedAt?: string
  publicKey: string
  status?: 'verified' | 'unverified'
  source?: 'archive-selection'
  content?: any
  verification_chain?: any
  chain_signature?: any
  [key: string]: any
}

function normalizeReport(
  r: LegacyVerificationReport | Partial<TVerificationReport>
): TVerificationReport {
  // Already snake_case -> still enforce Canonical required fields
  if ((r as any) && typeof (r as any).generated_at === 'string') {
    const rr = r as Partial<TVerificationReport>

    const truth_hash =
      typeof rr.truth_hash === 'string' ? rr.truth_hash : ''
    const public_key =
      typeof rr.public_key === 'string' ? rr.public_key : ''

    return {
      protocol_version: 'v1',
      generated_at:
        typeof rr.generated_at === 'string' ? rr.generated_at : new Date().toISOString(),
      last_verified_at:
        typeof rr.last_verified_at === 'string' ? rr.last_verified_at : undefined,
      pair_count:
        typeof rr.pair_count === 'number' ? rr.pair_count : 0,
      status:
        rr.status === 'verified' || rr.status === 'unverified' ? rr.status : 'unverified',
      source: 'archive-selection',
      public_key,
      truth_hash,
      hash_profile: rr.hash_profile,
      key_profile: rr.key_profile,
      seal_timestamp: rr.seal_timestamp,
      content: rr.content,
      chat_meta: rr.chat_meta,
      verification_chain: rr.verification_chain,
      chain_signature: rr.chain_signature,
      verified_true: rr.verified_true,
      verified_false: rr.verified_false,
    }
  }

  // Legacy camelCase -> convert + enforce Canonical required fields
  const legacy = r as LegacyVerificationReport

  return {
    protocol_version: 'v1',
    generated_at: legacy.generatedAt,
    last_verified_at: legacy.lastVerifiedAt,
    pair_count: typeof legacy.entriesCount === 'number' ? legacy.entriesCount : 0,
    status:
      legacy.status === 'verified' || legacy.status === 'unverified'
        ? legacy.status
        : 'unverified',
    source: 'archive-selection',
    public_key: legacy.publicKey,
    truth_hash: legacy.truthHash,
    content: legacy.content,
    verification_chain: legacy.verification_chain,
    chain_signature: legacy.chain_signature,
  }
}

export function loadReports(): TVerificationReport[] {
  const raw =
    readLS<Array<LegacyVerificationReport | Partial<TVerificationReport>>>(KEY) || []
  return raw.map(normalizeReport).filter((r) => r.truth_hash && r.public_key)
}

export function saveReport(report: TVerificationReport): void {
  const all = loadReports()
  const exists = all.some((r) => r.truth_hash === report.truth_hash)
  if (!exists) {
    all.unshift(report)
    writeLS(KEY, all.slice(0, 100))
  }
}

export function deleteReport(hash: string): void {
  const all = loadReports().filter((r) => r.truth_hash !== hash)
  writeLS(KEY, all)
}

export function getReport(hash: string): TVerificationReport | null {
  return loadReports().find((r) => r.truth_hash === hash) || null
}

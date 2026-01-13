/**
 * ============================================================================
 * FILE INDEX — lib/verificationStorage.ts
 * PROJECT: GPTM-Galaxy+ · m-pathy Archive + Verification
 * CONTEXT: ARCHIVE Overlay — MODE = REPORTS (Datenhaltung)
 * MODE: Research · Documentation · Planning ONLY
 * ============================================================================
 *
 * FILE PURPOSE (IST)
 * ---------------------------------------------------------------------------
 * Persistenz- und Zugriffsschicht für Verification Reports im LocalStorage.
 *
 * Aufgaben:
 * - Laden, Normalisieren und Speichern von Verification Reports
 * - Abwärtskompatibilität zu Legacy-Report-Formaten
 * - Bereitstellung einer einheitlichen Canonical-Report-Struktur
 *
 *
 * KANONISCHER SOLLZUSTAND (REFERENZ)
 * ---------------------------------------------------------------------------
 * EBENE 0:
 *   - Nicht relevant (keine UI-Struktur)
 *
 * EBENE 1:
 *   - MODE = REPORTS ist logisch eigenständig
 *
 * EBENE 2 (REPORTS):
 *   - Reports Overview basiert ausschließlich auf Report-Daten
 *   - Keine Abhängigkeit zu CHAT-Zuständen oder CHAT-Inhalten
 *
 *
 * STRUKTURELL RELEVANTE BEREICHE (IST)
 * ---------------------------------------------------------------------------
 * 1. Storage-Key
 *    - KEY = 'mpathy:verification:v1'
 *
 * 2. Normalisierung
 *    - normalizeReport()
 *    - Unterstützt:
 *      • Canonical snake_case Reports
 *      • Legacy camelCase Reports
 *
 * 3. Öffentliche API
 *    - loadReports()
 *    - saveReport()
 *    - deleteReport()
 *    - getReport()
 *
 * 4. Datenbegrenzung
 *    - Maximal 100 Reports (slice(0, 100))
 *
 *
 * IST–SOLL-DELTAS (EXPLIZIT, OHNE BEWERTUNG)
 * ---------------------------------------------------------------------------
 * Δ1: REPORTS-Isolation auf Storage-Ebene
 *     SOLL:
 *       - REPORTS-Daten sind klar von CHAT-Daten getrennt
 *     IST:
 *       - Trennung erfolgt implizit über Storage-Key
 *       - Keine formale Kopplung an ARCHIVE-Mode oder Overlay-Zustand
 *
 * Δ2: REPORTS-Detailtiefe
 *     SOLL:
 *       - REPORTS-Mode zeigt eine Reports Overview
 *     IST:
 *       - Storage unterstützt vollständige Report-Inhalte,
 *         inklusive Content, Verification Chain und Signaturen
 *
 * Δ3: Lebenszyklus-Kopplung
 *     SOLL:
 *       - REPORTS sind unabhängig von Chat-Navigation
 *     IST:
 *       - Reports werden dauerhaft im LocalStorage gehalten,
 *         unabhängig vom Zustand des ARCHIVE-Overlays
 *
 *
 * BEWUSST NICHT IM SCOPE
 * ---------------------------------------------------------------------------
 * - Keine UI-Logik
 * - Keine Aussage zur kryptographischen Validität
 * - Keine Bewertung der Normalisierungsstrategie
 * - Keine Empfehlungen zur Speicherstrategie
 *
 *
 * FAZIT (DESKRIPTIV)
 * ---------------------------------------------------------------------------
 * Diese Datei stellt eine saubere, eigenständige Datenbasis für REPORTS dar,
 * die logisch unabhängig vom CHAT-Overlay existiert, jedoch strukturell mehr
 * Informationen bereitstellt als im kanonischen „Reports Overview“-Begriff
 * vorgesehen.
 *
 * ============================================================================
 */


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

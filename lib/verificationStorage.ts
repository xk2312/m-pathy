/* ======================================================================
   FILE INDEX — verificationStorage.ts
   ======================================================================

   Zweck der Datei
   ----------------------------------------------------------------------
   Diese Datei ist die Single-Source-of-Truth für Verification Reports
   im Client (LocalStorage). Sie definiert:
   - den Storage-Key für Reports
   - die Normalisierung alter und neuer Report-Formate
   - das Laden, Speichern, Löschen und Abfragen von Reports

   ----------------------------------------------------------------------
   BETEILIGTER DATENPFAD (IST)
   ----------------------------------------------------------------------
   LocalStorage
     KEY: 'mpathy:verification:reports:v1'
       ↓
     loadReports()
       ↓
     normalizeReport()
       ↓
     UI (z. B. ReportList / ArchiveOverlay → REPORTS Mode)

   ----------------------------------------------------------------------
   ZENTRALE KONSTANTEN
   ----------------------------------------------------------------------
   KEY
     - Wert: 'mpathy:verification:reports:v1'
     - Rolle: einzig verwendeter Storage-Key für alle Reports
     - Abhängigkeiten:
         • readLS / writeLS
         • direkte window.localStorage-Zugriffe in loadReports()

   ----------------------------------------------------------------------
   DATENSTRUKTUREN
   ----------------------------------------------------------------------
   LegacyVerificationReport
     - camelCase-Felder (Altbestand):
         • generatedAt
         • truthHash
         • publicKey
         • entriesCount
         • lastVerifiedAt
         • status
         • content
         • verification_chain
         • chain_signature

   TVerificationReport (importiert)
     - snake_case / kanonisch:
         • protocol_version
         • generated_at
         • last_verified_at
         • pair_count
         • status
         • source
         • public_key
         • truth_hash
         • content
         • verification_chain
         • chain_signature
         • weitere optionale Profile-Felder

   ----------------------------------------------------------------------
   NORMALISIERUNGSLOGIK
   ----------------------------------------------------------------------
   function normalizeReport(r)
     - Eingang:
         • LegacyVerificationReport
         • Partial<TVerificationReport>
     - Zwei Pfade:

       1) Snake_case erkannt (generated_at vorhanden)
          - truth_hash:
              • rr.truth_hash
              • fallback: anyR.truthHash
          - public_key:
              • rr.public_key
              • fallback: anyR.publicKey
          - erzwingt:
              • protocol_version = 'v1'
              • source = 'archive-selection'
              • status default = 'unverified'
              • pair_count default = 0

       2) Legacy camelCase
          - mapping:
              generatedAt      → generated_at
              lastVerifiedAt   → last_verified_at
              entriesCount     → pair_count
              truthHash        → truth_hash
              publicKey        → public_key
          - source = 'archive-selection'

   ----------------------------------------------------------------------
   LADEPFAD
   ----------------------------------------------------------------------
   function loadReports()
     - Guard:
         • if typeof window === 'undefined' → []
     - Zugriff:
         • window.localStorage.getItem(KEY)
         • JSON.parse
     - Fehlerfall:
         • try/catch → []
     - Verarbeitung:
         • raw.map(normalizeReport)
         • filter: truth_hash && public_key

   ----------------------------------------------------------------------
   SCHREIBPFAD
   ----------------------------------------------------------------------
   function saveReport(report)
     - lädt bestehende Reports
     - Duplikatprüfung:
         • truth_hash eindeutig
     - Verhalten:
         • neue Reports werden vorne eingefügt (unshift)
         • Limit: max. 100 Einträge
     - Speicherung:
         • writeLS(KEY, reports)

   ----------------------------------------------------------------------
   LÖSCHEN
   ----------------------------------------------------------------------
   function deleteReport(hash)
     - filtert nach truth_hash
     - überschreibt gesamten Storage-Key

   ----------------------------------------------------------------------
   ABFRAGE EINZELREPORT
   ----------------------------------------------------------------------
   function getReport(hash)
     - linearer Suchlauf über loadReports()
     - Rückgabe:
         • TVerificationReport | null

   ----------------------------------------------------------------------
   BEOBACHTUNGEN (OHNE BEWERTUNG)
   ----------------------------------------------------------------------
   - Es existiert genau EIN Storage-Key für Reports.
   - Es gibt keinen Event-Emitter in dieser Datei.
   - Diese Datei rendert nichts selbst.
   - Alle Reports liegen vollständig im LocalStorage.
   - Sichtbarkeit im UI hängt ausschließlich von:
       • korrekt gefülltem KEY
       • erfolgreichem loadReports()
       • korrekter Nutzung in der UI-Komponente ab.

   ====================================================================== */

import type { VerificationReport as TVerificationReport } from './types'
import { readLS, writeLS } from './storage'

const KEY = 'mpathy:verification:reports:v1'

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
  if ((r as any) && typeof (r as any).generated_at === 'string') {
    const rr = r as Partial<TVerificationReport>
    const anyR = r as any

    const truth_hash =
      typeof rr.truth_hash === 'string'
        ? rr.truth_hash
        : typeof anyR.truthHash === 'string'
          ? anyR.truthHash
          : (Array.isArray(anyR.content?.pairs) && anyR.content.pairs[0]?.truth_hash)
            ? anyR.content.pairs[0].truth_hash
            : ''

    const public_key =
      typeof rr.public_key === 'string'
        ? rr.public_key
        : typeof anyR.publicKey === 'string'
          ? anyR.publicKey
          : ''

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
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    const normalized = parsed.map(normalizeReport)
    console.log(`[ArchiveVerify] ✅ loaded ${normalized.length} reports`)
    return normalized
  } catch (err) {
    console.error('[ArchiveVerify] ❌ loadReports failed', err)
    return []
  }
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

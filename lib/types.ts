/* ======================================================================
   FILE INDEX — types.ts
   ======================================================================

   ROLLE DER DATEI
   ----------------------------------------------------------------------
   Zentrale Typdefinitionen für:
   - Chat
   - Archive
   - Verification
   - Reports (Legacy → Canonical)

   Diese Datei enthält:
   - KEINE Logik
   - KEINE Storage-Zugriffe
   - KEINE Events
   - KEIN Rendering

   Sie definiert ausschließlich die Form der Daten,
   die in anderen Schichten gelesen, geschrieben und gerendert werden.

   ----------------------------------------------------------------------
   CORE-DOMÄNE (CHAT / ARCHIVE)
   ----------------------------------------------------------------------

   Role
     - 'user' | 'assistant' | 'system'

   ChatMessage
     - Einzelne Chat-Nachricht
     - optionale Verifikation:
         • truth_hash?
         • verified?

   ArchiveEntry
     - Persistierter Archiv-Eintrag
     - enthält:
         • truth_hash (pflicht)
         • public_key (pflicht)
         • verified (boolean)

   ArchiveSelection
     - UI-Selektion (Message oder Chat)
     - Grundlage für Verify-Flow

   ContextUpload
     - Übertragener Kontext in neuen Chat
     - verified-Flag vorhanden

   ----------------------------------------------------------------------
   VERIFICATION-DOMÄNE (REPORTS)
   ----------------------------------------------------------------------

   VerificationItem
     - Ein Eintrag in der verification_chain
     - msg_number + truth_hash

   ----------------------------------------------------------------------
   LEGACY REPORT SHAPE (CAMELCASE)
   ----------------------------------------------------------------------

   VerificationReportLegacy
     - Frühere / externe / UI-nahe Report-Form
     - camelCase-Felder:
         • generatedAt
         • truthHash
         • entriesCount
         • lastVerifiedAt
         • publicKey
     - optionales content:
         • canonical_text
         • pairs[]
     - verification_chain + chain_signature
     - Offen für Fremdfelder ([key: string]: any)

   ----------------------------------------------------------------------
   BASE / IO SHAPE (ÜBERGANGSFORM)
   ----------------------------------------------------------------------

   VerificationReportBase
     - Für LocalStorage IO & Migration
     - snake_case, aber optional
     - Enthält:
         • truth_hash?
         • public_key?
         • generated_at?
     - chat_meta:
         • chat_id
         • chat_serial
         • message_total

   ----------------------------------------------------------------------
   KANONISCHER REPORT (NACH NORMALISIERUNG)
   ----------------------------------------------------------------------

   VerificationReport
     - Garantierte Endform nach normalizeReport()
     - Pflichtfelder:
         • protocol_version = 'v1'
         • generated_at
         • source = 'archive-selection'
         • pair_count
         • status
         • public_key
         • truth_hash
     - Optionale Felder:
         • last_verified_at
         • content
         • chat_meta
         • verification_chain
         • chain_signature
         • verified_true / verified_false

   ----------------------------------------------------------------------
   ZUSAMMENHANG ZUM REPORTS-PFAD
   ----------------------------------------------------------------------

   - verificationStorage.ts
       • liest/schreibt Daten gemäß diesen Typen
       • normalizeReport() konvertiert Legacy/Base → VerificationReport

   - ReportList.tsx / ArchiveOverlay.tsx
       • erwarten implizit die Canonical-Form (VerificationReport)

   - Jede Abweichung in Feldnamen oder Optionalität
     kann dazu führen, dass Reports:
       • geladen, aber
       • gefiltert oder
       • nicht gerendert werden

   ----------------------------------------------------------------------
   AUSSCHLUSS
   ----------------------------------------------------------------------

   ❌ Keine Logik
   ❌ Keine Defaults
   ❌ Keine Guards
   ❌ Keine Seiteneffekte

   ====================================================================== */



export type Role = 'user' | 'assistant' | 'system'

/* ──────────────────────────────────────────────
   Core
────────────────────────────────────────────── */

export interface ChatMessage {
  id?: string                  // 🪶 lokal generiert (crypto.randomUUID)
  chat_serial?: number          // optional bis Ledger zuweist
  msg_number?: number           // optional bis persistiert
  role: Role                    // unverändert
  content: string               // unverändert
  timestamp?: string            // optional, da im Archiv-Flow generiert
  format?: "plain" | "markdown" | "html" // erlaubt UI-Darstellung
  truth_hash?: string
  verified?: boolean
}


export interface ArchiveEntry {
  id: string
  origin_chat: number
  role: Role
  content: string
  timestamp: string
  truth_hash: string
  public_key: string
  verified: boolean
}

export interface ArchiveSelection {
  id: string
  type: 'message' | 'chat'
  selected: boolean
  source_chat?: number
  timestamp: string
}

export interface ContextUpload {
  id: string
  role: Role
  content: string
  timestamp: string
  verified: boolean
}

/* ──────────────────────────────────────────────
   Verification
────────────────────────────────────────────── */

export interface VerificationItem {
  msg_number: number
  truth_hash: string
}

/**
 * Legacy / camelCase report shape (older UI/export code)
 * (kept for parsing + download/export adapters)
 */
export interface VerificationReportLegacy {
  version?: 'v1'
  generatedAt?: string
  truthHash?: string

  entriesCount?: number
  lastVerifiedAt?: string
  publicKey?: string

  status?: 'verified' | 'unverified'
  source?: 'archive-selection'

  content?: {
    canonical_text?: string
    pairs?: {
      pair_id: string
      user: { content: string; timestamp: string }
      assistant: { content: string; timestamp: string }
    }[]
  }

  verification_chain?: VerificationItem[]
  chain_signature?: string

  [key: string]: any
}

/**
 * Base / IO-compatible shape
 * (used for LocalStorage IO, parsing, migration)
 */
export interface VerificationReportBase {
  protocol_version?: 'v1'
  generated_at?: string

  source?: 'archive-selection'
  pair_count?: number
  status?: 'verified' | 'unverified'
  last_verified_at?: string
  public_key?: string

  truth_hash?: string
  hash_profile?: string
  key_profile?: string
  seal_timestamp?: string

  content?: {
    canonical_text?: string
    pairs?: {
      pair_id: string
      user: { content: string; timestamp: string }
      assistant: { content: string; timestamp: string }
    }[]
  }

  chat_meta?: {
    chat_id: string
    chat_serial: number
    message_total: number
  }

  verification_chain?: VerificationItem[]
  chain_signature?: string

  verified_true?: number
  verified_false?: number
}

/**
 * Canonical v5 Verification Report
 * GUARANTEED after normalizeReport()
 */
export interface VerificationReport {
  protocol_version: 'v1'
  generated_at: string

  source: 'archive-selection'
  pair_count: number
  status: 'verified' | 'unverified'
  public_key: string
  last_verified_at?: string

  truth_hash: string
  hash_profile?: string
  key_profile?: string
  seal_timestamp?: string

  content?: VerificationReportBase['content']

  chat_meta?: VerificationReportBase['chat_meta']
  verification_chain?: VerificationItem[]
  chain_signature?: string

  verified_true?: number
  verified_false?: number
}

/* ──────────────────────────────────────────────
   Central exports
────────────────────────────────────────────── */

export type {
  ChatMessage as TChatMessage,
  ArchiveEntry as TArchiveEntry,
  ArchiveSelection as TArchiveSelection,
  ContextUpload as TContextUpload,
  VerificationReport as TVerificationReport,
  VerificationReportBase as TVerificationReportBase,
  VerificationReportLegacy as TVerificationReportLegacy,
}

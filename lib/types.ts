/**
 * ============================================================================
 * FILE INDEX — lib/types.ts
 * PROJECT: GPTM-Galaxy+ · m-pathy Archive + Verification
 * CONTEXT: ARCHIVE Overlay — Typen & Datenverträge
 * MODE: Research · Documentation · Planning ONLY
 * ============================================================================
 *
 * FILE PURPOSE (IST)
 * ---------------------------------------------------------------------------
 * Zentrale Typdefinitionen (Single Source of Truth) für:
 * - Chat-Nachrichten
 * - Archiv-Einträge
 * - Selections
 * - Context Uploads
 * - Verification Reports (Legacy → Canonical)
 *
 *
 * KANONISCHER SOLLZUSTAND (REFERENZ)
 * ---------------------------------------------------------------------------
 * EBENE 0 / EBENE 1:
 *   - Nicht zuständig (UI-Struktur)
 *
 * EBENE 2 (CHAT | REPORTS):
 *   - CHAT und REPORTS sind logisch getrennte Modi
 *   - REPORTS basieren ausschließlich auf Report-Daten
 *   - Keine Vermischung von CHAT- und REPORTS-Verträgen
 *
 *
 * STRUKTURELL RELEVANTE BEREICHE (IST)
 * ---------------------------------------------------------------------------
 * 1. Core-Chat-Typen
 *    - ChatMessage
 *    - ArchiveEntry
 *    - ArchiveSelection
 *    - ContextUpload
 *
 * 2. Verification-Typen
 *    - VerificationItem
 *    - VerificationReportLegacy (camelCase)
 *    - VerificationReportBase (IO / Migration)
 *    - VerificationReport (Canonical v5)
 *
 * 3. Export-Aggregation
 *    - Zentrale Typ-Re-Exports (T*)
 *
 *
 * IST–SOLL-DELTAS (EXPLIZIT, OHNE BEWERTUNG)
 * ---------------------------------------------------------------------------
 * Δ1: Typische Trennung CHAT vs. REPORTS
 *     SOLL:
 *       - Klare, unabhängige Typverträge für CHAT und REPORTS
 *     IST:
 *       - Typen für CHAT, ARCHIVE und REPORTS sind gemeinsam
 *         in einer zentralen Datei gebündelt
 *
 * Δ2: REPORTS-Abhängigkeit von CHAT-Metadaten
 *     SOLL:
 *       - REPORTS arbeiten ausschließlich mit Report-Daten
 *     IST:
 *       - VerificationReport enthält optional chat_meta
 *         (chat_id, chat_serial, message_total)
 *
 * Δ3: Legacy-Unterstützung
 *     SOLL:
 *       - Klare, kanonische Report-Struktur
 *     IST:
 *       - Zusätzliche Legacy-Interfaces (VerificationReportLegacy)
 *         sind weiterhin Teil des öffentlichen Typraums
 *
 * Δ4: Scope-Erweiterung REPORTS
 *     SOLL:
 *       - Reports Overview als klar umrissener Datenraum
 *     IST:
 *       - Typen erlauben umfangreiche Inhalte
 *         (content, verification_chain, signatures, counts)
 *
 *
 * BEWUSST NICHT IM SCOPE
 * ---------------------------------------------------------------------------
 * - Keine Aussage zur Typ-Granularität
 * - Keine Bewertung der Legacy-Kompatibilität
 * - Keine Empfehlungen zur Aufteilung der Typen
 * - Keine Änderungen an Datenverträgen
 *
 *
 * FAZIT (DESKRIPTIV)
 * ---------------------------------------------------------------------------
 * Diese Datei definiert konsistente und umfassende Typverträge für das
 * gesamte Archive- und Verification-System, bündelt jedoch CHAT- und
 * REPORTS-relevante Typen in einem gemeinsamen Typraum und ermöglicht
 * damit semantische Überschneidungen, die vom kanonischen UI-Sollzustand
 * getrennt gedacht sind.
 *
 * ============================================================================
 */


export type Role = 'user' | 'assistant' | 'system'

/* ──────────────────────────────────────────────
   Core
────────────────────────────────────────────── */

export interface ChatMessage {
  id: string
  chat_serial: number
  msg_number: number
  role: Role
  content: string
  timestamp: string
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

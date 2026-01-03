// lib/contextInjection.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Context Injection – deterministic transfer into new chat context
//
// IMPORTANT SEPARATION LAW:
// - This module may LIMIT injected context (for UX + safety).
// - This module must NEVER affect archive projections.
// - Archive projections must always read full Triketon ledger.

import { readLS, writeLS } from './storage'
import type { TArchiveEntry } from './types'
import { createDeterministicSummary } from './summaryEngine'

type PendingContext =
  | { type: 'summary'; data: string; count: number; timestamp: string }
  | { type: 'raw'; data: TArchiveEntry[]; count: number; timestamp: string }

/**
 * Liest gespeicherte Auswahl (summary | raw) aus LocalStorage
 */
export function getPendingContext(): PendingContext | null {
  return (readLS<PendingContext>('mpathy:context:upload') as PendingContext) || null
}

/**
 * Lädt deterministische Zusammenfassung in neuen Chat
 */
export function injectSummaryContext(entries: TArchiveEntry[]): void {
  const safe = Array.isArray(entries) ? entries : []
  const summary = createDeterministicSummary(safe)

  const payload: PendingContext = {
    type: 'summary',
    data: summary,
    count: safe.length,
    timestamp: new Date().toISOString(),
  }

  writeLS('mpathy:context:upload', payload)
}

/**
 * Lädt Roh-Auswahl (Nachrichten + Chats) in neuen Chat
 *
 * Hard Limit (UX contract): max 6 Q/A pairs = 12 entries.
 * This is ONLY for context injection and must not leak into projections.
 */
const MAX_CONTEXT_PAIRS = 6
const MAX_CONTEXT_ENTRIES = MAX_CONTEXT_PAIRS * 2

export function injectRawContext(entries: TArchiveEntry[]): void {
  const safe = Array.isArray(entries) ? entries : []
  const limited = safe.slice(-MAX_CONTEXT_ENTRIES)

  const payload: PendingContext = {
    type: 'raw',
    data: limited,
    count: limited.length,
    timestamp: new Date().toISOString(),
  }

  writeLS('mpathy:context:upload', payload)
}

/**
 * Löscht bestehenden Upload-Kontext (Reset)
 */
export function clearContextUpload(): void {
  try {
    localStorage.removeItem('mpathy:context:upload')
  } catch {
    /* ignore */
  }
}

// lib/contextInjection.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Context Injection – deterministic transfer into new chat context

import { readLS, writeLS } from './storage'
import { TArchiveEntry } from './types'
import { createDeterministicSummary } from './summaryEngine'

/**
 * Liest gespeicherte Auswahl (summary | raw) aus LocalStorage
 */
export function getPendingContext():
  | { type: 'summary' | 'raw'; data: string | TArchiveEntry[]; count?: number }
  | null {
  return readLS('mpathy:context:upload') || null
}

/**
 * Lädt deterministische Zusammenfassung in neuen Chat
 * (keine Limitierung – Summary ist bereits verdichtet)
 */
export function injectSummaryContext(entries: TArchiveEntry[]): void {
  const summary = createDeterministicSummary(entries)

  const payload = {
    type: 'summary',
    data: summary,
    count: entries.length,
    timestamp: new Date().toISOString(),
  }

  writeLS('mpathy:context:upload', payload)
}

/**
 * Lädt Roh-Auswahl (Nachrichten + Chats) in neuen Chat
 * Limitierung gilt AUSSCHLIESSLICH hier
 */
const MAX_CONTEXT_PAIRS = 6
const MAX_CONTEXT_ENTRIES = MAX_CONTEXT_PAIRS * 2

export function injectRawContext(entries: TArchiveEntry[]): void {
  const limited = Array.isArray(entries)
    ? entries.slice(-MAX_CONTEXT_ENTRIES)
    : []

  const payload = {
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

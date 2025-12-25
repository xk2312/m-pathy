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
 */
export function injectRawContext(entries: TArchiveEntry[]): void {
  const payload = {
    type: 'raw',
    data: entries,
    count: entries.length,
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

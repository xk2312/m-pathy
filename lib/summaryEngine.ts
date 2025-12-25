// lib/summaryEngine.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Deterministic Summary Engine – reproducible text reduction (no AI)

import { TArchiveEntry } from './types'

/**
 * Konstante zur Begrenzung der Summary-Länge (Schutz gegen Speicherüberlauf)
 */
const MAX_SUMMARY_LENGTH = 8000

/**
 * Normalisiert Textinhalte: entfernt Zeilenumbrüche, mehrfach-Spaces, trim
 */
function normalizeContent(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Erstellt eine deterministische, reproduzierbare Zusammenfassung
 * aus beliebig vielen Archiv-Nachrichten.
 *
 * Regeln:
 * – Sortierung strikt nach Timestamp
 * – Format: [role] content
 * – Keine Neuformulierung, keine Kürzung außer Längenlimit
 * – Ausgabe ist pure Textreduktion (nicht interpretativ)
 */
export function createDeterministicSummary(entries: TArchiveEntry[]): string {
  if (!entries || entries.length === 0) return ''

  const sorted = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  const combined = sorted
    .map((m) => `[${m.role}] ${normalizeContent(m.content)}`)
    .join('\n\n')

  // Hard limit → kein Overflow in LocalStorage
  return combined.slice(0, MAX_SUMMARY_LENGTH)
}

/**
 * Packt das Ergebnis in das Context-Upload-Objekt für neuen Chat-Start.
 * → Wird von ArchiveActions aufgerufen.
 */
export function writeSummaryToContext(entries: TArchiveEntry[]): void {
  const summary = createDeterministicSummary(entries)
  if (!summary) return
  const payload = {
    type: 'summary',
    data: summary,
    count: entries.length,
    hash: generateSummaryHash(summary),
  }
  try {
    localStorage.setItem('mpathy:context:upload', JSON.stringify(payload))
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Einfache Prüfsumme für Reproduzierbarkeit (kein Kryptohash)
 */
export function generateSummaryHash(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // to 32bit
  }
  return `S${Math.abs(hash)}`
}

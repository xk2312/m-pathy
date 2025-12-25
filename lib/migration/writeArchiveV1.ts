// AFTER
// lib/migration/writeArchiveV1.ts
// Phase B · Baby-Step B4
// Schreibt deterministisch nach mpathy:archive:v1
// KEINE Mutation der Quelle

import type { ArchiveEntry } from '@/lib/types'

const ARCHIVE_KEY = 'mpathy:archive:v1'

export function writeArchiveV1(entries: ArchiveEntry[]): void {
  try {
    if (typeof window === 'undefined') return
    const data = Array.isArray(entries) ? entries : []
    window.localStorage.setItem(ARCHIVE_KEY, JSON.stringify(data))
  } catch {
    // bewusst still
  }
}

// AFTER
// lib/migration/verifyArchiveV1.ts
// Phase B · Baby-Step B5
// Read-back-Check: Counts & Reihenfolge
// KEIN Schreiben · KEIN UI

import type { ArchiveEntry } from '@/lib/types'

const ARCHIVE_KEY = 'mpathy:archive:v1'

export function verifyArchiveV1(expectedCount: number): boolean {
  try {
    if (typeof window === 'undefined') return false
    const raw = window.localStorage.getItem(ARCHIVE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return false
    if (data.length !== expectedCount) return false

    // Reihenfolge-Check (stabil): ids müssen in gleicher Reihenfolge bleiben
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1] as ArchiveEntry
      const curr = data[i] as ArchiveEntry
      if (!prev?.timestamp || !curr?.timestamp) return false
      if (prev.timestamp > curr.timestamp) return false
    }

    return true
  } catch {
    return false
  }
}

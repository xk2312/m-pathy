// AFTER
// lib/migration/setTrustState.ts
// Phase B · Baby-Step B3
// Expliziter Trust-State pro Archiv-Eintrag
// full | partial | local-only

import type { ArchiveEntry } from '@/lib/types'

export type TrustState = 'full' | 'partial' | 'local-only'

export function setTrustState(entries: ArchiveEntry[]): TrustState {
  if (!entries.length) return 'local-only'

  const total = entries.length
  const verifiedCount = entries.filter((e) => e.verified).length
  const assistantVerified = entries.filter(
    (e) => e.role === 'assistant' && e.verified
  ).length
  const assistantTotal = entries.filter((e) => e.role === 'assistant').length

  if (verifiedCount === total) return 'full'
  if (assistantTotal > 0 && assistantVerified === assistantTotal) return 'partial'
  return 'local-only'
}

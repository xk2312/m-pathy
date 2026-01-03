/* ============================================================
 * lib/archiveWrite.ts
 * GPTM-Galaxy+ · Archive Write Helpers
 * ============================================================
 */

import { writeLS } from './storage'
import type { ArchivChat } from './archiveProjection'

const ARCHIVE_KEY = 'mpathy:archive:v1'
const ARCHIVE_PAIRS_KEY = 'mpathy:archive:pairs:v1'

export type ArchivePairEntry = {
  pair_id: string
  chat_id: number
  chain_id: string
  user: {
    id: string
    content: string
    timestamp: string
  }
  assistant: {
    id: string
    content: string
    timestamp: string
  }
  keywords: string[]
}

export function writeArchive(chats: ArchivChat[]): void {
  writeLS(ARCHIVE_KEY, chats)
}

export function writeArchivePairs(pairs: ArchivePairEntry[]): void {
  writeLS(ARCHIVE_PAIRS_KEY, pairs)
}

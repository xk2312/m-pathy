/* ============================================================
 * lib/archiveWrite.ts
 * GPTM-Galaxy+ · Archive Write Helpers
 * ============================================================
 *
 * RULE:
 * - This module MUST NOT write archive pairs.
 * - archive:pairs:v1 is written exclusively by archivePairProjection.ts
 */

import { writeLS } from './storage'
import type { ArchivChat } from './archiveProjection'

const ARCHIVE_KEY = 'mpathy:archive:v1'

/**
 * Persist chat-level archive (projection result)
 * Single writer: archiveProjection.ts
 */
export function writeArchive(chats: ArchivChat[]): void {
  writeLS(ARCHIVE_KEY, chats)
}

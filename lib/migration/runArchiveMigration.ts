// lib/migration/runArchiveMigration.ts
// Phase B½ – einmalige Ausführung der Migration
// KEIN UI · KEIN TRIKETON · KEIN RE-SEAL

import { readChatV1 } from './readChatV1'
import { mapChatV1ToV2 } from './mapChatV1ToV2'
import { deriveArchiveEntries } from './deriveArchiveEntries'
import { setTrustState } from './setTrustState'
import { writeArchiveV1 } from './writeArchiveV1'

const MIGRATION_FLAG = 'mpathy:archive:migrated:v2'

export function runArchiveMigrationOnce(publicKey: string): void {
  try {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(MIGRATION_FLAG)) return

    const rawMessages = readChatV1()
    if (!rawMessages.length) {
      window.localStorage.setItem(MIGRATION_FLAG, 'done')
      return
    }

    const messages = mapChatV1ToV2(rawMessages)
    const entries = deriveArchiveEntries(messages, publicKey)
    setTrustState(entries) // bewusst nur berechnet

    writeArchiveV1(entries)

    window.localStorage.setItem(MIGRATION_FLAG, 'done')
  } catch {
    // bewusst still
  }
}

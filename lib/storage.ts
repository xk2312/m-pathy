import { storageVault } from './storageVault';

export type MpathyNamespace =
  | 'mpathy:chat:v1' // LS
  | 'mpathy:chat:chain_id' // LS + IndexedDB (Chat-Anker)
  | 'mpathy:archive:v1' // -> IndexedDB
  | 'mpathy:archive:chat_map' // LS
  | 'mpathy:archive:chat_counter'
  | 'mpathy:archive:pairs:v1' // LS
  | 'mpathy:context:upload' // ist aktuell nicht zu sehen
  | 'mpathy:verification:v1' // -> IndexedDB
  | 'mpathy:verification:reports:v1' // -> IndexedDB
  | 'mpathy:triketon:v1' // -> IndexedDB
  | 'mpathy:triketon:device_public_key_2048' // LS und IndexedDB
 
 
  // Deterministische Spiegelung nur für kanonische Persistenz-Namespaces
  const CANONICAL_VAULT_KEYS: MpathyNamespace[] = [
    'mpathy:chat:chain_id',
    'mpathy:chat:v1',
    'mpathy:triketon:device_public_key_2048',
    'mpathy:triketon:v1',
    'mpathy:archive:chat_counter',
    'mpathy:archive:chat_map',
    'mpathy:archive:pairs:v1',
    'mpathy:archive:v1',
    'mpathy:verification:reports:v1'
  ];
export type MpathySessionNamespace =
  | 'mpathy:archive:selection:v1'
  | 'mpathy:context:archive-chat:v1'


export type ArchivePair = {
  pair_id: string
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
  chain_id: string
}

export type ArchiveSelection = {
  pairs: ArchivePair[]
}


function hasLocalStorage(): boolean {
  try {
    const testKey = '__mpathy_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function hasSessionStorage(): boolean {
  try {
    const testKey = '__mpathy_session_test__'
    window.sessionStorage.setItem(testKey, '1')
    window.sessionStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export function readLS<T>(key: MpathyNamespace): T | null {
  if (!hasLocalStorage()) return null
  const raw = window.localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeLS<T>(key: MpathyNamespace, value: T): void {
  if (typeof window === 'undefined' || !hasLocalStorage()) return;

  // 1. Triketon-Schutz (Legacy & Vault)
// if (key === 'mpathy:triketon:v1') {
  // const existingLS = window.localStorage.getItem(key);
  //if (existingLS !== null) {
    // LS darf nicht überschrieben werden
    //return;
  //}
//}


// archive:pairs must always be written (even empty) 
// to guarantee deterministic hydration
if (key === 'mpathy:archive:pairs:v1') {
  // no early return
}

  // 2. Sofortiger LocalStorage-Commit
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[Storage] ⚠️ LS Limit erreicht für ${key}. Vault übernimmt.`);
  }

  if (CANONICAL_VAULT_KEYS.includes(key)) {
    storageVault.put(key, value).catch((err) => {
      console.error(`[Vault] ❌ Kritischer Spiegelungsfehler für ${key}:`, err);
    });
  }

}

export function clearLS(key: MpathyNamespace): void {
  if (!hasLocalStorage()) return
  window.localStorage.removeItem(key)
}

export function clearAllLS(): void {
  if (!hasLocalStorage()) return
  const keys: MpathyNamespace[] = [
  'mpathy:chat:v1',
  'mpathy:archive:v1',
  'mpathy:context:upload',
  'mpathy:verification:v1',
  'mpathy:verification:reports:v1',
  // ⚠️ Triketon bewusst NICHT hier
]

  keys.forEach((k) => window.localStorage.removeItem(k))
}

export function readSS<T>(key: MpathySessionNamespace): T | null {
  if (!hasSessionStorage()) return null
  const raw = window.sessionStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
} catch {
    return null
  }
}

export function readArchiveSelection(): ArchiveSelection {
  const sel = readSS<ArchiveSelection>('mpathy:archive:selection:v1')
  if (!sel || !Array.isArray(sel.pairs)) {
    return { pairs: [] }
  }
  return sel
}


export function writeSS<T>(key: MpathySessionNamespace, value: T): void {
  if (!hasSessionStorage()) return
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

export function writeArchiveSelection(selection: ArchiveSelection): void {
  if (!hasSessionStorage()) return

  const unique = new Map<string, ArchivePair>()
  selection.pairs.forEach((p) => {
    unique.set(p.pair_id, p)
  })

  const ordered = Array.from(unique.values()).sort((a, b) =>
    a.pair_id.localeCompare(b.pair_id)
  )

  writeSS<ArchiveSelection>('mpathy:archive:selection:v1', {
    pairs: ordered,
  })
}
export function clearArchiveSelection(): void {
  clearSS('mpathy:archive:selection:v1')
}


export function clearSS(key: MpathySessionNamespace): void {
  if (!hasSessionStorage()) return
  window.sessionStorage.removeItem(key)
}

/* ============================================================
   ARCHIVE → CHAT CONTEXT (CANONICAL · SESSION ONLY)
   ============================================================ */

const ARCHIVE_CHAT_CONTEXT_KEY: MpathySessionNamespace =
  'mpathy:context:archive-chat:v1'

export function writeArchiveChatContext(text: string): void {
  if (!hasSessionStorage()) return
  const value = typeof text === 'string' ? text.trim() : ''
  if (!value) return
  window.sessionStorage.setItem(ARCHIVE_CHAT_CONTEXT_KEY, JSON.stringify(value))
}

export function readArchiveChatContext(): string | null {
  if (!hasSessionStorage()) return null
  const raw = window.sessionStorage.getItem(ARCHIVE_CHAT_CONTEXT_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'string' && parsed.trim().length > 0
      ? parsed
      : null
  } catch {
    return null
  }
}

export function clearArchiveChatContext(): void {
  if (!hasSessionStorage()) return
  window.sessionStorage.removeItem(ARCHIVE_CHAT_CONTEXT_KEY)
}

export async function restoreTriketonFromVault(): Promise<void> {
  if (typeof window === 'undefined') return
  if (!hasLocalStorage()) return

  const key = 'mpathy:triketon:v1'
  const existing = window.localStorage.getItem(key)
  if (existing) return

  try {
    const fromVault = await storageVault.get(key)
    if (!Array.isArray(fromVault) || fromVault.length === 0) return

    writeLS(key, fromVault)

window.dispatchEvent(
  new CustomEvent('mpathy:triketon:ready')
)

window.dispatchEvent(
  new CustomEvent('mpathy:triketon:updated')
)

  } catch (e) {
    console.error('[Storage] Restore Triketon failed', e)
  }
}

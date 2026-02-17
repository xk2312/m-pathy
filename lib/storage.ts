import { storageVault } from './storageVault';

// Sofortiger Check der Speicher-Integrität beim Laden des Moduls
if (typeof window !== 'undefined') {
  migrateLSToVaultIfEmpty().catch(console.error);
}

export type MpathyNamespace =
  | 'mpathy:chat:v1' // LS
  | 'mpathy:archive:v1' // -> IndexedDB
  | 'mpathy:archive:chat_map' // LS
  | 'mpathy:archive:chat_counter'
  | 'mpathy:archive:pairs:v1' // LS
  | 'mpathy:context:upload' // ist akuell nicht zu sehen
  | 'mpathy:verification:v1' // -> IndexedDB
  | 'mpathy:verification:reports:v1' // -> IndexedDB
  | 'mpathy:triketon:v1' // -> IndexedDB
  | 'mpathy:triketon:device_public_key_2048' // LS und IndexedDB


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
  if (!hasLocalStorage()) return

  // 1. Triketon-Schutzlogik (Hybrid)
  // Wir prüfen den LS sofort (synchron).
  if (key === 'mpathy:triketon:v1') {
    const existingLS = window.localStorage.getItem(key)
    if (existingLS !== null) return
  }

  // 2. LocalStorage Schreibvorgang (Synchroner Cache)
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`[Storage] ⚠️ LS Limit erreicht für ${key}. Vault übernimmt.`);
  }

  // 3. Vault-Schreibvorgang (Asynchroner Master)
  // Hier integrieren wir den zusätzlichen Schutz: 
  // Falls es im Vault bereits existiert, überschreiben wir Triketon nicht.
  if (key === 'mpathy:triketon:v1') {
    storageVault.get(key).then((existingVault) => {
      if (existingVault === undefined || existingVault === null) {
        storageVault.put(key, value);
      }
    }).catch(err => console.error("[Vault] Triketon-Check failed", err));
  } else {
    // Alle anderen Keys werden einfach gespiegelt
    storageVault.put(key, value).catch((err) => {
      console.error(`[Vault] ❌ Spiegelungsfehler für ${key}:`, err)
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

/**
 * MAIOS 2.1 - Smart Migration
 * Kopiert Daten vom LS in den Vault NUR DANN, wenn der Vault komplett leer ist.
 * Dies stellt sicher, dass die Migration nur einmalig (oder nach IDB-Clear) läuft.
 */
export async function migrateLSToVaultIfEmpty(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // 1. Check: Ist der Vault leer? (Wir prüfen Triketon oder die Existenz irgendeines Keys)
    // Ein leerer Vault ist das Signal für eine notwendige Migration.
    const triketonInVault = await storageVault.get('mpathy:triketon:v1');
    
    if (triketonInVault !== null && triketonInVault !== undefined) {
      console.debug('[Vault] ✅ Daten vorhanden. Migration wird übersprungen.');
      return;
    }

    console.info('[Vault] 🚛 Vault ist leer. Starte Migration von LS zu IDB...');
    
    let count = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      
      if (key && key.startsWith('mpathy:')) {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            await storageVault.put(key, parsed);
            count++;
          } catch (e) {
            // Falls JSON korrupt ist, als String speichern
            await storageVault.put(key, raw);
            count++;
          }
        }
      }
    }
    
    if (count > 0) {
      console.info(`[Vault] ✅ Migration erfolgreich: ${count} Keys gesichert.`);
    } else {
      console.debug('[Vault] ℹ️ Keine mpathy-Daten im LocalStorage gefunden.');
    }

  } catch (err) {
    console.error('[Vault] ❌ Migrations-Check fehlgeschlagen:', err);
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
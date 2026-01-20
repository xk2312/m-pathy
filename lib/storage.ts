/* ======================================================================
   FILE INDEX — storage.ts
   MODE: GranularFileIndexDeveloper · CodeForensik
   SCOPE: LOCAL / SESSION STORAGE · ARCHIVE ↔ CHAT BRIDGE
   STATUS: IST-ZUSTAND (KANONISCH, OHNE INTERPRETATION)
   ======================================================================

   1. ROLLE DER DATEI
   ----------------------------------------------------------------------
   Diese Datei ist die **kanonische Storage-Abstraktion** für m-pathy.

   Sie kapselt:
   - LocalStorage (dauerhaft)
   - SessionStorage (ephemer, flow-basiert)
   - Namespace-Verträge (Typsicherheit)

   → storage.ts ist die **Brücke zwischen ARCHIVE und CHAT**.


   2. STORAGE-NAMESPACES (VERTRAG)
   ----------------------------------------------------------------------
   LocalStorage (MpathyNamespace):
   - mpathy:chat:v1
   - mpathy:archive:v1
   - mpathy:archive:pairs:v1
   - mpathy:context:upload
   - mpathy:verification:*
   - mpathy:triketon:v1 (append-only!)

   SessionStorage (MpathySessionNamespace):
   - mpathy:archive:selection:v1
   - mpathy:context:archive-chat:v1

   TODO-RELEVANZ:
   - ToDo-Flow nutzt AUSSCHLIESSLICH
     SessionStorage → archive-chat:v1
   - Korrekte Wahl (kein Persist-Leak)


   3. BASIS-PRIMITIVEN
   ----------------------------------------------------------------------
   readLS / writeLS / clearLS
   readSS / writeSS / clearSS

   Eigenschaften:
   - Defensive Guards (hasLocalStorage / hasSessionStorage)
   - JSON-Serialisierung
   - Fail-Safe (null bei Fehler)

   TODO-RELEVANZ:
   - readSS / writeSS sind die
     Low-Level-Grundlage des Flows


   4. ARCHIVE SELECTION
   ----------------------------------------------------------------------
   readArchiveSelection()
   writeArchiveSelection()
   clearArchiveSelection()

   Eigenschaften:
   - Deduplication (pair_id)
   - Deterministische Sortierung
   - Session-only

   TODO-RELEVANZ:
   - Selection wird im ARCHIVE genutzt
   - Muss NACH Erfolg gelöscht werden
   - NICHT vor Chat-Erstellung


   5. ARCHIVE → CHAT CONTEXT (KERNSTELLE)
   ----------------------------------------------------------------------
   const ARCHIVE_CHAT_CONTEXT_KEY =
     'mpathy:context:archive-chat:v1'

   Funktionen:
   - writeArchiveChatContext(text)
   - readArchiveChatContext()
   - clearArchiveChatContext()

   Bedeutung:
   - Übergabe-Slot zwischen ARCHIVE und CHAT
   - ONE-SHOT gedacht
   - Session-lokal

   TODO-RELEVANZ (MAXIMAL):
   - writeArchiveChatContext():
     → korrekt genutzt (Summary wird geschrieben)
   - readArchiveChatContext():
     → wird in page.tsx gelesen
   - clearArchiveChatContext():
     → MUSS nach erfolgreichem NEUEN Chat erfolgen
     → darf NICHT bei Fehler ausgelöst werden


   6. KEINE BUSINESS-LOGIK
   ----------------------------------------------------------------------
   WICHTIG:
   - storage.ts enthält KEINE Flow-Logik
   - KEINE Events
   - KEINE UI
   - KEINE API-Calls

   TODO-RELEVANZ:
   - Diese Datei wird NICHT umgebaut
   - Sie ist der stabile Vertrag


   7. FEHLERBILD (KANONISCH)
   ----------------------------------------------------------------------
   storage.ts verhält sich korrekt.

   Der Fehler entsteht NICHT hier, sondern:
   - writeArchiveChatContext() wird aufgerufen
   - ABER der nächste Schritt (neuer Chat)
     wird nicht ausgelöst
   - clearArchiveChatContext() wird nie erreicht


   8. ZUSAMMENFASSUNG (KANONISCH)
   ----------------------------------------------------------------------
   storage.ts ist STABIL und KORREKT.

   Für die ToDos relevant:
   - readArchiveChatContext()
   - writeArchiveChatContext()
   - clearArchiveChatContext()
   - clearArchiveSelection()

   → storage.ts definiert den Übergabevertrag,
     nicht die Ausführung.

   ====================================================================== */
/* ============================================================
   LOCALSTORAGE DIAGNOSTIC — READ ONLY
   ============================================================ */

if (typeof window !== 'undefined') {
  try {
    console.group('[LS-DIAG] Boot')

    console.info('[LS-DIAG] origin:', window.location.origin)
    console.info('[LS-DIAG] href:', window.location.href)
    console.info('[LS-DIAG] userAgent:', navigator.userAgent)

    const lsAvailable =
      typeof window.localStorage !== 'undefined'

    console.info('[LS-DIAG] localStorage available:', lsAvailable)

    if (lsAvailable) {
      console.info(
        '[LS-DIAG] localStorage keys:',
        Object.keys(window.localStorage)
      )
      console.info(
        '[LS-DIAG] localStorage length:',
        window.localStorage.length
      )
    }

    console.groupEnd()
  } catch (e) {
    console.warn('[LS-DIAG] error during diagnostics', e)
  }
}

export type MpathyNamespace =
  | 'mpathy:chat:v1'
  | 'mpathy:archive:v1'
  | 'mpathy:archive:chat_map'
  | 'mpathy:archive:chat_counter'
  | 'mpathy:archive:pairs:v1'
  | 'mpathy:context:upload'
  | 'mpathy:verification:v1'
  | 'mpathy:verification:reports:v1'
  | 'mpathy:triketon:v1'
  | 'mpathy:triketon:device_public_key_2048'


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
  if (key === 'mpathy:triketon:v1') {
    const existing = window.localStorage.getItem(key)
    if (existing !== null) return
  }
  window.localStorage.setItem(key, JSON.stringify(value))
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
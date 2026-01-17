/* ======================================================================
   FILE INDEX — lib/storage.ts
   ======================================================================

   ROLE
   ----------------------------------------------------------------------
   Zentrale Low-Level-Abstraktion für LocalStorage und SessionStorage.
   Diese Datei ist die EINZIGE erlaubte Schnittstelle für:
   - Lesen / Schreiben / Löschen von Storage-Daten
   - Definition aller gültigen Storage-Namespaces
   - Normalisierung von Zugriffen (JSON, Verfügbarkeit, Guards)

   Diese Datei enthält KEINE Business-Logik.
   Sie ist reine Infrastruktur.

   ----------------------------------------------------------------------
   STORAGE NAMESPACES (DEFINIERT HIER)
   ----------------------------------------------------------------------

   LocalStorage (MpathyNamespace):
   - mpathy:chat:v1
   - mpathy:archive:v1
   - mpathy:archive:chat_map
   - mpathy:archive:chat_counter
   - mpathy:archive:pairs:v1
   - mpathy:context:upload
   - mpathy:verification:v1
   - mpathy:verification:reports:v1   <-- RELEVANT FÜR REPORTS-RENDER
   - mpathy:triketon:v1                <-- WRITE-ONCE (Ledger)
   - mpathy:triketon:device_public_key_2048

   SessionStorage (MpathySessionNamespace):
   - mpathy:archive:selection:v1       <-- Auswahl für Verify

   ----------------------------------------------------------------------
   PRIMITIVE FUNKTIONEN (LOW LEVEL)
   ----------------------------------------------------------------------

   hasLocalStorage()
   - Prüft Verfügbarkeit von window.localStorage
   - Guard gegen SSR / Security Errors

   hasSessionStorage()
   - Prüft Verfügbarkeit von window.sessionStorage

   readLS<T>(key)
   - Liest JSON aus LocalStorage
   - Gibt null zurück bei:
     - fehlendem Storage
     - fehlendem Key
     - JSON-Parse-Fehler

   writeLS<T>(key, value)
   - Schreibt JSON nach LocalStorage
   - Sonderfall:
     - mpathy:triketon:v1 ist WRITE-ONCE
       (existierender Wert wird NICHT überschrieben)

   clearLS(key)
   - Löscht EINEN LocalStorage-Key

   clearAllLS()
   - Löscht definierte LocalStorage-Keys
   - EXPLIZIT ausgeschlossen:
     - mpathy:triketon:v1

   readSS<T>(key)
   - Liest JSON aus SessionStorage

   writeSS<T>(key, value)
   - Schreibt JSON nach SessionStorage

   clearSS(key)
   - Löscht EINEN SessionStorage-Key

   ----------------------------------------------------------------------
   ARCHIVE-SELECTION HELPERS
   ----------------------------------------------------------------------

   readArchiveSelection()
   - Liest mpathy:archive:selection:v1 aus SessionStorage
   - Garantiert Rückgabeform:
     { pairs: ArchivePair[] }

   writeArchiveSelection(selection)
   - Normalisiert Selection:
     - entfernt Duplikate (pair_id)
     - sortiert deterministisch
   - Schreibt nach SessionStorage

   ----------------------------------------------------------------------
   DATENTYPEN
   ----------------------------------------------------------------------

   ArchivePair
   - pair_id
   - user { id, content, timestamp }
   - assistant { id, content, timestamp }
   - chain_id

   ArchiveSelection
   - pairs: ArchivePair[]

   ----------------------------------------------------------------------
   RELEVANZ FÜR REPORT-PROBLEM
   ----------------------------------------------------------------------

   - Diese Datei schreibt/liest Reports NICHT direkt,
     stellt aber den Schlüssel bereit:
       mpathy:verification:reports:v1

   - Jede Inkonsistenz zwischen:
       verificationStorage.ts
       ReportList.tsx
       ArchiveOverlay.tsx
     MUSS hier ausgeschlossen werden (Namespace exakt identisch).

   - Diese Datei ist NICHT verantwortlich für:
     - Normalisierung von Reports
     - Rendering
     - React State
     - Events

   ----------------------------------------------------------------------
   AUSSCHLUSS
   ----------------------------------------------------------------------

   ❌ Kein Event-System
   ❌ Kein React
   ❌ Keine Side-Effects außerhalb Storage
   ❌ Keine Daten-Transformation außer JSON

   ======================================================================
*/

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

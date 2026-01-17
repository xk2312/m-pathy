/* 📑 KANONISCHER FILE-INDEX — lib/storage.ts

Status: geprüft · driftfrei
Zweck: Diese Datei ist die einzige autorisierte Storage-Abstraktion des Systems.
Regel: Alles, was Storage betrifft, muss hier hindurch. Keine Ausnahmen.

1️⃣ Gesamtrolle der Datei

lib/storage.ts ist die Low-Level-Infrastruktur für:

LocalStorage

SessionStorage

Sie definiert Namespaces, Guards und Primitive, aber keine Business-Logik.

👉 Single Source of Truth für Storage-Zugriffe.

2️⃣ Definierte Storage-Namespaces
LocalStorage — MpathyNamespace
Namespace	Zweck
mpathy:chat:v1	Kanonischer Chat-Speicher
mpathy:archive:v1	Archiv-Metadaten
mpathy:archive:chat_map	Mapping Archiv → Chat
mpathy:archive:chat_counter	Archiv-Zähler
mpathy:archive:pairs:v1	Archivierte Message-Paare
mpathy:context:upload	Kontext aus Upload
mpathy:verification:v1	Verifikations-Metadaten
mpathy:verification:reports:v1	Reports (read-only für UI)
mpathy:triketon:v1	Ledger · write-once
mpathy:triketon:device_public_key_2048	Device Identity
SessionStorage — MpathySessionNamespace
Namespace	Zweck
mpathy:archive:selection:v1	Auswahl für Verify
mpathy:context:archive-chat:v1	Archive → Chat Continuation Context
3️⃣ Low-Level Guards
Funktion	Zweck
hasLocalStorage()	SSR- & Security-Guard
hasSessionStorage()	Session-Guard

✔️ Korrekt, redundantfrei, isoliert

4️⃣ Primitive Storage-Operationen
LocalStorage
Funktion	Beschreibung
readLS<T>	JSON-Read mit Null-Fallback
writeLS<T>	JSON-Write
clearLS	Entfernt einen Key
clearAllLS	Entfernt definierte Keys (ohne Triketon)

📌 Sonderregel:
mpathy:triketon:v1 ist WRITE-ONCE → korrekt enforced.

SessionStorage
Funktion	Beschreibung
readSS<T>	JSON-Read
writeSS<T>	JSON-Write
clearSS	Entfernt einen Session-Key
5️⃣ Archive-Selection-Subsystem
Datentypen

ArchivePair

ArchiveSelection

✔️ klar modelliert
✔️ keine Überladung
✔️ keine impliziten Felder

Helper-Funktionen
Funktion	Aufgabe
readArchiveSelection()	Garantierte Rückgabeform
writeArchiveSelection()	Dedup + deterministische Sortierung
clearArchiveSelection()	Explizites Löschen

📌 Wichtig:
Diese Logik ist rein mechanisch, keine Business-Interpretation.

6️⃣ Archive → Chat Context (Session-only, kanonisch)
Funktion	Aufgabe
writeArchiveChatContext()	schreibt Summary / Context
readArchiveChatContext()	liest validierten String
clearArchiveChatContext()	entfernt Context

✔️ Session-only
✔️ Trimmen & Validierung korrekt
✔️ keine Redundanz mit Selection

7️⃣ Explizite Ausschlüsse (eingehalten)

Diese Datei enthält nachweislich nicht:

❌ Events

❌ React

❌ State

❌ Business-Flows

❌ Report-Normalisierung

❌ Triketon-Berechnung

➡️ Infrastruktur pur.*/

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


/**
 * ============================================================================
 * FILE INDEX — lib/storage.ts
 * PROJECT: GPTM-Galaxy+ · m-pathy Archive + Verification
 * CONTEXT: Archive Overlay (Chat / Reports) — Soll/Ist-Abgleich
 * MODE: Research · Documentation · Planning ONLY
 * ============================================================================
 *
 * FILE PURPOSE (IST)
 * ---------------------------------------------------------------------------
 * Zentrale Abstraktionsschicht für LocalStorage und SessionStorage.
 * Verwaltet Namespaces, Lese-/Schreibzugriffe sowie Archiv- und
 * Selection-relevante Datenstrukturen.
 *
 *
 * RELEVANT FÜR ARCHIVE-OVERLAY (SOLLBEZUG)
 * ---------------------------------------------------------------------------
 * - Liefert die persistente Datenbasis für:
 *   • Chat-Inhalte
 *   • Archive-Chats
 *   • Archive-Pairs
 *   • Selections (Session-basiert)
 *   • Verification Reports
 * - Diese Datei ist KEINE UI-Datei, beeinflusst aber indirekt:
 *   • CHAT-Mode (Recent / Detail / Search)
 *   • REPORTS-Mode (Reports Overview)
 *
 *
 * STRUKTURELL RELEVANTE BEREICHE (IST)
 * ---------------------------------------------------------------------------
 * 1. Namespace-Definitionen (LocalStorage)
 *    - MpathyNamespace
 *      • mpathy:archive:v1
 *      • mpathy:archive:pairs:v1
 *      • mpathy:verification:reports:v1
 *      • weitere systemische Keys
 *
 * 2. Namespace-Definitionen (SessionStorage)
 *    - mpathy:archive:selection:v1
 *
 * 3. Archiv-Datenmodelle
 *    - ArchivePair
 *    - ArchiveSelection
 *
 * 4. Storage-Zugriffsfunktionen
 *    - readLS / writeLS / clearLS / clearAllLS
 *    - readSS / writeSS / clearSS
 *    - readArchiveSelection / writeArchiveSelection
 *
 *
 * IST–SOLL-DELTAS (EXPLIZIT, OHNE BEWERTUNG)
 * ---------------------------------------------------------------------------
 * Δ1: UI-Ebenen-Trennung (EBENE 0 / 1 / 2)
 *     SOLL:
 *       - Klare logische Trennung zwischen CHAT-Mode und REPORTS-Mode
 *     IST:
 *       - Storage-Ebene kennt keine explizite semantische Trennung
 *         zwischen CHAT- und REPORTS-Mode
 *       - Beide Modi greifen potenziell auf denselben Storage-Layer zu
 *
 * Δ2: REPORTS-Mode-Isolation
 *     SOLL:
 *       - REPORTS-Mode zeigt ausschließlich "Reports Overview"
 *       - Kein Zugriff auf Chat- oder Archive-Chat-Daten
 *     IST:
 *       - Keine strukturelle Absicherung auf Storage-Ebene, die
 *         REPORTS-Zugriffe auf Chat-/Archive-Namespaces verhindert
 *
 * Δ3: Suchlogik-Abgrenzung
 *     SOLL:
 *       - Search ist ein Unterzustand von CHAT
 *       - REPORTS kennt keine Chat-Suche
 *     IST:
 *       - Storage bietet keine explizite Trennung oder Kennzeichnung,
 *         ob Selection / Archive-Daten aus CHAT-Search oder anderen
 *         Kontexten stammen
 *
 * Δ4: ARCHIVE-Neuaufbau-Vermeidung
 *     SOLL:
 *       - Kein Neuaufbau von ARCHIVE beim Mode-Wechsel
 *     IST:
 *       - Storage ist rein zustandslos gegenüber UI-Wechseln
 *       - Keine explizite Persistenz oder Sperre gegen Reinitialisierung
 *         auf Mode-Wechsel-Ebene
 *
 *
 * BEWUSST NICHT IM SCOPE
 * ---------------------------------------------------------------------------
 * - Keine UI-Logik
 * - Keine Mode-Switch-Logik
 * - Keine Rendering-Entscheidungen
 * - Keine Patch- oder Lösungsvorschläge
 *
 *
 * FAZIT (DESKRIPTIV)
 * ---------------------------------------------------------------------------
 * Diese Datei bildet die technische Speicherbasis für das Archive-Overlay,
 * erzwingt jedoch aktuell keine strukturellen Garantien bezüglich der
 * kanonischen UI-Trennung von CHAT und REPORTS gemäß Sollzustand.
 *
 * ============================================================================
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


export function clearSS(key: MpathySessionNamespace): void {
  if (!hasSessionStorage()) return
  window.sessionStorage.removeItem(key)
}

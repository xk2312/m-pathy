// lib/storage.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// LocalStorage + SessionStorage Layer – MEFL conform

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
  | 'mpathy:triketon:device_public_key'
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

export function clearArchiveSelection(): void {
  clearSS('mpathy:archive:selection:v1')
}


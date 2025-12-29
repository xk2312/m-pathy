// lib/storage.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// LocalStorage Layer – MEFL conform

export type MpathyNamespace =
  | 'mpathy:chat:v1'
  | 'mpathy:archive:v1'
  | 'mpathy:context:upload'
  | 'mpathy:verification:v1'
  | 'mpathy:triketon:v1'
  | 'mpathy:triketon:device_public_key'
  | 'mpathy:triketon:device_public_key_2048'


/**
 * Prüft, ob LocalStorage verfügbar ist.
 */
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

/**
 * Liest einen Wert aus dem angegebenen Namespace.
 */
export function readLS<T>(key: MpathyNamespace): T | null {
  if (!hasLocalStorage()) return null
  const raw = window.localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    console.warn(`[mpathy] Invalid JSON in ${key}`)
    return null
  }
}

/**
 * Schreibt einen Wert in den Namespace.
 */
export function writeLS<T>(key: MpathyNamespace, value: T): void {
  if (!hasLocalStorage()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Entfernt einen Namespace-Eintrag.
 */
export function clearLS(key: MpathyNamespace): void {
  if (!hasLocalStorage()) return
  window.localStorage.removeItem(key)
}

/**
 * Löscht alle m-pathy Namespaces (z. B. bei Reset).
 */
export function clearAllLS(): void {
  if (!hasLocalStorage()) return
 const keys: MpathyNamespace[] = [
  'mpathy:chat:v1',
  'mpathy:archive:v1',
  'mpathy:context:upload',
  'mpathy:verification:v1',
  // ⚠️ Triketon bewusst NICHT hier
]

  keys.forEach((k) => window.localStorage.removeItem(k))
}

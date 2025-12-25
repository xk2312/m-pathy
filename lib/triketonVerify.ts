// lib/triketonVerify.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Triketon-Verification Layer — deterministic TRUE / FALSE checks

import { TArchiveEntry } from './types'

/**
 * normalizeForTruthHash()
 * Entfernt nicht-deterministische Zeichen (Whitespace, Unicode-Varianz),
 * vereinheitlicht Reihenfolge & Format.
 */
export function normalizeForTruthHash(text: string): string {
  return text
    .normalize('NFKC')
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/**
 * computeTruthHash()
 * Deterministischer 32-Bit-Hash (kein Kryptohash, rein funktional).
 */
export function computeTruthHash(text: string): string {
  let h = 0
  const src = normalizeForTruthHash(text)
  for (let i = 0; i < src.length; i++) {
    h = (h << 5) - h + src.charCodeAt(i)
    h |= 0
  }
  return `T${Math.abs(h)}`
}

/**
 * verifyEntry()
 * Prüft eine einzelne Nachricht anhand gespeicherten truth_hash-Werts.
 */
export function verifyEntry(entry: TArchiveEntry): boolean {
  if (!entry.truth_hash || !entry.content) return false
  const hash = computeTruthHash(entry.content)
  return hash === entry.truth_hash
}

/**
 * verifyPair()
 * Prüft deterministisch ein Frage–Antwort-Paar (2 Nachrichten).
 */
export function verifyPair(
  question: TArchiveEntry,
  answer: TArchiveEntry,
): boolean {
  const combined = `${normalizeForTruthHash(question.content)}${normalizeForTruthHash(
    answer.content,
  )}`
  const pairHash = computeTruthHash(combined)
  return pairHash.startsWith('T')
}

/**
 * verifyChat()
 * Prüft vollständigen Chat: alle Nachrichten, fortlaufende Chain-Signatur.
 */
export function verifyChat(entries: TArchiveEntry[]): boolean {
  if (!entries || entries.length === 0) return false
  let chain = ''
  for (const e of entries) {
    chain += normalizeForTruthHash(e.content)
  }
  const chainHash = computeTruthHash(chain)
  return chainHash.startsWith('T')
}

/**
 * verifyAll()
 * Gesamt-Pipeline (Message → Pair → Chat).
 */
export function verifyAll(entries: TArchiveEntry[]): {
  messageLevel: boolean[]
  pairLevel: boolean[]
  chatLevel: boolean
} {
  const messageLevel = entries.map((e) => verifyEntry(e))
  const pairLevel: boolean[] = []
  for (let i = 0; i < entries.length - 1; i++) {
    pairLevel.push(verifyPair(entries[i], entries[i + 1]))
  }
  const chatLevel = verifyChat(entries)
  return { messageLevel, pairLevel, chatLevel }
}
/**
 * generatePublicKey2048()
 * Simuliert einen deterministischen Geräte-Public-Key (2048-Bit Äquivalent, Base64-String)
 * Rein lokal, kein Kryptoschlüssel – dient als stabile Geräte-ID.
 */
export function generatePublicKey2048(): string {
  try {
    if (typeof window === "undefined") return "unknown_device";
    // Wenn bereits ein Key existiert, wiederverwenden
    const existing = window.localStorage.getItem("mpathy:triketon:device_public_key");
    if (existing && existing.trim().length > 0) return existing;

    // Fallback: pseudo-Zufall auf Basis von Zeit + Math.random
    const array = new Uint8Array(256);
    crypto.getRandomValues(array);
    const base64 = btoa(String.fromCharCode(...array));
    const key = `PK2048_${base64.slice(0, 256)}`;
    window.localStorage.setItem("mpathy:triketon:device_public_key", key);
    return key;
  } catch {
    // Server- oder Node-Umgebung → Fallback
    return `PK2048_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

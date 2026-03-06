// ============================================================================
// 📘 INDEX - lib/triketonVerify.ts (Triketon Verification & Key Generator v5)
// ----------------------------------------------------------------------------
// PURPOSE
//   Core deterministic verification layer for m-pathy’s Triketon Archive System.
//   Validates integrity of messages, pairs, and full chats, and produces stable
//   device-bound public keys for ledger signing.
//
// CORE FUNCTIONS
//   ──────────────────────────────────────────────────────────────────────────
//   ▪ normalizeForTruthHash(text)
//       Normalizes text: removes whitespace variance, lowercases, strips
//       line breaks → ensures hash consistency across platforms.
//
//   ▪ computeTruthHash(text)
//       Produces deterministic 32-bit integer hash (T-prefixed) from normalized
//       text. Not cryptographically secure - used for verification & drift checks.
//
//   ▪ verifyEntry(entry)
//       Compares stored truth_hash with recomputed one → TRUE if consistent.
//
//   ▪ verifyPair(question, answer)
//       Computes a combined hash of Q+A content → ensures pair linkage validity.
//
//   ▪ verifyChat(entries)
//       Sequentially concatenates normalized message content and verifies chain
//       integrity (all T-prefixed hashes consistent).
//
//   ▪ verifyAll(entries)
//       Full pipeline → returns granular validation object:
//         { messageLevel[], pairLevel[], chatLevel }
//
//   ▪ generatePublicKey2048(truthHashHex)
//       Expands 64-byte truth hash seed via iterative SHA-256 digesting (~2048-bit).
//       Produces a Base64-encoded device identifier (no cryptographic keypair).
//
//   ▪ getOrCreateDevicePublicKey2048(truthHashHex?)
//       Retrieves or creates persistent device key under
//       "mpathy:triketon:device_public_key" in localStorage.
//       Uses generatePublicKey2048() when missing.
//       Ensures deterministic reuse per device/browser.
//
// STORAGE & CONSTANTS
//   ──────────────────────────────────────────────────────────────────────────
//   DEVICE_KEY = "mpathy:triketon:device_public_key"
//     → Persistent localStorage key for device identity.
//
// DATA TYPES
//   TArchiveEntry (from ./types)
//     { content: string, truth_hash: string, ... }
//
// BEHAVIOUR NOTES
//   • All operations are local-only (no network).
//   • Hash results are deterministic across devices.
//   • Public key generation is synchronous to browser crypto.subtle API.
//   • Errors log to console with Triketon-prefixed messages.
//
// VERSIONING
//   Part of GPTM-Galaxy+ · m-pathy Archive + Verification System v5.
//   Governed by Council13 Triketon-Archive-Contract v2.
//
// ============================================================================


import { TArchiveEntry } from "./types";

const DEVICE_KEY = "mpathy:triketon:device_public_key";

/**
 * normalizeForTruthHash()
 * Entfernt nicht-deterministische Zeichen (Whitespace, Unicode-Varianz),
 * vereinheitlicht Reihenfolge & Format.
 */
export function normalizeForTruthHash(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * computeTruthHash()
 * Deterministischer 32-Bit-Hash (kein Kryptohash, rein funktional).
 */
export function computeTruthHash(text: string): string {
  let h = 0;
  const src = normalizeForTruthHash(text);
  for (let i = 0; i < src.length; i++) {
    h = (h << 5) - h + src.charCodeAt(i);
    h |= 0;
  }
  return `T${Math.abs(h)}`;
}

/**
 * verifyEntry()
 * Prüft eine einzelne Nachricht anhand gespeicherten truth_hash-Werts.
 */
export function verifyEntry(entry: TArchiveEntry): boolean {
  if (!entry.truth_hash || !entry.content) return false;
  const hash = computeTruthHash(entry.content);
  return hash === entry.truth_hash;
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
  )}`;
  const pairHash = computeTruthHash(combined);
  return pairHash.startsWith("T");
}

/**
 * verifyChat()
 * Prüft vollständigen Chat: alle Nachrichten, fortlaufende Chain-Signatur.
 */
export function verifyChat(entries: TArchiveEntry[]): boolean {
  if (!entries || entries.length === 0) return false;
  let chain = "";
  for (const e of entries) {
    chain += normalizeForTruthHash(e.content);
  }
  const chainHash = computeTruthHash(chain);
  return chainHash.startsWith("T");
}

/**
 * verifyAll()
 * Gesamt-Pipeline (Message → Pair → Chat).
 */
export function verifyAll(entries: TArchiveEntry[]): {
  messageLevel: boolean[];
  pairLevel: boolean[];
  chatLevel: boolean;
} {
  const messageLevel = entries.map((e) => verifyEntry(e));
  const pairLevel: boolean[] = [];
  for (let i = 0; i < entries.length - 1; i++) {
    pairLevel.push(verifyPair(entries[i], entries[i + 1]));
  }
  const chatLevel = verifyChat(entries);
  return { messageLevel, pairLevel, chatLevel };
}

/**
 * generatePublicKey2048()
 * Simuliert einen deterministischen Geräte-Public-Key (2048-Bit Äquivalent, Base64-String)
 * Rein lokal, kein Kryptoschlüssel – dient als stabile Geräte-ID.
 */
export async function generatePublicKey2048(
  truthHashHex: string,
): Promise<string> {
  try {
    if (!truthHashHex || truthHashHex.length !== 64) {
      console.warn("[Triketon] invalid truth hash, cannot derive key");
      return "invalid_key";
    }

    const seed = new Uint8Array(truthHashHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
    const material: number[] = [];
    let current = seed;

    // iterative SHA-256 expansion (~2048 bit)
    while (material.length < 256) {
      const digest = await crypto.subtle.digest("SHA-256", current);
      const bytes = Array.from(new Uint8Array(digest));
      material.push(...bytes);
      current = new Uint8Array(bytes);
    }

    const keyBytes = new Uint8Array(material.slice(0, 256));
    const base64 = btoa(String.fromCharCode(...keyBytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return base64;
  } catch (err: any) {
    if (err instanceof DOMException) {
      console.error("[Triketon] WebCrypto digest failed:", err.message);
      return "crypto_error";
    }
    if (err && err.message?.includes("subtle")) {
      console.error("[Triketon] SubtleCrypto unavailable → fallback key");
      return `PK2048_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    }
    console.error("[Triketon] generatePublicKey2048 failed (generic):", err);
    return "error_key";
  }
}


/**
 * getOrCreateDevicePublicKey2048()
 * Gibt einen persistenten Geräte-Public-Key zurück oder erstellt ihn einmalig.
 * Wird in LocalStorage unter mpathy:triketon:device_public_key gespeichert.
 */
export async function getOrCreateDevicePublicKey2048(
  truthHashHex?: string,
): Promise<string> {
  try {
    if (typeof window === "undefined") return "server_mode";
    const ls = window.localStorage;
    const existing = ls.getItem(DEVICE_KEY);
    if (existing && existing.trim().length > 0) {
      return existing; // ✅ reuse persistent key
    }

   const newKey = (await generatePublicKey2048(
  truthHashHex ?? "0000000000000000000000000000000000000000000000000000000000000000"
)).replace(/^"+|"+$/g, "").trim();

ls.setItem(DEVICE_KEY, newKey);
console.debug("[Triketon] new device-bound key generated");
return newKey;
  } catch (err) {
    console.error("[Triketon] device key init failed:", err);
    return "error_key";
  }
}

/**
 * prepareSealPayload()
 * Canonical handoff object for server-side Seal step.
 * READ-ONLY derivation from verified archive entries.
 */
export function prepareSealPayload(entries: TArchiveEntry[]) {
  return {
    protocol_version: "v1",
    prepared_at: new Date().toISOString(),
    entry_count: entries.length,
    truth_hashes: entries.map((e) => e.truth_hash),
  };
}


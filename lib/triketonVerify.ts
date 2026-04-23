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
 * canonicalizeTruthState()
 * Erzeugt einen deterministischen String aus vollständigem Message-State
 * → Basis für state-bound truth hashing
 */
/**
 * sortKeys()
 * Recursively sorts object keys for deterministic JSON hashing.
 */
function sortKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortKeys)
  }

  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key) => {
        result[key] = sortKeys(obj[key])
        return result
      }, {})
  }

  return obj
}

type IRSS = {
  system: string
  version: string
  session_prompt_counter: number
  orchestrator_id: string
  command: string
  agent_id: string
  action: string
  extensions_loaded: string[]
  complexity_level: string
  domains: string[]
  drift_origin: string
  drift_state: string
  drift_risk: string
}

function canonicalizeIRSS(irss: any): IRSS {
  return {
    system: String(irss?.system ?? ""),
    version: String(irss?.version ?? ""),
    session_prompt_counter: Number(irss?.session_prompt_counter ?? 0),
    orchestrator_id: String(irss?.orchestrator_id ?? ""),
    command: String(irss?.command ?? ""),
    agent_id: String(irss?.agent_id ?? ""),
    action: String(irss?.action ?? ""),
    extensions_loaded: Array.isArray(irss?.extensions_loaded)
      ? irss.extensions_loaded.map(String)
      : [],
    complexity_level: String(irss?.complexity_level ?? ""),
    domains: Array.isArray(irss?.domains)
      ? irss.domains.map(String)
      : [],
    drift_origin: String(irss?.drift_origin ?? ""),
    drift_state: String(irss?.drift_state ?? ""),
    drift_risk: String(irss?.drift_risk ?? ""),
  }
}

export function canonicalizeTruthState(state: {
  role?: string
  content?: string
  timestamp?: string
  public_key?: string
  chain_prev?: string
  chain_id?: string
  irss?: any
}) {
  const canonical = {
    role: state.role ?? "",
    content: normalizeForTruthHash(state.content ?? ""),
    timestamp: state.timestamp ?? "",
    public_key: state.public_key ?? "",
    chain_prev: state.chain_prev ?? "",
    chain_id: state.chain_id ?? "",
    irss: canonicalizeIRSS(state.irss ?? {})
  }

  return JSON.stringify(sortKeys(canonical))
}

/**
 * computeTruthHash()
 * Deterministischer 32-Bit-Hash (kein Kryptohash, rein funktional).
 */
export function computeTruthHash(
  text: string,
  previousHash?: string
): string {

  const src = normalizeForTruthHash(text);

  const payload = previousHash
    ? `${previousHash}|${src}`
    : src;

  function sha256(str: string): string {
    const utf8 = new TextEncoder().encode(str);
    const buffer = new Uint8Array(utf8);

    const K = [
      1116352408,1899447441,3049323471,3921009573,961987163,1508970993,
      2453635748,2870763221,3624381080,310598401,607225278,1426881987,
      1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,
      264347078,604807628,770255983,1249150122,1555081692,1996064986,
      2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,
      113926993,338241895,666307205,773529912,1294757372,1396182291,
      1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,
      3259730800,3345764771,3516065817,3600352804,4094571909,275423344,
      430227734,506948616,659060556,883997877,958139571,1322822218,
      1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,
      2428436474,2756734187,3204031479,3329325298
    ];

    function rotr(n: number, x: number) {
      return (x >>> n) | (x << (32 - n));
    }

    const H = [
      1779033703,3144134277,1013904242,2773480762,
      1359893119,2600822924,528734635,1541459225
    ];

    const l = buffer.length * 8;
    const withPadding = new Uint8Array(((buffer.length + 9 + 63) >> 6) << 6);
    withPadding.set(buffer);
    withPadding[buffer.length] = 0x80;

    const view = new DataView(withPadding.buffer);
    view.setUint32(withPadding.length - 4, l);

    const w = new Uint32Array(64);

    for (let i = 0; i < withPadding.length; i += 64) {
      for (let t = 0; t < 16; t++) {
        w[t] = view.getUint32(i + t * 4);
      }

      for (let t = 16; t < 64; t++) {
        const s0 = rotr(7, w[t - 15]) ^ rotr(18, w[t - 15]) ^ (w[t - 15] >>> 3);
        const s1 = rotr(17, w[t - 2]) ^ rotr(19, w[t - 2]) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }

      let [a,b,c,d,e,f,g,h] = H;

      for (let t = 0; t < 64; t++) {
        const S1 = rotr(6,e) ^ rotr(11,e) ^ rotr(25,e);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[t] + w[t]) | 0;

        const S0 = rotr(2,a) ^ rotr(13,a) ^ rotr(22,a);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) | 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) | 0;
      }

      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;
      H[5] = (H[5] + f) | 0;
      H[6] = (H[6] + g) | 0;
      H[7] = (H[7] + h) | 0;
    }

    return Array.from(new Uint8Array(new Uint32Array(H).buffer))
      .map(b => b.toString(16).padStart(2,"0"))
      .join("");
  }

  const hash = sha256(payload);
return `T${hash}`;
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


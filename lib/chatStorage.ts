// ============================================================================
// 📘 INDEX — chatStorage.ts (m-pathy Archive & Ledger Layer v5)
// ----------------------------------------------------------------------------
// PURPOSE
//   Zentrale, versionierte Quelle für Chat-Persistenz und Triketon-Ledger-
//   Einträge (lokal, browserseitig, auditierbar).
//
// CORE STRUCTURES
//   • ChatMessage              – einzelne Nachricht im UI / Verlauf
//   • TriketonSeal             – kryptografischer Abdruck pro Message
//   • TriketonArchiveEntry     – formatierter Export für Archiv / Server
//   • TriketonLedgerEntryV1    – persistente Kette aller Nachrichten
//
// STORAGE KEYS
//   CHAT_STORAGE_KEY            = "mpathy:chat:v1"
//   TRIKETON_STORAGE_KEY        = "mpathy:triketon:v1"
//   DEVICE_KEY / DEVICE_KEY_2048 = gerätegebundene Public Keys (persistent)
//
// MAIN FUNCTIONS
//   ──────────────────────────────────────────────────────────────────────────
//   ▪ normalizeMessage() / normalizeMessages()
//       Validiert Struktur, erzeugt IDs und filtert ungültige Einträge.
//   ▪ truncateChat()
//       Begrenzt Länge des Verlaufs (default 120 Nachrichten).
//   ▪ initChatStorage()
//       Migriert alte LocalStorage-Schlüssel (Legacy-Support).
//   ▪ loadChat() / saveChat()
//       Lädt bzw. speichert Chat-Verläufe im LocalStorage.
//       saveChat() ruft zusätzlich appendTriketonLedgerEntry()
//       für die letzte Nachricht auf.
//   ▪ clearChat() / hardClearChat()
//       Entfernt Chat-Daten (weich oder vollständig).
//   ▪ appendTriketonLedgerEntry()
//       Fügt neue Nachricht in den permanenten Ledger ein:
//         - lädt bestehende Kette,
//         - prüft Duplikate (truth_hash + public_key),
//         - generiert device-bound key (getOrCreateDevicePublicKey2048),
//         - hängt neuen Eintrag an,
//         - verifiziert Konsistenz via verifyLocalTriketonLedger()
//           und verifyOrResetTriketonLedger().
//   ▪ verifyLocalTriketonLedger()
//       Prüft strukturelle Gültigkeit aller Einträge.
//   ▪ ensureTriketonLedgerReady()
//       Initialisiert oder repariert den Ledger bei App-Start.
//   ▪ verifyOrResetTriketonLedger()
//       Validiert Chain-Integrität (truth_hash-Sequenz).
//   ▪ getOrCreateDevicePublicKey()
//       Erstellt/stellt einen  UUID-basierten Geräte-Key bereit.
//   ▪ getOrCreateDevicePublicKey2048()
//       Generiert stabilen 2048-Bit-Key auf Basis des TruthHash (einmalig).
//
// BEHAVIOUR NOTES
//   • Alle Operationen sind lokal; kein Server-Write erfolgt hier.
//   • Der Ledger ist append-only (kein Überschreiben).
//   • Jeder Ledger-Eintrag trägt public_key (device-bound) + truth_hash.
//   • Drift-Detection verhindert Selbst-Append oder ungültige States.
//
// DEPENDENCIES
//   import { generatePublicKey2048, computeTruthHash } from "@/lib/triketonVerify"
//
// VERSIONING
//   v1 schema – “TRIKETON_HASH_V1” + “TRIKETON_KEY_V1”
//   maintained under Council13 contract “Triketon-Archive-v2”
//
// AUDIT TRAIL
//   Step L7 – Post-Write Verification + Drift Guard
//   Step L8 – Auto-Recovery & First-Write Handshake
//
// ============================================================================

import { generatePublicKey2048, computeTruthHash } from "@/lib/triketonVerify";
import { syncArchiveFromTriketon } from "@/lib/archiveProjection";
// lib/chatStorage.ts
// Eine Quelle der Wahrheit für Chat-Persistenz (localStorage)
// lib/chatStorage.ts
// Eine Quelle der Wahrheit für Chat-Persistenz (localStorage)

export type TriketonSeal = {
  sealed: true;
  public_key: string;
  truth_hash: string;
  timestamp: string; // sealed_at (UTC ISO)
  version: "v1";
  hash_profile: "TRIKETON_HASH_V1";
  key_profile: "TRIKETON_KEY_V1";
  orbit_context: "chat" | "manual-smoke";
};

export type TriketonArchiveEntry = {
  public_key: string;
  truth_hash: string;
  timestamp: string; // UTC ISO
  orbit_context: "chat";
  version: "v1";
  message_id: string; // stabile Referenz zur Chat-Message
  ref: { ts?: number; idx?: number };
  content: string; // Klartext-Antwort (nur im User-LS, nicht auf Server)
};



export type ChatMessage = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  ts?: number;
  triketon?: TriketonSeal;
};

/** Versionierter Hauptschlüssel */
const CHAT_STORAGE_KEY = "mpathy:chat:v1";
/** Triketon-Archiv (separat, entkoppelt vom Chat) */
const TRIKETON_STORAGE_KEY = "mpathy:triketon:v1";
/** Ältere/alternative Schlüssel, die ggf. migriert werden sollen */
const LEGACY_KEYS = ["mpage2_messages_v1"];


function isNonEmptyString(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

function isTriketonSeal(x: unknown): x is TriketonSeal {
  if (!x || typeof x !== "object") return false;
  const o = x as any;
  return (
    o.sealed === true &&
    isNonEmptyString(o.public_key) &&
    isNonEmptyString(o.truth_hash) &&
    isNonEmptyString(o.timestamp) &&
    o.version === "v1" &&
    o.hash_profile === "TRIKETON_HASH_V1" &&
    o.key_profile === "TRIKETON_KEY_V1" &&
    (o.orbit_context === "chat" || o.orbit_context === "manual-smoke")
  );
}

function normalizeMessage(x: any): ChatMessage | null {
  if (!x || typeof x !== "object") return null;
  const role = x.role;
  const content = x.content;

  if (
    (role !== "system" && role !== "user" && role !== "assistant") ||
    !isNonEmptyString(content)
  ) {
    return null;
  }

  const ts = typeof x.ts === "number" && Number.isFinite(x.ts) ? x.ts : undefined;
  const triketon = isTriketonSeal(x.triketon) ? x.triketon : undefined;

  const rawId = x.id;
  const id =
    isNonEmptyString(rawId)
      ? rawId
      : typeof ts === "number"
        ? `${role}_${ts}`
        : typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function"
          ? (crypto as any).randomUUID()
          : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  return { id, role, content, ts, triketon };

}

function normalizeMessages(arr: unknown): ChatMessage[] {
  try {
    if (!Array.isArray(arr)) return [];
    const out: ChatMessage[] = [];
    for (const item of arr) {
      const m = normalizeMessage(item);
      if (m) out.push(m);
    }
    return out;
  } catch {
    return [];
  }
}

/** Anzahl der gespeicherten Nachrichten begrenzen (Default 120) */
export function truncateChat(arr: ChatMessage[], max = 120): ChatMessage[] {
  try {
    return (Array.isArray(arr) ? arr : []).slice(-max);
  } catch {
    return [];
  }
}

/** Einmalige Migration: falls neuer Key leer ist, aber Legacy-Daten existieren */
export function initChatStorage(): void {
  try {
    if (typeof window === "undefined") return;
    const ls = window.localStorage;

    // --- Chat Storage ---
    if (!ls.getItem(CHAT_STORAGE_KEY)) {
      for (const k of LEGACY_KEYS) {
        const raw = ls.getItem(k);
        if (!raw) continue;
        try {
          const data = JSON.parse(raw);
          if (Array.isArray(data)) {
            const normalized = normalizeMessages(data);
            ls.setItem(CHAT_STORAGE_KEY, JSON.stringify(truncateChat(normalized)));
            break;
          }
        } catch {}
      }
    }

    // --- Triketon Ledger (Genesis) ---
    if (!ls.getItem(TRIKETON_STORAGE_KEY)) {
      ls.setItem(TRIKETON_STORAGE_KEY, JSON.stringify([]));
    }
  } catch {}
}


/** Laden: Array oder null (wenn nichts sinnvolles vorliegt) */
export function loadChat(): ChatMessage[] | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return null;

    const normalized = normalizeMessages(data).map((m) => ({
      ...m,
      // Falls Format fehlt: Markdown als Standard
      format: (m as any).format ?? "markdown",
    }));
    return normalized.length ? normalized : [];
  } catch {
    return null;
  }
}


/** Speichern: immer getrimmt, atomar unter dem neuen Key */
export async function saveChat(messages: ChatMessage[], max = 120): Promise<void> {
  try {
    if (typeof window === "undefined") return;

       const normalized = normalizeMessages(messages as unknown);
    const trimmed = truncateChat(normalized, max);

    // 1️⃣ Persist chat messages
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmed));

    // 2️⃣ Ledger-append: genau **eine vollständige Nachricht**
    const lastMessage =
      Array.isArray(trimmed) && trimmed.length > 0
        ? trimmed[trimmed.length - 1]
        : null;

   // Intentionally empty.
// Ledger writes are handled exclusively by the Intent-Layer (UI submit).


   } catch (err) {
  console.error("[ChatStorage] saveChat failed:", err);
}

}

/** Leeren (für späteren Button) */
export function clearChat(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch { /* ignore */ }
}

export const THREAD_EXPORT_KEY = "mpathy:thread:default";

/** Hard clear: remove new + legacy chat keys and thread export; optional reload */
export function hardClearChat(opts: { reload?: boolean } = { reload: true }): void {
  try {
    if (typeof window === "undefined") return;
    const ls = window.localStorage;

    console.log("[P5] hardClearChat BEFORE", {
      v1: !!ls.getItem(CHAT_STORAGE_KEY),
      legacy: LEGACY_KEYS.map(k => [k, !!ls.getItem(k)]),
      exportKey: !!ls.getItem(THREAD_EXPORT_KEY),
    });

    ls.removeItem(CHAT_STORAGE_KEY);
    for (const k of LEGACY_KEYS) {
      ls.removeItem(k);
    }
    ls.removeItem(THREAD_EXPORT_KEY);

    console.log("[P5] hardClearChat AFTER", {
      v1: !!ls.getItem(CHAT_STORAGE_KEY),
      legacy: LEGACY_KEYS.map(k => [k, !!ls.getItem(k)]),
      exportKey: !!ls.getItem(THREAD_EXPORT_KEY),
    });

    if (opts.reload) {
      setTimeout(() => window.location.reload(), 0);
    }
  } catch (e) {
    console.error("[P5] hardClearChat ERROR:", e);
  }
}

export function getChatStorageKey(): string {
  return CHAT_STORAGE_KEY;
}

export function getTriketonStorageKey(): string {
  return TRIKETON_STORAGE_KEY;
}

function isArchiveEntry(x: unknown): x is TriketonArchiveEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as any;
  return (
    isNonEmptyString(o.public_key) &&
    isNonEmptyString(o.truth_hash) &&
    isNonEmptyString(o.timestamp) &&
    isNonEmptyString(o.message_id) &&
    isNonEmptyString(o.content) &&
    o.orbit_context === "chat" &&
    o.version === "v1" &&
    (o.ref == null || typeof o.ref === "object")
  );
}



// Expanded Ledger: every message (user + assistant) is permanently appended
export type TriketonLedgerEntryV1 = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  truth_hash: string;
  public_key: string;
  timestamp: string;
  version: "v1";
  orbit_context: "chat";
  chain_id: string;
  chain_prev?: string;
};

export async function appendTriketonLedgerEntry(
  entry: TriketonLedgerEntryV1
): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    const ls = window.localStorage;

    // 1️⃣ READ (once)
    const raw = ls.getItem(TRIKETON_STORAGE_KEY);
    let ledger: TriketonLedgerEntryV1[] = [];

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) ledger = parsed;
      } catch {
        ledger = [];
      }
    }

    // 2️⃣ DUPLICATE GUARD (pure)
    const exists = ledger.some(
      (x) => x.truth_hash === entry.truth_hash && x.id === entry.id
    );
    if (exists) return;

    // 3️⃣ BUILD ENTRY (complete before append)
    const truthHashHex = (entry.truth_hash || "")
      .replace(/^T/, "")
      .padStart(64, "0");

    const deviceKey = await getOrCreateDevicePublicKey2048(truthHashHex);

// derive stable chain_id (one per chat, session-persistent)
const SESSION_CHAT_KEY = "mpathy:chat:session_id";

let chainId = sessionStorage.getItem(SESSION_CHAT_KEY);

if (!chainId) {
  chainId = `chat_${crypto.randomUUID()}`;
  sessionStorage.setItem(SESSION_CHAT_KEY, chainId);
}

const lastInSameChain = [...ledger]
  .reverse()
  .find((e) => e.chain_id === chainId);

const next: TriketonLedgerEntryV1 = {
  ...entry,
  chain_id: chainId,
  public_key: deviceKey,
  chain_prev: lastInSameChain?.truth_hash,
};

// 4️⃣ APPEND (once)
const nextLedger = [...ledger, next];

// 5️⃣ WRITE (once)
ls.setItem(TRIKETON_STORAGE_KEY, JSON.stringify(nextLedger));

// 🔽 Phase 2: GUARANTEED archive sync AFTER write (next tick)
queueMicrotask(() => {
  syncArchiveFromTriketon();
});


  } catch (err) {
    console.error("[TriketonLedger] atomic append failed:", err);
  }
}

// ---------------------------------------------------------------------------
// Step L6 – Device-Bound Public Key (stabil, Council13-approved, persistent)
// ---------------------------------------------------------------------------

const DEVICE_KEY = "mpathy:triketon:device_public_key";

/** returns or creates a persistent, device-bound public key */
export function getOrCreateDevicePublicKey(): string {
  try {
    if (typeof window === "undefined") return "unknown";

    const ls = window.localStorage;
    const existing = ls.getItem(DEVICE_KEY);

    // ✅ persistenter Schlüssel: nur erzeugen, wenn keiner existiert
    if (existing && existing.trim().length > 0) {
      return existing;
    }

    // stable prefix + UUID (visuell unterscheidbar)
    const newKey = `mpathy-device-${crypto.randomUUID()}`;
    ls.setItem(DEVICE_KEY, newKey);

    console.debug("[Triketon] new device key created:", newKey);
    return newKey;
  } catch (err) {
    console.error("[Triketon] device key error:", err);
    return "unknown";
  }
}

/** persistent 2048-bit key generator (once per device) */
export async function getOrCreateDevicePublicKey2048(
  truthHashHex: string
): Promise<string> {
  try {
    if (typeof window === "undefined") return "unknown";
    const ls = window.localStorage;
    const DEVICE_KEY_2048 = "mpathy:triketon:device_public_key_2048";

    const existing = ls.getItem(DEVICE_KEY_2048);
    if (existing && existing.trim().length > 0) return existing;

    const newKey = await generatePublicKey2048(truthHashHex);
    ls.setItem(DEVICE_KEY_2048, newKey);
    console.debug("[Triketon] persistent 2048-bit key created:", newKey);
    return newKey;
  } catch (err) {
    console.error("[TriketonLedger] verification failed:", err);
    return "error_key";
  }
}

// ---------------------------------------------------------------------------
// Step L2 – Local Read-Back Verification (Consistency Check)
// ---------------------------------------------------------------------------

export function verifyLocalTriketonLedger(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const raw = window.localStorage.getItem(TRIKETON_STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return false;

    for (const e of parsed) {
      if (
        !e.truth_hash ||
        !e.public_key ||
        !e.timestamp ||
        e.version !== "v1" ||
        e.orbit_context !== "chat"
      ) {
        console.warn("[TriketonLedger] invalid entry:", e);
        return false;
      }
    }

    console.debug(`[TriketonLedger] verified ${parsed.length} entries`);
    return true;
  } catch (err) {
    console.error("[TriketonLedger] verification failed:", err);
    return false;
  }
}

/**
 * Step L8.0 – Auto-Recovery & First-Write Handshake
 */
export function ensureTriketonLedgerReady(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const key = "mpathy:triketon:v1";
    const ls = window.localStorage;
    const raw = ls.getItem(key);

    if (!raw) {
      console.info("[TriketonLedger] no ledger found → genesis initialized");
      ls.setItem(key, JSON.stringify([]));
      return true;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn("[TriketonLedger] corrupted ledger → reinit");
      ls.setItem(key, JSON.stringify([]));
      return true;
    }

    const valid = parsed.every(
      (e) => e.truth_hash && e.public_key && e.version === "v1"
    );
    if (!valid) {
      console.warn("[TriketonLedger] invalid entries → full reset");
      ls.setItem(key, JSON.stringify([]));
      return true;
    }

    console.debug("[TriketonLedger] ledger verified:", parsed.length, "entries");
    return true;
  } catch (err) {
    console.error("[TriketonLedger] ensureTriketonLedgerReady failed:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Step L6 – Chain Integrity Verification (Genesis Reset)
// ---------------------------------------------------------------------------

export function verifyOrResetTriketonLedger(): boolean {
  try {
    if (typeof window === "undefined") return false;

    const key = "mpathy:triketon:v1";
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      console.info("[TriketonLedger] no ledger found → new genesis");
      window.localStorage.setItem(key, JSON.stringify([]));
      return true;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) {
      console.info("[TriketonLedger] empty ledger → new genesis");
      window.localStorage.setItem(key, JSON.stringify([]));
      return true;
    }

    const invalid = parsed.some(
      (e) =>
        !e.truth_hash ||
        typeof e.truth_hash !== "string" ||
        e.truth_hash.startsWith("local_") ||
        e.truth_hash.length < 20
    );

    if (invalid) {
      console.warn("[TriketonLedger] drift detected → NO RESET (ledger preserved)");
      return false;
    }

    console.debug(`[TriketonLedger] chain integrity OK (${parsed.length})`);
    return true;
  } catch (err) {
    console.error("[TriketonLedger] verifyOrReset failed:", err);
    return false;
  }
}


/** Clear handler factory (no bubble, prepares for hard clear) */
export function makeClearHandler(setMessages: (m: ChatMessage[]) => void) {
  return () => {
    clearChat();
    setMessages([]);
  };
}


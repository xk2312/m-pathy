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
  ref: { ts?: number; idx?: number };
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
    if (ls.getItem(CHAT_STORAGE_KEY)) return; // schon da

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
      } catch { /* ignore parse error */ }
    }
  } catch { /* ignore */ }
}

/** Laden: Array oder null (wenn nichts sinnvolles vorliegt) */
export function loadChat(): ChatMessage[] | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return null;

    const normalized = normalizeMessages(data);
    return normalized.length ? normalized : [];
  } catch {
    return null;
  }
}

/** Speichern: immer getrimmt, atomar unter dem neuen Key */
export function saveChat(messages: ChatMessage[], max = 120): void {
  try {
    if (typeof window === "undefined") return;
    const normalized = normalizeMessages(messages as unknown);
    window.localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(truncateChat(normalized, max))
    );
  } catch { /* ignore quota/availability */ }
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
    o.orbit_context === "chat" &&
    o.version === "v1" &&
    (o.ref == null || typeof o.ref === "object")
  );
}

export function appendTriketonArchiveEntry(entry: TriketonArchiveEntry, max = 500): void {
  try {
    if (typeof window === "undefined") return;
    const ls = window.localStorage;

    const raw = ls.getItem(TRIKETON_STORAGE_KEY);
    let arr: any[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) arr = parsed;
      } catch {}
    }

    const next = [...arr, entry].filter(isArchiveEntry).slice(-max);
    ls.setItem(TRIKETON_STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

/** Clear handler factory (no bubble, prepares for hard clear) */
export function makeClearHandler(setMessages: (m: ChatMessage[]) => void) {
  return () => {
    clearChat();
    setMessages([]);
  };
}

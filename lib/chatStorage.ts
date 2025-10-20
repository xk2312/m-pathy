// lib/chatStorage.ts
// Eine Quelle der Wahrheit für Chat-Persistenz (localStorage)

export type ChatMessage = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  ts?: number;
};

/** Versionierter Hauptschlüssel */
const CHAT_STORAGE_KEY = "mpathy:chat:v1";
/** Ältere/alternative Schlüssel, die ggf. migriert werden sollen */
const LEGACY_KEYS = ["mpage2_messages_v1"];

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
          ls.setItem(CHAT_STORAGE_KEY, JSON.stringify(truncateChat(data)));
          // Legacy optional aufräumen:
          // ls.removeItem(k);
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
    return Array.isArray(data) ? (data as ChatMessage[]) : null;
  } catch {
    return null;
  }
}

/** Speichern: immer getrimmt, atomar unter dem neuen Key */
export function saveChat(messages: ChatMessage[], max = 120): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(truncateChat(messages, max))
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

/** Key für Export/Debug */
export function getChatStorageKey(): string {
  return CHAT_STORAGE_KEY;
}

/** Kleine Helfer, um später UI anzudocken (ohne React-Abhängigkeit) */
export function makeClearHandler(setMessages: (m: ChatMessage[]) => void) {
  return () => {
    clearChat();
    setMessages([]);
  };
}

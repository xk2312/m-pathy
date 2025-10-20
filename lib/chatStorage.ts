// lib/chatStorage.ts
// Minimal, robust, modular. Eine Quelle der Wahrheit für Chat-Persistenz.

export type ChatMessage = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  ts?: number; // optional timestamp
};

const CHAT_STORAGE_KEY = "mpathy:chat:v1";

// Laden: gibt Array zurück oder null (falls nichts vorhanden/parsebar)
export function loadChat(): ChatMessage[] | null {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(CHAT_STORAGE_KEY) : null;
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data as ChatMessage[] : null;
  } catch {
    return null;
  }
}

// Speichern: idempotent, überschreibt Schlüssel atomar
export function saveChat(messages: ChatMessage[]): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    /* ignore quota/availability errors */
  }
}

// Leeren: vorbereitet für zukünftigen Button in der Säule
export function clearChat(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

// Zugriff auf Key (z. B. für Export/Debug)
export function getChatStorageKey(): string {
  return CHAT_STORAGE_KEY;
}

// /lib/chatPersistence.ts
// Keine "use client" nötig; wir guard-en localStorage sauber ab.

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
  format?: "plain" | "markdown" | "html";
};

// stabiler Key + alte Keys für Migration
const STORAGE_KEYS = ["m_chat_messages_v1", "m.chat.v1", "messages"];

/** localStorage-Zugriff sicher kapseln */
function safeStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Message-Gültigkeit prüfen */
function isValid(x: any): x is ChatMessage {
  return (
    x &&
    typeof x === "object" &&
    ["system", "user", "assistant"].includes(x.role) &&
    typeof x.content === "string"
  );
}

/** Kürzt History auf sinnvolle Länge (Anzahl + Zeichenlimit) */
export function truncateMessages(
  messages: ChatMessage[],
  maxMsgs = 80,
  maxChars = 8000
): ChatMessage[] {
  if (!Array.isArray(messages)) return [];
  const clipped = messages.slice(-maxMsgs);
  let total = clipped.reduce((sum, m) => sum + (m.content?.length ?? 0), 0);
  while (total > maxChars && clipped.length > 1) {
    const removed = clipped.shift()!;
    total -= removed.content?.length ?? 0;
  }
  return clipped;
}

/** Speichert Messages defensiv in localStorage */
export function saveMessages(messages: ChatMessage[]): void {
  const store = safeStorage();
  if (!store) return;
  try {
    const safe = Array.isArray(messages)
      ? messages
          .filter(isValid)
          .map((m) => ({
            role: m.role,
            content: m.content ?? "",
            format:
              m.format === "markdown" || m.format === "plain" || m.format === "html"
                ? m.format
                : "markdown",
          }))
      : [];
    store.setItem(STORAGE_KEYS[0], JSON.stringify(safe));
  } catch {
    // niemals crashen
  }
}

/** Lädt Messages defensiv aus localStorage */
export function loadMessages(): ChatMessage[] {
  const store = safeStorage();
  if (!store) return [];
  try {
    for (const key of STORAGE_KEYS) {
      const raw = store.getItem(key);
      if (!raw) continue;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return arr
          .filter(isValid)
          .map((m) => ({
            role: m.role,
            content: m.content ?? "",
            format:
              m.format === "markdown" || m.format === "plain" || m.format === "html"
                ? m.format
                : "markdown",
          })) as ChatMessage[];
      }
    }
  } catch {
    // still: niemals crashen
  }
  return [];
}

/** Optionaler Reset – löscht Chat-History */
export function clearMessages(): void {
  const store = safeStorage();
  try {
    STORAGE_KEYS.forEach((key) => store?.removeItem(key));
  } catch {}
}

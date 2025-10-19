// app/lib/chatPersistence.ts  (oder lib/chatPersistence.ts)
// Keine "use client" nötig; defensiv gegen SSR/localStorage-Fehler.

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
  format?: "markdown" | "text";
};

const STORAGE_KEY = "m_chat_messages_v1";

/** sichere Referenz auf localStorage, auch SSR-kompatibel */
function safeStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

/** prüft minimale Gültigkeit einer gespeicherten Message */
function isValidMessage(x: any): x is ChatMessage {
  return (
    x &&
    typeof x === "object" &&
    ["system", "user", "assistant"].includes(x.role) &&
    typeof x.content === "string"
  );
}

/**
 * kürzt History und Textlängen, damit sie leichtgewichtig bleiben
 */
export function truncateMessages<T extends { content?: string }>(
  messages: T[],
  maxMsgs = 80,
  maxChars = 6000,
  maxPerMsg = 4000
): T[] {
  if (!Array.isArray(messages)) return [];

  // pro-Message-Limit
  const clipped = messages.map((m) => {
    if (!m || typeof m !== "object") return m;
    const c = String(m.content ?? "");
    return c.length > maxPerMsg
      ? ({ ...m, content: c.slice(-maxPerMsg) } as T)
      : m;
  });

  // Anzahl begrenzen (letzte N behalten)
  let cut = clipped.slice(-maxMsgs);

  // Gesamtzeichen approximativ begrenzen
  let total = cut.reduce((n, m: any) => n + String(m?.content ?? "").length, 0);
  while (total > maxChars && cut.length > 1) {
    const first = cut.shift() as any;
    total -= String(first?.content ?? "").length;
  }

  return cut;
}

/** schreibt Messages sicher in localStorage */
export function saveMessages(messages: readonly ChatMessage[]): void {
  const storage = safeStorage();
  if (!storage) return;

  try {
    const safe = Array.isArray(messages)
      ? messages
          .filter(isValidMessage)
          .map((m) => ({
            role: m.role,
            content: String(m.content ?? ""),
            format: m.format,
          }))
      : [];
    storage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // niemals crashen
  }
}

/** liest Messages aus localStorage */
export function loadMessages(): ChatMessage[] {
  const storage = safeStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidMessage);
  } catch {
    return [];
  }
}

/** löscht alle gespeicherten Messages (optional Debug) */
export function clearMessages(): void {
  const storage = safeStorage();
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {}
}

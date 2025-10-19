// app/lib/chatPersistence.ts  (oder lib/chatPersistence.ts)

// Keine "use client" nötig; wir guard-en localStorage sauber ab.
const STORAGE_KEY = "m_chat_messages_v1";

// Minimal-Form, die wir speichern/lesen (bewusst ohne hartes App-Interface)
type PersistedMessage = {
  role: "system" | "user" | "assistant";
  content: string;
  format?: string; // z. B. "markdown"
};

// sehr defensiv: läuft auch serverseitig ohne window
function safeGetStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function isValidMessage(x: any): x is PersistedMessage {
  return (
    x &&
    typeof x === "object" &&
    (x.role === "system" || x.role === "user" || x.role === "assistant") &&
    typeof x.content === "string"
  );
}

/**
 * Schneidet die History auf sinnvolle Größe.
 * - maxMsgs: maximale Anzahl Messages
 * - maxChars: harte Obergrenze für die gesamte Zeichenanzahl (approx)
 * - maxPerMsg: pro-Message-Limit (hält Ausreißer klein)
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
    if (c.length > maxPerMsg) {
      return { ...m, content: c.slice(-maxPerMsg) } as T;
    }
    return m;
  });

  // Anzahl begrenzen (letzte N behalten)
  let cut = clipped.slice(-maxMsgs);

  // Gesamtzeichen approximativ begrenzen (von vorne wegnehmen)
  let total = cut.reduce((n, m: any) => n + String(m?.content ?? "").length, 0);
  while (total > maxChars && cut.length > 1) {
    const first = cut.shift() as any;
    total -= String(first?.content ?? "").length;
  }

  return cut;
}

/** Speichert Messages defensiv in localStorage. */
export function saveMessages(messages: any[]): void {
  const storage = safeGetStorage();
  if (!storage) return;
  try {
    // nur serialisierbare, valide Messages speichern
    const safe = Array.isArray(messages)
      ? messages
          .filter(isValidMessage)
          .map((m) => ({ role: m.role, content: String(m.content ?? ""), format: m.format }))
      : [];
    storage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // still: niemals die App crashen lassen
  }
}

/** Lädt Messages aus localStorage (oder [] bei Fehler). */
export function loadMessages(): any[] {
  const storage = safeGetStorage();
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

/** Optional: zum Debuggen/Zurücksetzen */
export function clearMessages(): void {
  const storage = safeGetStorage();
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {}
}

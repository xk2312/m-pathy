/*** =======================================================================
 *  INVENTUS INDEX — lib/chatPersistence.ts
 *  Lokale Chat-History · Browser-Persistenz (ohne Ledger-Bezug)
 * =======================================================================
 *
 *  [ANCHOR:0] TYPDEF & STORAGE-KEYS
 *    – ChatMessage: { role: "system" | "user" | "assistant"; content; format? }.
 *    – STORAGE_KEYS: ["m_chat_messages_v1", "m.chat.v1", "messages"] für
 *      aktuellen und alte Persistenz-Keys (Migration).
 *
 *  [ANCHOR:1] safeStorage()
 *    – Kapselt window.localStorage defensiv.
 *    – Gibt null zurück bei SSR, fehlendem window oder Zugrifffehlern.
 *
 *  [ANCHOR:2] isValid(x)
 *    – Validiert, dass ein Eintrag eine gültige ChatMessage ist.
 *    – Schützt vor kaputten/alten Strukturen in localStorage.
 *
 *  [ANCHOR:3] truncateMessages(messages, maxMsgs, maxChars)
 *    – Kürzt History auf maximal maxMsgs (Default: 80) und maxChars
 *      (Default: 8000) Gesamtzeichenzahl.
 *    – Entfernt vordere Messages, um die letzten Konversationsteile zu
 *      behalten und überlange Prompts zu vermeiden.
 *
 *  [ANCHOR:4] saveMessages(messages)
 *    – Schreibt nur validierte Messages in localStorage (STORAGE_KEYS[0]).
 *    – Normalisiert format auf "markdown" | "plain" | "html" (Default:
 *      "markdown").
 *    – Fehler werden geschluckt, um niemals die App zu crashen.
 *
 *  [ANCHOR:5] loadMessages()
 *    – Liest Chat-History aus localStorage.
 *    – Versucht nacheinander alle STORAGE_KEYS (Migration von Altformaten).
 *    – Filtert mit isValid() und normalisiert format wie beim Speichern.
 *    – Gibt bei Fehlern oder leerem Storage ein leeres Array zurück.
 *
 *  [ANCHOR:6] clearMessages()
 *    – Löscht Chat-History für alle bekannten STORAGE_KEYS.
 *    – Fehler werden ignoriert (Fail-Safe).
 *
 *  TOKEN-RELEVANZ (SUMMARY)
 *    – Dieses Modul verwaltet ausschließlich die lokale Chat-History im
 *      Browser und hat keinen direkten Bezug zum Token-Ledger, FreeGate
 *      oder Stripe-Webhook-Flow.
 *    – Indirekt beeinflusst es nur die Länge der Prompts (Kontextmenge),
 *      nicht jedoch Salden oder Berechtigungen im Tokensystem.
 *
 *  INVENTUS NOTE
 *    – Reine Komfort- & UX-Schicht: wichtig für Session-Gefühl, aber
 *      neutral in Bezug auf Kauf, Guthaben und Ledger; für Token-Bugs
 *      (z. B. „… lädt“ im AccountPanel) ist dieses File nicht ursächlich.
 * ======================================================================= */


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

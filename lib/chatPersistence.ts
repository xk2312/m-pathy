/***
 * =====================================================================
 *  M - CHAT PERSISTENCE (Local UI History · Non-Truth Layer)
 * =====================================================================
 *
 *  FILE
 *  - lib/chatPersistence.ts
 *
 *  ROLE IM SYSTEM
 *  - Verwaltet **ausschließlich** die lokale Chat-History im Browser
 *  - Dient UX, Session-Gefühl und Prompt-Kontext
 *  - ❌ KEIN Bestandteil der Wahrheits- oder Verifikationsschicht
 *
 *  WICHTIGER KONTEXT (aus Übergangsprotokoll)
 *  - chatPersistence ist **nicht kaputt**
 *  - trägt aber **indirekt** zu den aktuellen Problemen bei,
 *    weil Persistenzzeitpunkte hier genutzt werden,
 *    die später für Triketon & Archive fälschlich als „final“ interpretiert werden
 *
 * =====================================================================
 *
 *  INDEX (Sprunganker)
 *  ---------------------------------------------------------------------
 *  [ANCHOR:OVERVIEW]          – Rolle im Gesamtsystem
 *  [ANCHOR:TYPES]             – ChatMessage Typ
 *  [ANCHOR:STORAGE-KEYS]      – lokale Storage Keys + Migration
 *  [ANCHOR:SAFE-STORAGE]      – SSR-sichere LocalStorage-Kapsel
 *  [ANCHOR:VALIDATION]        – Message-Gültigkeitsprüfung
 *  [ANCHOR:TRUNCATION]        – truncateMessages()
 *  [ANCHOR:SAVE]              – saveMessages()
 *  [ANCHOR:LOAD]              – loadMessages()
 *  [ANCHOR:CLEAR]             – clearMessages()
 *
 *  PROBLEM-RELEVANCE MAP
 *  ---------------------------------------------------------------------
 *  🔴 Indirekter Einfluss:
 *     - chunkweises Persistieren während Streaming
 *     - fehlende Unterscheidung zwischen „Zwischenzustand“ und „final“
 *
 *  ❌ Keine Ursache:
 *     - kein Ledger
 *     - kein Triketon
 *     - kein Archive Pairing
 *
 * =====================================================================
 */


/* =====================================================================
 * [ANCHOR:OVERVIEW]
 * =====================================================================
 *
 * Dieses Modul speichert den Chat-Zustand lokal.
 *
 * Es hat bewusst:
 *  - KEINE Kenntnis von chain_id
 *  - KEINE Kenntnis von truth_hash
 *  - KEINE Kenntnis von Triketon
 *
 * Es ist damit:
 *  - robust
 *  - simpel
 *  - aber zeitlich blind
 *
 * 🔴 Diese zeitliche Blindheit ist relevant für das aktuelle Problem.
 */


/* =====================================================================
 * [ANCHOR:TYPES]
 * =====================================================================
 *
 * ChatMessage
 *  - role: "system" | "user" | "assistant"
 *  - content: string
 *  - format?: "plain" | "markdown" | "html"
 *
 * PROBLEM-RELEVANZ:
 * - Keine IDs
 * - Keine timestamps
 * - Keine Unterscheidung „partial vs final“
 */


/* =====================================================================
 * [ANCHOR:STORAGE-KEYS]
 * =====================================================================
 *
 * STORAGE_KEYS:
 *  - "m_chat_messages_v1"   (aktuell)
 *  - "m.chat.v1"            (legacy)
 *  - "messages"             (legacy)
 *
 * PROBLEM-RELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:SAFE-STORAGE]
 * =====================================================================
 *
 * safeStorage()
 *  - kapselt window.localStorage
 *  - verhindert SSR-Crashes
 *
 * PROBLEM-RELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:VALIDATION]
 * =====================================================================
 *
 * isValid(x)
 *  - prüft Struktur der ChatMessage
 *
 * PROBLEM-RELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:TRUNCATION]
 * =====================================================================
 *
 * truncateMessages(messages, maxMsgs, maxChars)
 *
 * Funktion:
 *  - kappt Konversationshistorie
 *  - schützt vor zu großen Prompts
 *
 * 🔴 PROBLEM-RELEVANZ (INDIREKT):
 *  - kann Zwischenstände entfernen
 *  - kann Kontext kürzen, bevor Assistant „final“ markiert wurde
 *
 * (nicht der Bug, aber Verstärker)
 */


/* =====================================================================
 * [ANCHOR:SAVE]
 * =====================================================================
 *
 * saveMessages(messages)
 *
 * Funktion:
 *  - schreibt JEDE Änderung sofort nach localStorage
 *  - kennt keinen „final“-Zustand
 *
 * 🔴 HOCH RELEVANT (INDIREKT):
 *  - wird während Streaming aufgerufen
 *  - persistiert leere Assistant-Bubbles + Chunk-Zwischenstände
 *  - nachgelagerte Systeme können diese Persistenz fälschlich
 *    als abgeschlossene Wahrheit interpretieren
 *
 * WICHTIG:
 *  - korrekt implementiert
 *  - aber semantisch zu früh genutzt
 */


/* =====================================================================
 * [ANCHOR:LOAD]
 * =====================================================================
 *
 * loadMessages()
 *
 * Funktion:
 *  - lädt Chat-History
 *  - migriert Legacy-Keys
 *
 * PROBLEM-RELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:CLEAR]
 * =====================================================================
 *
 * clearMessages()
 *
 * Funktion:
 *  - löscht lokale Chat-History
 *
 * PROBLEM-RELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * SYSTEMISCHE ZUSAMMENFASSUNG
 * =====================================================================
 *
 * chatPersistence.ts ist:
 *  - stabil
 *  - korrekt
 *  - bewusst simpel
 *
 * 🔴 Es wird problematisch durch seinen KONTEXT:
 *  - saveMessages() wird während Streaming benutzt
 *  - es gibt kein Finalisierungs-Signal
 *
 * DAS HEISST:
 *  - Dieses File ist NICHT zu patchen
 *  - Aber seine Nutzung MUSS korrekt eingerahmt werden
 *
 * RELEVANTER FIX-ORT:
 *  - app/page2/page.tsx
 *    [ANCHOR:SEND-PIPELINE] → definierter FINAL-Schritt
 *
 * =====================================================================
 */


export type ChatMessage = {
  id?: string;
  role: "system" | "user" | "assistant";
  content: string;
  format?: "markdown" | "plain" | "html";
  irss?: any;
  meta?: Record<string, unknown>;
  ts?: number;
  triketon?: any; // 👈 DAS HINZUFÜGEN
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
  if (!store) {
    console.log("[PERSIST][SKIP] no storage available");
    return;
  }

  try {
    console.log("[PERSIST][INPUT]", {
      count: Array.isArray(messages) ? messages.length : 0,
      preview: Array.isArray(messages)
        ? messages.slice(-2)
        : null,
    });

    const safe = Array.isArray(messages)
      ? messages
          .filter((m) => {
            const valid = isValid(m);
            if (!valid) {
              console.warn("[PERSIST][INVALID MESSAGE]", m);
            }
            return valid;
          })
          .map((m, i) => {
            const mapped = {
              role: m.role,
              content: m.content ?? "",
              irss: (m as any).irss ?? null,
              format:
                m.format === "markdown" ||
                m.format === "plain" ||
                m.format === "html"
                  ? m.format
                  : "markdown",
            };

            console.log("[PERSIST][MAP]", {
              index: i,
              hasIrssBefore: !!(m as any).irss,
              hasIrssAfter: !!mapped.irss,
              irssPreview: mapped.irss
                ? JSON.stringify(mapped.irss).slice(0, 120)
                : null,
            });

            return mapped;
          })
      : [];

    console.log("[PERSIST][FINAL PAYLOAD]", {
      count: safe.length,
      preview: safe.slice(-2),
    });

    store.setItem(STORAGE_KEYS[0], JSON.stringify(safe));

    console.log("[PERSIST][WRITE DONE]");
  } catch (err) {
    console.error("[PERSIST][ERROR]", err);
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

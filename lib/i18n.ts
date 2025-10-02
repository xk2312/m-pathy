// lib/i18n.ts
// Minimal, SSR-safe i18n helper with browser + localStorage detection.

type Dict = Record<string, string>;

/** English dictionary (source of truth for keys) */
const en = {
  // Input / messaging
  writeMessage: "Write a message…",
  send: "Send",

  // Input helpers
  tools: "Tools",
  newline: "New line",
  comingUpload: "Upload",
  comingVoice: "Voice",
  comingFunctions: "Options",

  // Overlay header / buttons (mobile)
  mobileNav: "Mobile navigation",
  close: "Close",

  // Sidebar / Column 
  columnTitle: "Column",
  sectionControl: "Controls",
  onboarding: "ONBOARDING",
  mDefault: "M · Default",
  selectMode: "Choose mode",
  council13: "COUNCIL13",
  selectAI: "Choose AI",
  modules: "Modules",
  coming: "Coming",

  // Sidebar additions (experts & CTA)
  selectExpert: "Choose expert",
  statusExpert: "Expert:",
  clearChat: "Clear chat",
  startBuilding: "Start building",
  startBuildingMsg:
    "What can you build here, and how can I help? I'll answer briefly and with empathy.",

  // Actions / footer
  export: "Export",
  levels: "Levels",
  levelsComing: "Levels coming soon",
  threadExported: "Thread exported.",

  // Status bar
  statusMode: "Mode:",
  statusAgent: "Agent:",

  // Backward-compat alias (if some code still uses statusAI)
  statusAI: "Agent:",

  // ARIA / A11y
  conversationAria: "Chat log",
  assistantSays: "Assistant message",
  youSaid: "Your message",
  columnAria: "Column — Controls & Selection",
  mobileOverlayLabel: "Mobile column overlay",
} as const;

/** German dictionary */
const de: Dict = {
  // Input / messaging
  writeMessage: "Nachricht schreiben…",
  send: "Senden",

  // Eingabe-Hilfen
  tools: "Werkzeuge",
  newline: "Neue Zeile",
  comingUpload: "Upload",
  comingVoice: "Sprache",
  comingFunctions: "Optionen",

  // Overlay header / buttons (mobile)
  mobileNav: "Mobile Navigation",
  close: "Schließen",

  // Sidebar / Column
  columnTitle: "Säule",
  sectionControl: "Steuerung",
  onboarding: "ONBOARDING",
  mDefault: "M · Default",
  selectMode: "Modus wählen",
  council13: "COUNCIL13",
  selectAI: "KI wählen",
  modules: "Module",
  coming: "Coming",

  // Ergänzungen (Experten & CTA)
  selectExpert: "Experte wählen",
  statusExpert: "Experte:",
  clearChat: "Chat leeren",
  startBuilding: "Jetzt bauen",
  startBuildingMsg:
    "Was kannst du hier entwickeln und wie kann ich dir helfen? Ich antworte minimalistisch und empathisch.",

  // Actions / footer
  export: "Export",
  levels: "Levels",
  levelsComing: "Levels kommen bald",
  threadExported: "Thread exportiert.",

  // Status bar
  statusMode: "Modus:",
  statusAgent: "KI:",

  // Backward-compat alias
  statusAI: "KI:",

  // ARIA / A11y
  conversationAria: "Chat-Verlauf",
  assistantSays: "Assistenten-Nachricht",
  youSaid: "Deine Nachricht",
  columnAria: "Säule – Steuerung & Auswahl",
  mobileOverlayLabel: "Mobiles Säulen-Overlay",
};

const DICTS = { en: en as Dict, de } as const;
export type Locale = keyof typeof DICTS;

const STORAGE_KEY = "mpathy:locale";

/** SSR-safe locale initialization */
function detectInitialLocale(): Locale {
  // 1) localStorage (client only)
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && saved in DICTS) return saved;
  }
  // 2) navigator language (client only)
  if (typeof navigator !== "undefined") {
    const lang = (navigator.language || "").toLowerCase();
    if (lang.startsWith("de")) return "de";
  }
  // 3) default
  return "en";
}

let currentLocale: Locale = detectInitialLocale();

/** Read current locale */
export function getLocale(): Locale {
  return currentLocale;
}

/** Set current locale (persists on client) */
export function setLocale(locale: Locale) {
  if (!(locale in DICTS)) return;
  currentLocale = locale;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale);
    // Optional: notify listeners (components can re-render on locale change)
    window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale } }));
  }
}

/**
 * Translate key. Falls back to English, then to the key itself.
 * Keep the type open so unknown keys don't break the build.
 */
export function t(key: string): string {
  const dict = DICTS[currentLocale] || en;
  if (key in dict) return dict[key];
  if (key in en) return (en as Dict)[key];
  return key;
}

/** Optional helper: list of available locales */
export const availableLocales: Locale[] = ["en", "de"];

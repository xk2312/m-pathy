/***
 * ============================================================
 *  M — I18N MASTER (Legacy-Chat + Subscription + CouncilOrbit)
 * ============================================================
 *
 *  INDEX (Sprunganker):
 *
 *  [ANCHOR:FORENSICS]      – Textuelle Systemübersicht der drei i18n-Welten
 *                            (A: Legacy-Chat, B: Subscription/Landing, C: CouncilOrbit),
 *                            inkl. Fallstricke & Merksätze.
 *
 *  [ANCHOR:LEGACY-DICTS]   – Legacy-UI-Wörterbücher `en` und `de`
 *                            (Inputtexte, Säule, Statuszeile, Experten, ARIA-Labels),
 *                            DICTS = { en, de }.
 *
 *  [ANCHOR:CORE-TYPES]     – Basistypen `Dict`, `Locale`, DICTS, STORAGE_KEY
 *                            sowie Helfer `toBase()`, `UX_LOCALES`, `isSupported()`.
 *
 *  [ANCHOR:LOCALE-NEGOTIATION]
 *                          – Browser-/Dokument-Spracherkennung:
 *                            `negotiateLocaleFromBrowser()`, `detectInitialLocale()`,
 *                            Initialisierung von `currentLocale`.
 *
 *  [ANCHOR:LOCALE-API]     – Öffentliche Locale-API:
 *                            `getLocale()`, `setLocale()` inkl. localStorage-Write
 *                            und CustomEvents (`mpathy:i18n:change`, `mpathy:i18n:explicit`).
 *
 *  [ANCHOR:TRANSLATE-API]  – Kern-Übersetzer:
 *                            `t(key)` mit Fallback-Kaskade (Legacy → UX → EN),
 *                            `tr(key, fallback, vars)` mit Platzhalterersetzung,
 *                            `availableLocales`.
 *
 *  [ANCHOR:WATCHERS]       – Runtime-Watcher:
 *                            `attachLocaleWatchers()` für `<html lang>`-Mutation,
 *                            `languagechange`-Event, Auto-Init im Browser.
 *
 *  [ANCHOR:SUB-DICT-EN]    – `dict.en`: Master-Texte für Subscription/Landing/PowerPrompts
 *                            (Hero, Sections s1–s3, Hints, Tabs, KPI-Board, Table,
 *                             Export-Controls, Seal, Criteria.*, Testimonials).
 *
 *  [ANCHOR:SUB-DICT-DE]    – `dict.de`: deutsche Übersetzung von `dict.en`
 *                            (gleiche Keystruktur, lokalisierte Texte).
 *
 *  [ANCHOR:SUB-DICT-FR]    – `dict.fr`: französische Übersetzung.
 *  [ANCHOR:SUB-DICT-ES]    – `dict.es`: spanische Übersetzung.
 *  [ANCHOR:SUB-DICT-IT]    – `dict.it`: italienische Übersetzung.
 *  [ANCHOR:SUB-DICT-PT]    – `dict.pt`: portugiesische Übersetzung.
 *  [ANCHOR:SUB-DICT-NL]    – `dict.nl`: niederländische Übersetzung.
 *  [ANCHOR:SUB-DICT-RU]    – `dict.ru`: russische Übersetzung.
 *  [ANCHOR:SUB-DICT-ZH]    – `dict.zh`: chinesische Übersetzung.
 *  [ANCHOR:SUB-DICT-JA]    – `dict.ja`: japanische Übersetzung.
 *  [ANCHOR:SUB-DICT-KO]    – `dict.ko`: koreanische Übersetzung.
 *  [ANCHOR:SUB-DICT-AR]    – `dict.ar`: arabische Übersetzung.
 *  [ANCHOR:SUB-DICT-HI]    – `dict.hi`: hindi Übersetzung.
 *
 *  RELEVANZ:
 *    - LEGACY-DICTS        → aktuell genutzte Texte für Chat/Säule (page2-Welt).
 *    - SUB-DICT-*          → 13-sprachige Subscription-/Landing-Welt.
 *    - LOCALE-/TRANSLATE   → gemeinsame Schicht, die Browser-Locale, LanguageSwitcher
 *                             und Fallback-Logik für beide Welten koppelt.
 *
 *  ------------------------------------------------------------------
 *  [ANCHOR:FORENSICS] – I18N SYSTEM OVERVIEW – GPTM-GALAXY (FORENSIC)
 *  ------------------------------------------------------------------
 *
 * Es existieren DREI i18n-Welten in diesem Projekt:
 *
 * (A) LEGACY-CHAT-i18n
 * --------------------
 * - Quelle:   const en = { … }, const de = { … }, DICTS = { en, de }
 * - Sprachen: en, de
 * - Zugriff:  t(key), tr(key, fallback, vars)
 * - Struktur: flache Key→Value Paare
 * - Fallback: Legacy[locale] → UX-dict[locale] → Legacy.en → UX-dict.en
 * - Zweck:    Historische/Chat-UI-Strings, NICHT Subscription-UI
 *
 * (B) SUBSCRIPTION / LANDING / POWERPROMPTS (dict)
 * -----------------------------------------------
 * - Export:   export const dict = { en: { … }, de: { … }, fr: { … }, … }
 * - Sprachen: 13 (en, de, fr, es, it, pt, nl, ru, zh, ja, ko, ar, hi)
 * - Authoring: verschachtelt (z. B. pp: { title, groups:{}, e1…u3 })
 * - Runtime:  FLAT via flattenI18n(obj) → z. B.:
 *             "hero_title"
 *             "pp.title"
 *             "pp.groups.parents"
 *             "metrics.silent_trust.label"
 *             "testimonials.gemini"
 *
 * - LanguageProvider (Subscription-Welt):
 *     - baut enFlat = flattenI18n(dict.en)
 *     - baut locFlat = flattenI18n(dict[locale] ?? dict.en)
 *     - providerDict[lang] = { ...enFlat, ...locFlat }
 *     - useLang().t(k) = providerDict[lang][k] || providerDict.en[k] || k
 *
 * - WICHTIG:
 *   - Subscription-Komponenten dürfen NUR useLang().t("…") verwenden.
 *   - Alle Keys in der Subscription-UI sind geflattete Strings.
 *   - dict ist nur Authoring-Quelle, nicht direkt im UI verwenden.
 *
 * (C) COUNCILORBIT-i18n (SEPARAT)
 * -------------------------------
 * - Export:   export const i18n
 * - Struktur:
 *     i18n[lang].council.items[id] = {
 *       title: string;
 *       subtitle: string;
 *       kpi: { superpower: string; focus: string; signal: string };
 *     }
 * - Zugriff im Orbit:
 *     const active = i18n[lang] ?? i18n.en;
 *     active.council.items["m-power"].kpi.superpower
 * - flattenI18n wird HIER NICHT verwendet.
 * - COMPLETELY AUTARK: nutzt NICHT dict & NICHT den LanguageProvider-t().
 *
 * ------------------------------------------------------------
 *  FALLSTRICKE / DOs & DON'Ts
 * ------------------------------------------------------------
 * - Es gibt ZWEI t()-Funktionen:
 *     1) lib/i18n.t()  → Legacy + dict + Fallback-Mix
 *     2) useLang().t() → nur geflattetes Subscription-Dict
 *   → In Subscription-Komponenten IMMER useLang().t() verwenden.
 *
 * - Authoring vs. Runtime:
 *     - Authoring: dict.en / dict.de usw. dürfen verschachtelt sein.
 *     - Runtime:   Subscription-UI sieht nur FLAT Keys.
 *
 * - Locale-Quellen:
 *     - Legacy:     DICTS (en/de)
 *     - Subscription: dict (13 Sprachen) + SUP-Liste im Frontend
 *     - CouncilOrbit: eigene i18n-Map je Sprache
 *   → Beim Hinzufügen/Entfernen von Sprachen alle drei Stellen prüfen.
 *
 * ------------------------------------------------------------
 *  MERKSÄTZE (KURZ)
 * ------------------------------------------------------------
 * - Subscription-UI → ausschließlich geflattete Keys über useLang().t().
 * - CouncilOrbit → eigenes objektbasiertes i18n (i18n[lang].council.items).
 * - lib/i18n.t() NICHT in Subscription-Components verwenden.
 * - dict ist verschachtelt, wird aber IMMER zu flachen Keys gemacht.
 * - Aufpassen auf Key-Kollisionen (hero_*, pp.*, metrics.*, testimonials.*).
 */
import { attachPowerPrompts } from "./i18n.powerprompt";
import { attachHero } from "./i18n.hero";
import { attachKpi } from "./i18n.kpi";
import { attachTestimonials } from "./i18n.testimonial";

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

  // Status texts
  "status.modeSet": "Mode set: {label}.",

  // Prompt texts
  "prompts.onboarding": "Hey! 👋 Who are you and how will you guide me here step by step?",
  "prompts.modeDefault": "Reset everything to default and give me a brief status.",
  "prompts.councilIntro": "Each AI please introduce yourself and say how you can help right now.",
  "prompts.modeGeneric": "Mode {label}: What are you and where will you help me best?",
  "prompts.expertAskTemplate": "{expert}, who are you and what can you do for me?",
  // Experts (used by Saeule.tsx)
  "experts.title": "Experts",
  "experts.choose": "Choose expert",
  "experts.askTemplate": "{expert}, who are you and what can you do for me?",
  "experts.askTemplateDefault": "{expert}, who are you and what can you do for me?",

  // CTA fallback
  "cta.fallback": "All set — tell me what you want to build (app, flow, feature …).",

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
  // Status-Texte
  "status.modeSet": "Modus gesetzt: {label}.",

  // Prompt-Texte
  "prompts.onboarding": "Hey! 👋 Wer bist du und wie begleitest du mich hier Schritt für Schritt?",
  "prompts.modeDefault": "Setze alles auf Standard zurück und sag mir kurz den Status.",
  "prompts.councilIntro": "Alle KIs bitte kurz vorstellen und sagen, wobei ihr sofort helfen könnt.",
  "prompts.modeGeneric": "Modus {label}: Was bist du und wobei unterstützt du mich am besten?",
  "prompts.expertAskTemplate": "{expert}, wer bist du und was kannst du für mich tun?",
  // Experten (wird von Saeule.tsx genutzt)
  "experts.title": "Experten",
  "experts.choose": "Experten wählen",
  "experts.askTemplate": "{expert}, wer bist du und was kannst du für mich tun?",
  "experts.askTemplateDefault": "{expert}, wer bist du und was kannst du für mich tun?",

  // CTA Fallback
  "cta.fallback": "Alles klar – sag mir einfach, was du bauen möchtest (App, Flow, Feature …).",

  // ARIA / A11y
  conversationAria: "Chat-Verlauf",
  assistantSays: "Assistenten-Nachricht",
  youSaid: "Deine Nachricht",
  columnAria: "Säule – Steuerung & Auswahl",
  mobileOverlayLabel: "Mobiles Säulen-Overlay",
};

// ... (oberer Kontext)
const DICTS = { en: en as Dict, de } as const; // legacy UI-only

// ⚠️ WICHTIG: Für die neue UI akzeptieren wir ALLE Locales, die im `dict` definiert sind.
export type Locale = string;

const STORAGE_KEY = "mpathy:locale";

// Mappt "de-AT" → "de"
function toBase(tag: string): string {
  return String(tag || "").toLowerCase().split("-")[0];
}

// Locale-Cache (wird nach dict-Init befüllt; vermeidet TDZ)
let UX_LOCALES: string[] = ["en"];

// Neu: helper – ist diese Sprache irgendwo unterstützt (dict ODER legacy)?
function isSupported(tag: string): boolean {
  const base = toBase(tag);
  return (base in DICTS) || UX_LOCALES.includes(base);
}


/** Aushandlung aus navigator.languages, navigator.language, <html lang> */
function negotiateLocaleFromBrowser(): string {
  try {
    if (typeof navigator !== "undefined" && Array.isArray((navigator as any).languages)) {
      for (const l of (navigator as any).languages) {
        const base = toBase(l);
        if (isSupported(base)) return base;
      }
    }
    if (typeof navigator !== "undefined" && navigator.language) {
      const base = toBase(navigator.language);
      if (isSupported(base)) return base;
    }
    if (typeof document !== "undefined" && document.documentElement?.lang) {
      const base = toBase(document.documentElement.lang);
      if (isSupported(base)) return base;
    }
  } catch { /* noop */ }
  return "en";
}


/** SSR-safe locale initialization */
function detectInitialLocale(): Locale {
  if (typeof window !== "undefined") {
    const explicit = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (explicit && isSupported(explicit)) return explicit;
  }
  const negotiated = negotiateLocaleFromBrowser();
  if (isSupported(negotiated)) return negotiated as Locale;
  return "en";
}


let currentLocale: Locale = detectInitialLocale();

/** Read current locale */
export function getLocale(): Locale {
  return currentLocale;
}

/** Set current locale (persists on client) — explizites Override */
export function setLocale(locale: Locale) {
  if (!isSupported(locale)) return;
  currentLocale = toBase(locale);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, currentLocale);
    window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: currentLocale } }));
    window.dispatchEvent(new CustomEvent("mpathy:i18n:explicit"));
  }
}

/**
 * Translate key. Falls back to English, then to the key itself.
 * Keep the type open so unknown keys don't break the build.
 */
export function t(key: string): string {
  // Tipp: DICTS enthält legacy en/de, currentLocale ist string → typisierter Zugriff
  const uiDicts = DICTS as unknown as Record<string, Dict>;
  const ui = uiDicts[currentLocale] ?? en;                     // Legacy-UI

  const uxAll = (dict as unknown as Record<string, Record<string, string>>) ?? {};
  const ux = uxAll[currentLocale] ?? uxAll.en ?? {};           // Locale→EN Fallback

  const v =
    (ui as any)[key] ??
    (ux as any)[key] ??
    (en as any)[key] ??
    (uxAll.en ? (uxAll.en as any)[key] : undefined);

  return typeof v === "string" ? v : key;
}


/** Übersetzen mit Fallback-Text und einfachen Platzhaltern {name} */
export function tr(key: string, fallback: string, vars?: Record<string, string>): string {
  let out = t(key);
  if (out === key) out = fallback; // Fallback verwenden, wenn Key fehlt
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return out;
}

/** Optional helper: list of available locales (automatisch aus DICTS) */
export const availableLocales: Locale[] = Object.keys(DICTS) as Locale[];

/** Reagiert auf Sprachwechsel im Browser/Dokument (ohne explizites Override) */
function attachLocaleWatchers() {
  if (typeof window === "undefined") return;

  // Wenn USER später setLocale() aufruft, setzen wir ein explizites Override.
  // Solange nicht explizit gesetzt, folgen wir Browser/DOM.
  let explicit = !!window.localStorage.getItem(STORAGE_KEY);

  // Beobachte Änderungen an <html lang="">
  try {
    const mo = new MutationObserver(() => {
      if (explicit) return;
      const next = negotiateLocaleFromBrowser() as Locale;
      if (next !== currentLocale) {
        currentLocale = next;
        window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: next } }));
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  } catch { /* noop */ }

  // Reagiere auf Browser-Event languagechange (z. B. iOS/Android)
  window.addEventListener("languagechange", () => {
    if (explicit) return;
    const next = negotiateLocaleFromBrowser() as Locale;
    if (next !== currentLocale) {
      currentLocale = next;
      window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: next } }));
    }
  });

  // Wenn jemand später setLocale() nutzt, merken wir uns das als explizit.
  window.addEventListener("mpathy:i18n:explicit", () => {
    explicit = true;
  });
}

// --- Auto-Init (Client): folge Browser/DOM-Sprache, bis Nutzer explizit setLocale() ruft ---
if (typeof window !== "undefined") {
  // Falls <html lang> leer ist, mit Browser-Grundsprache befüllen (kosmetisch)
  try {
    if (!document.documentElement.lang) {
      document.documentElement.lang = toBase(negotiateLocaleFromBrowser());
    }
  } catch { /* noop */ }

  attachLocaleWatchers();
}

// ------------------------------------------------------------
// Subscription / Landing / UX Dict – Basisobjekt (13 Sprachen)
// ------------------------------------------------------------
export const dict: Record<string, Record<string, unknown>> = {
  en: {},
  de: {},
  fr: {},
  es: {},
  it: {},
  pt: {},
  nl: {},
  ru: {},
  zh: {},
  ja: {},
  ko: {},
  ar: {},
  hi: {},
};

// Hero / KPI / Testimonials an das Subscription-Dict anhängen
attachHero(dict as any);
attachKpi(dict as any);
attachTestimonials(dict as any);

// PowerPrompts an das Subscription-Dict anhängen
attachPowerPrompts(dict as any);

// UX_LOCALES nach vollständiger Dict-Initialisierung füllen
UX_LOCALES = Object.keys(dict);

export type UIDict = typeof dict;


// ------------------------------------------------------------
// CouncilOrbit i18n
// ------------------------------------------------------------
// Die Texte & Typen für CouncilOrbit liegen jetzt in
//   "@/lib/i18n.councilorbit" (export const i18n, export type CouncilKey).
// lib/i18n.ts enthält nur noch Chat- + Subscription-i18n.
//
// PowerPrompt i18n liegt jetzt in "./i18n.powerprompt.ts"
// und erweitert dort `dict` per Side-Effect.
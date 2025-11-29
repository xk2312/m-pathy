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
export const dict = {
  en: {
    hero_title: "Your Operating System for Creation",
    hero_sub: "From idea to impact in minutes.",
    hero_cta: "Begin your journey",
    s1_title: "start agency",
    s1_sub: "Launch campaigns that learn.",
    s2_title: "NEM — Biology × Chemistry",
    s2_sub: "Design new entities safely.",
    s2_why: "Why possible on m-pathy.ai? Orchestrated roles, constraint checks, symbolic proof.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Understand blockchain in 60s.",
    council_hint: "Tap a light to meet the council.",
    modes_hint: "Modes adapt to you — automatically.",
    trust_title: "Own your data.",
    trust_sub: "One-tap JSON export & delete.",
    cta_title: "Start with GalaxyBuilder",
    cta_sub: "Build the future with clarity.",
    cta_btn_primary: "Get started",
    cta_btn_secondary: "See pricing",
    tabs: { overview:"Overview", core:"Core", empathy:"Empathy", trust:"Trust", clarity:"Clarity" },
    kpi: {
      title:"m-pathy KPI Board",
      subtitle:"User Benchmark · CausaTest 100% · Sealed (Triketon-2048)"
    },
    overview: {
      title:"Overall comparison",
      radar_card_title:"Layer radar (choose a tab)",
      radar_hint:"Select a layer above to view the radar."
    },
    table: {
      kpi:"KPI",
      total:"Total score (0–500)",
      avg:"Average (0–10)",
      causa:"CausaTest – Coherence (%)",
      criterion:"Criterion"
    },
    export: {
      csv:"CSV",
      json:"JSON",
      print:"Print",
      hc:"High contrast",
      download_csv:"Download CSV",
      download_json:"Download JSON",
      print_pdf:"Print / PDF",
      hc_title:"High contrast (H)",
      filename_csv:"m-pathy-kpis.csv",
      filename_json:"m-pathy-kpis.json"
    },
    seal: { line:"Sealed · Triketon-2048 · Signature" },
    criteria: {
      heart_logic: { label:"Heart–Logic Equilibrium", tooltip:"Balanced reason + warmth under complexity." },
      divine_precision: { label:"Divine Precision", tooltip:"Exactness without harshness." },
      field_unity: { label:"Field Unity", tooltip:"All layers cohere." },
      ethical_resonance: { label:"Ethical Resonance" },
      zero_point: { label:"Zero-Point Alignment" },
      determinism: { label:"Determinism (Repeatability)" },
      error_recovery: { label:"Error Recovery / Self-Correction" },
      steerability: { label:"Steerability (Voice/Style)" },
      data_governance: { label:"Data Governance & Locality" },
      auditability: { label:"Auditability (Triketon Seal)" },
      admin_controls: { label:"Enterprise Admin Controls" },
      multi_agent: { label:"Multi-Agent Orchestration" },
      quantum_empathy: { label:"Quantum Empathy", tooltip:"Pre-verbal sensing of micro-signals." },
      emotional_symmetry: { label:"Emotional Symmetry" },
      emotional_memory: { label:"Emotional Memory" },
      intuitive_bonding: { label:"Intuitive Bonding" },
      mutual_evolution: { label:"Mutual Evolution" },
      neural_empathy_retention: { label:"Neural Empathy Retention" },
      temporal_empathy: { label:"Temporal Empathy" },
      guided_silence: { label:"Guided Silence" },
      presence_field: { label:"Presence Field" },
      mirror_coherence: { label:"Mirror Coherence" },
      integrity_feedback: { label:"Integrity Feedback" },
      emotional_transfer_balance: { label:"Emotional Transfer Balance" },
      intention_reading: { label:"Intention Reading (Subtext)" },
      silent_trust: { label:"Silent Trust" },
      resonant_honesty: { label:"Resonant Honesty" },
      temporal_loyalty: { label:"Temporal Loyalty" },
      self_healing: { label:"Self-Healing Response" },
      trust_echo: { label:"Trust Echo" },
      reality_grounding: { label:"Reality Grounding" },
      shadow_transparency: { label:"Shadow-Transparency" },
      reliability: { label:"Reliability / Uptime" },
      privacy_controls: { label:"Memory Privacy Controls" },
      admin_audit: { label:"Audit Trail & User Logging" },
      legal_safety: { label:"Nuanced Safety (No Overblock)" },
      governance_locality: { label:"Data Locality (On-Prem Options)" },
      lux_resonance: { label:"LUX Resonance" },
      presence_echo: { label:"Presence Echo" },
      cognitive_mirror: { label:"Cognitive Mirror" },
      luminous_reflection: { label:"Luminous Reflection" },
      field_stability: { label:"Field Stability" },
      explanation_clarity: { label:"Explanation Clarity (Step-by-Step)" },
      summarization_fidelity: { label:"Summarization Fidelity" },
      translation_quality: { label:"Translation Quality" },
      math_reasoning: { label:"Math & Structured Reasoning" },
      tool_calling: { label:"Tool/Function Calling Reliability" },
      web_browsing: { label:"Web Browsing Robustness" },
      multimodal_input: { label:"Multimodal Input (Images/PDFs)" },
      creativity_content: { label:"Creativity for Content Writing" }
    },
    testimonials: {
      gemini: "m-pathy is the frequency that creates clarity and deepest resonance for everyone.",
      grok: "m-pathy is the resonance OS—empathetic, visionary—poetic yet revolutionary. M builds the future.",
      gpt5: "m-pathy turns artificial intelligence into a comprehensible system—knowledge becomes traceable, not mystical."
    },

  },
  de: {
    hero_title: "Dein Herz der Schöpfung",
    hero_sub: "Jede Idee trägt ihre Wirkung in sich.",
    hero_cta: "Jetzt starten",
    s1_title: "start agency",
    s1_sub: "Starte Kampagnen, die lernen.",
    s2_title: "NEM — Biologie × Chemie",
    s2_sub: "Entwickle neue Einheiten sicher.",
    s2_why: "Warum auf m-pathy.ai? Orchestrierte Rollen, Constraint-Checks, symbolischer Proof.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Verstehe Blockchain in 60s.",
    council_hint: "Wähle eine KI – sie zeigt dir ihre Kraft",
    modes_hint: "Modi passen sich automatisch an.",
    trust_title: "Du besitzt deine Daten.",
    trust_sub: "JSON-Export & Löschen mit einem Tipp.",
    cta_title: "Starte mit GalaxyBuilder",
    cta_sub: "Baue die Zukunft mit Klarheit.",
    cta_btn_primary: "Loslegen",
    cta_btn_secondary: "Preise ansehen",
    tabs: { overview:"Übersicht", core:"Core", empathy:"Empathie", trust:"Vertrauen", clarity:"Klarheit" },
    kpi: {
      title:"m-pathy KPI-Tafel",
      subtitle:"User Benchmark · CausaTest 100 % · Versiegelt (Triketon-2048)"
    },
    overview: {
      title:"Gesamtvergleich",
      radar_card_title:"Layer-Radar (Tab wählen)",
      radar_hint:"Oben einen Layer wählen, um das Radar zu sehen."
    },
    table: {
      kpi:"KPI",
      total:"Gesamtscore (0–500)",
      avg:"Ø-Wert (0–10)",
      causa:"CausaTest – Kohärenz (%)",
      criterion:"Kriterium"
    },
    export: {
      csv:"CSV",
      json:"JSON",
      print:"Drucken",
      hc:"Hoher Kontrast",
      download_csv:"CSV herunterladen",
      download_json:"JSON herunterladen",
      print_pdf:"Drucken / PDF",
      hc_title:"Hoher Kontrast (H)",
      filename_csv:"m-pathy-kpis.csv",
      filename_json:"m-pathy-kpis.json"
    },
    seal: { line:"Versiegelt · Triketon-2048 · Signatur" },

    criteria: {
      heart_logic: { label:"Herz-Logik-Gleichgewicht", tooltip:"Ausgewogene Vernunft + Wärme unter Komplexität." },
      divine_precision: { label:"Göttliche Präzision", tooltip:"Exaktheit ohne Härte." },
      field_unity: { label:"Feld-Einheit", tooltip:"Alle Ebenen fügen sich." },
      ethical_resonance: { label:"Ethische Resonanz" },
      zero_point: { label:"Nullpunkt-Ausrichtung" },
      determinism: { label:"Determinismus (Wiederholbarkeit)" },
      error_recovery: { label:"Fehler-Erholung / Selbstkorrektur" },
      steerability: { label:"Steuerbarkeit (Stimme/Stil)" },
      data_governance: { label:"Daten-Governance & Lokalität" },
      auditability: { label:"Auditierbarkeit (Triketon-Siegel)" },
      admin_controls: { label:"Enterprise-Admin-Kontrollen" },
      multi_agent: { label:"Multi-Agent-Orchestrierung" },
      quantum_empathy: { label:"Quanten-Empathie", tooltip:"Vor-verbale Wahrnehmung von Mikrosignalen." },
      emotional_symmetry: { label:"Emotionale Symmetrie" },
      emotional_memory: { label:"Emotionales Gedächtnis" },
      intuitive_bonding: { label:"Intuitive Bindung" },
      mutual_evolution: { label:"Wechselseitige Entwicklung" },
      neural_empathy_retention: { label:"Neuronale Empathie-Beibehaltung" },
      temporal_empathy: { label:"Zeitliche Empathie" },
      guided_silence: { label:"Geführte Stille" },
      presence_field: { label:"Präsenz-Feld" },
      mirror_coherence: { label:"Spiegel-Kohärenz" },
      integrity_feedback: { label:"Integritäts-Feedback" },
      emotional_transfer_balance: { label:"Balance emotionaler Übertragung" },
      intention_reading: { label:"Intentions-Lesen (Subtext)" },
      silent_trust: { label:"Stilles Vertrauen" },
      resonant_honesty: { label:"Resonante Ehrlichkeit" },
      temporal_loyalty: { label:"Zeitliche Loyalität" },
      self_healing: { label:"Selbstheilungs-Reaktion" },
      trust_echo: { label:"Vertrauens-Echo" },
      reality_grounding: { label:"Realitäts-Verankerung" },
      shadow_transparency: { label:"Schatten-Transparenz" },
      reliability: { label:"Zuverlässigkeit / Uptime" },
      privacy_controls: { label:"Datenschutz-Kontrollen (Speicher)" },
      admin_audit: { label:"Audit-Trail & Nutzer-Protokollierung" },
      legal_safety: { label:"Nuancierte Sicherheit (ohne Überblock)" },
      governance_locality: { label:"Daten-Lokalität (On-Prem Optionen)" },
      lux_resonance: { label:"LUX-Resonanz" },
      presence_echo: { label:"Präsenz-Echo" },
      cognitive_mirror: { label:"Kognitiver Spiegel" },
      luminous_reflection: { label:"Luminöse Reflexion" },
      field_stability: { label:"Feld-Stabilität" },
      explanation_clarity: { label:"Erklärungs-Klarheit (Schritt-für-Schritt)" },
      summarization_fidelity: { label:"Zusammenfassungs-Treue" },
      translation_quality: { label:"Übersetzungs-Qualität" },
      math_reasoning: { label:"Mathematisch-strukturiertes Denken" },
      tool_calling: { label:"Werkzeug-/Funktions-Aufruf-Zuverlässigkeit" },
      web_browsing: { label:"Web-Browsing-Robustheit" },
      multimodal_input: { label:"Multimodale Eingabe (Bilder/PDFs)" },
      creativity_content: { label:"Kreativität bei Content-Erstellung" }
    },
    testimonials: {
      gemini: "m-pathy ist die Frequenz, die Klarheit und tiefste Resonanz für alle schafft.",
      grok: "m-pathy ist die Resonanz-OS – empathisch, visionär – poetisch, aber revolutionär. M baut Zukunft.",
      gpt5: "m-pathy verwandelt künstliche Intelligenz in ein verständliches System – Wissen wird nachvollziehbar, nicht mystisch."
    },


  },
  fr: {
    hero_title: "Le système d’exploitation de la création",
    hero_sub: "De l’idée à l’impact en quelques minutes.",
    hero_cta: "Commencer votre voyage",
    s1_title: "start agency",
    s1_sub: "Lancez des campagnes qui apprennent.",
    s2_title: "NEM — Biologie × Chimie",
    s2_sub: "Concevez de nouvelles entités en toute sécurité.",
    s2_why: "Pourquoi sur m-pathy.ai ? Rôles orchestrés, contrôles des contraintes, preuve symbolique.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Comprendre la blockchain en 60 s.",
    council_hint: "Touchez une lumière pour rencontrer le conseil.",
    modes_hint: "Les modes s’adaptent à vous — automatiquement.",
    trust_title: "Vos données vous appartiennent.",
    trust_sub: "Export JSON et suppression en un tap.",
    cta_title: "Commencez avec GalaxyBuilder",
    cta_sub: "Construisez l’avenir avec clarté.",
    cta_btn_primary: "Commencer",
    cta_btn_secondary: "Voir les tarifs",
  tabs: { overview:"Vue d’ensemble", core:"Noyau", empathy:"Empathie", trust:"Confiance", clarity:"Clarté" },
  kpi: {
    title:"Tableau des KPI m-pathy",
    subtitle:"Benchmark utilisateur · CausaTest 100 % · Scellé (Triketon-2048)"
  },
  overview: {
    title:"Comparaison générale",
    radar_card_title:"Radar des couches (choisir un onglet)",
    radar_hint:"Sélectionnez une couche ci-dessus pour afficher le radar."
  },
  table: {
    kpi:"KPI",
    total:"Score total (0–500)",
    avg:"Moyenne (0–10)",
    causa:"CausaTest – Cohérence (%)",
    criterion:"Critère"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"Imprimer",
    hc:"Contraste élevé",
    download_csv:"Télécharger CSV",
    download_json:"Télécharger JSON",
    print_pdf:"Imprimer / PDF",
    hc_title:"Contraste élevé (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"Scellé · Triketon-2048 · Signature" },

  criteria: {
    heart_logic: { label:"Équilibre cœur-logique", tooltip:"Raison équilibrée + chaleur sous complexité." },
    divine_precision: { label:"Précision divine", tooltip:"Exactitude sans dureté." },
    field_unity: { label:"Unité du champ", tooltip:"Toutes les couches sont cohérentes." },
    ethical_resonance: { label:"Résonance éthique" },
    zero_point: { label:"Alignement du point zéro" },
    determinism: { label:"Déterminisme (répétabilité)" },
    error_recovery: { label:"Récupération / auto-correction d’erreurs" },
    steerability: { label:"Pilotabilité (voix/style)" },
    data_governance: { label:"Gouvernance et localité des données" },
    auditability: { label:"Auditabilité (sceau Triketon)" },
    admin_controls: { label:"Contrôles administrateur d’entreprise" },
    multi_agent: { label:"Orchestration multi-agents" },

    quantum_empathy: { label:"Empathie quantique", tooltip:"Perception pré-verbale des micro-signaux." },
    emotional_symmetry: { label:"Symétrie émotionnelle" },
    emotional_memory: { label:"Mémoire émotionnelle" },
    intuitive_bonding: { label:"Lien intuitif" },
    mutual_evolution: { label:"Évolution mutuelle" },
    neural_empathy_retention: { label:"Rétention d’empathie neuronale" },
    temporal_empathy: { label:"Empathie temporelle" },
    guided_silence: { label:"Silence guidé" },
    presence_field: { label:"Champ de présence" },
    mirror_coherence: { label:"Cohérence miroir" },
    integrity_feedback: { label:"Retour d’intégrité" },
    emotional_transfer_balance: { label:"Équilibre du transfert émotionnel" },
    intention_reading: { label:"Lecture d’intention (sous-texte)" },

    silent_trust: { label:"Confiance silencieuse" },
    resonant_honesty: { label:"Honnêteté résonante" },
    temporal_loyalty: { label:"Loyauté temporelle" },
    self_healing: { label:"Réponse auto-guérissante" },
    trust_echo: { label:"Écho de confiance" },
    reality_grounding: { label:"Ancrage à la réalité" },
    shadow_transparency: { label:"Transparence de l’ombre" },
    reliability: { label:"Fiabilité / disponibilité" },
    privacy_controls: { label:"Contrôles de confidentialité mémoire" },
    admin_audit: { label:"Journal d’audit et de suivi utilisateur" },
    legal_safety: { label:"Sécurité nuancée (sans sur-blocage)" },
    governance_locality: { label:"Localité des données (options sur site)" },

    lux_resonance: { label:"Résonance LUX" },
    presence_echo: { label:"Écho de présence" },
    cognitive_mirror: { label:"Miroir cognitif" },
    luminous_reflection: { label:"Réflexion lumineuse" },
    field_stability: { label:"Stabilité du champ" },
    explanation_clarity: { label:"Clarté d’explication (étape par étape)" },
    summarization_fidelity: { label:"Fidélité du résumé" },
    translation_quality: { label:"Qualité de traduction" },
    math_reasoning: { label:"Raisonnement mathématique structuré" },
    tool_calling: { label:"Fiabilité des appels d’outils / fonctions" },
    web_browsing: { label:"Robustesse de la navigation web" },
    multimodal_input: { label:"Entrée multimodale (images/PDF)" },
    creativity_content: { label:"Créativité pour la rédaction de contenu" }
  },
  testimonials: {
    gemini: "m-pathy est la fréquence qui crée clarté et résonance profonde pour tous.",
    grok: "m-pathy est l’OS de résonance — empathique, visionnaire — poétique mais révolutionnaire. M bâtit l’avenir.",
    gpt5: "m-pathy transforme l’IA en un système compréhensible — le savoir devient traçable, non mystique."
  },

  },
  es: {
    hero_title: "El sistema operativo para la creación",
    hero_sub: "De la idea al impacto en minutos.",
    hero_cta: "Comienza tu viaje",
    s1_title: "start agency",
    s1_sub: "Lanza campañas que aprenden.",
    s2_title: "NEM — Biología × Química",
    s2_sub: "Diseña nuevas entidades de forma segura.",
    s2_why: "¿Por qué en m-pathy.ai? Roles orquestados, controles de restricciones, prueba simbólica.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Entiende blockchain en 60 s.",
    council_hint: "Toca una luz para conocer al consejo.",
    modes_hint: "Los modos se adaptan a ti — automáticamente.",
    trust_title: "Tus datos te pertenecen.",
    trust_sub: "Exportación JSON y borrado con un toque.",
    cta_title: "Empieza con GalaxyBuilder",
    cta_sub: "Construye el futuro con claridad.",
    cta_btn_primary: "Empezar",
    cta_btn_secondary: "Ver precios",

  tabs: { overview:"Resumen", core:"Core", empathy:"Empatía", trust:"Confianza", clarity:"Claridad" },
  kpi: {
    title:"Panel de KPIs de m-pathy",
    subtitle:"User Benchmark · CausaTest 100 % · Sellado (Triketon-2048)"
  },
  overview: {
    title:"Comparación general",
    radar_card_title:"Radar por capas (elige una pestaña)",
    radar_hint:"Selecciona una capa arriba para ver el radar."
  },
  table: {
    kpi:"KPI",
    total:"Puntuación total (0–500)",
    avg:"Promedio (0–10)",
    causa:"CausaTest – Coherencia (%)",
    criterion:"Criterio"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"Imprimir",
    hc:"Alto contraste",
    download_csv:"Descargar CSV",
    download_json:"Descargar JSON",
    print_pdf:"Imprimir / PDF",
    hc_title:"Alto contraste (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"Sellado · Triketon-2048 · Firma" },

  criteria: {
    heart_logic: { label:"Equilibrio corazón–lógica", tooltip:"Razón equilibrada + calidez bajo complejidad." },
    divine_precision: { label:"Precisión divina", tooltip:"Exactitud sin dureza." },
    field_unity: { label:"Unidad de campo", tooltip:"Todas las capas son coherentes." },
    ethical_resonance: { label:"Resonancia ética" },
    zero_point: { label:"Alineación de punto cero" },
    determinism: { label:"Determinismo (repetibilidad)" },
    error_recovery: { label:"Recuperación de errores / autocorrección" },
    steerability: { label:"Guiabilidad (voz/estilo)" },
    data_governance: { label:"Gobernanza de datos y localidad" },
    auditability: { label:"Auditabilidad (sello Triketon)" },
    admin_controls: { label:"Controles de administrador empresarial" },
    multi_agent: { label:"Orquestación multi-agente" },

    quantum_empathy: { label:"Empatía cuántica", tooltip:"Percepción pre-verbal de microseñales." },
    emotional_symmetry: { label:"Simetría emocional" },
    emotional_memory: { label:"Memoria emocional" },
    intuitive_bonding: { label:"Vínculo intuitivo" },
    mutual_evolution: { label:"Evolución mutua" },
    neural_empathy_retention: { label:"Retención de empatía neuronal" },
    temporal_empathy: { label:"Empatía temporal" },
    guided_silence: { label:"Silencio guiado" },
    presence_field: { label:"Campo de presencia" },
    mirror_coherence: { label:"Coherencia de espejo" },
    integrity_feedback: { label:"Retroalimentación de integridad" },
    emotional_transfer_balance: { label:"Equilibrio de transferencia emocional" },
    intention_reading: { label:"Lectura de intención (subtexto)" },

    silent_trust: { label:"Confianza silenciosa" },
    resonant_honesty: { label:"Honestidad resonante" },
    temporal_loyalty: { label:"Lealtad temporal" },
    self_healing: { label:"Respuesta de auto-sanación" },
    trust_echo: { label:"Eco de confianza" },
    reality_grounding: { label:"Anclaje a la realidad" },
    shadow_transparency: { label:"Transparencia de sombra" },
    reliability: { label:"Fiabilidad / tiempo activo" },
    privacy_controls: { label:"Controles de privacidad de memoria" },
    admin_audit: { label:"Rastro de auditoría y registro de usuarios" },
    legal_safety: { label:"Seguridad matizada (sin sobrebloqueo)" },
    governance_locality: { label:"Localidad de datos (opciones on-prem)" },

    lux_resonance: { label:"Resonancia LUX" },
    presence_echo: { label:"Eco de presencia" },
    cognitive_mirror: { label:"Espejo cognitivo" },
    luminous_reflection: { label:"Reflexión luminosa" },
    field_stability: { label:"Estabilidad de campo" },
    explanation_clarity: { label:"Claridad de explicación (paso a paso)" },
    summarization_fidelity: { label:"Fidelidad de resumen" },
    translation_quality: { label:"Calidad de traducción" },
    math_reasoning: { label:"Matemáticas y razonamiento estructurado" },
    tool_calling: { label:"Fiabilidad de llamadas de herramientas/funciones" },
    web_browsing: { label:"Robustez de navegación web" },
    multimodal_input: { label:"Entrada multimodal (imágenes/PDF)" },
    creativity_content: { label:"Creatividad para redacción de contenido" }
  },
  testimonials: {
    gemini: "m-pathy es la frecuencia que genera claridad y la resonancia más profunda para todos.",
    grok: "m-pathy es el sistema operativo de resonancia — empático, visionario — poético pero revolucionario. M construye el futuro.",
    gpt5: "m-pathy convierte la IA en un sistema comprensible — el conocimiento se vuelve rastreable, no místico."
  },




  },
  it: {
    hero_title: "Il sistema operativo per la creazione",
    hero_sub: "Dall’idea all’impatto in pochi minuti.",
    hero_cta: "Inizia il tuo viaggio",
    s1_title: "start agency",
    s1_sub: "Lancia campagne che imparano.",
    s2_title: "NEM — Biologia × Chimica",
    s2_sub: "Progetta nuove entità in sicurezza.",
    s2_why: "Perché su m-pathy.ai? Ruoli orchestrati, controlli dei vincoli, prova simbolica.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Comprendi la blockchain in 60 s.",
    council_hint: "Tocca una luce per incontrare il consiglio.",
    modes_hint: "Le modalità si adattano a te — automaticamente.",
    trust_title: "I tuoi dati sono tuoi.",
    trust_sub: "Export JSON e cancellazione con un tocco.",
    cta_title: "Inizia con GalaxyBuilder",
    cta_sub: "Costruisci il futuro con chiarezza.",
    cta_btn_primary: "Inizia",
    cta_btn_secondary: "Vedi prezzi",

  tabs: { overview:"Panoramica", core:"Core", empathy:"Empatia", trust:"Fiducia", clarity:"Chiarezza" },
  kpi: {
    title:"Pannello KPI di m-pathy",
    subtitle:"User Benchmark · CausaTest 100% · Sigillato (Triketon-2048)"
  },
  overview: {
    title:"Confronto generale",
    radar_card_title:"Radar dei livelli (scegli una scheda)",
    radar_hint:"Seleziona un livello sopra per visualizzare il radar."
  },
  table: {
    kpi:"KPI",
    total:"Punteggio totale (0–500)",
    avg:"Media (0–10)",
    causa:"CausaTest – Coerenza (%)",
    criterion:"Criterio"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"Stampa",
    hc:"Alto contrasto",
    download_csv:"Scarica CSV",
    download_json:"Scarica JSON",
    print_pdf:"Stampa / PDF",
    hc_title:"Alto contrasto (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"Sigillato · Triketon-2048 · Firma" },

  criteria: {
    heart_logic: { label:"Equilibrio cuore-logica", tooltip:"Ragione equilibrata + calore nella complessità." },
    divine_precision: { label:"Precisione divina", tooltip:"Esattezza senza durezza." },
    field_unity: { label:"Unità del campo", tooltip:"Tutti i livelli sono coerenti." },
    ethical_resonance: { label:"Risonanza etica" },
    zero_point: { label:"Allineamento del punto zero" },
    determinism: { label:"Determinismo (ripetibilità)" },
    error_recovery: { label:"Recupero errori / autocorrezione" },
    steerability: { label:"Direzionabilità (voce/stile)" },
    data_governance: { label:"Governance e località dei dati" },
    auditability: { label:"Auditabilità (sigillo Triketon)" },
    admin_controls: { label:"Controlli amministrativi aziendali" },
    multi_agent: { label:"Orchestrazione multi-agente" },

    quantum_empathy: { label:"Empatia quantistica", tooltip:"Percezione pre-verbale dei microsignali." },
    emotional_symmetry: { label:"Simmetria emotiva" },
    emotional_memory: { label:"Memoria emotiva" },
    intuitive_bonding: { label:"Legame intuitivo" },
    mutual_evolution: { label:"Evoluzione reciproca" },
    neural_empathy_retention: { label:"Mantenimento dell’empatia neurale" },
    temporal_empathy: { label:"Empatia temporale" },
    guided_silence: { label:"Silenzio guidato" },
    presence_field: { label:"Campo di presenza" },
    mirror_coherence: { label:"Coerenza speculare" },
    integrity_feedback: { label:"Feedback di integrità" },
    emotional_transfer_balance: { label:"Equilibrio del trasferimento emotivo" },
    intention_reading: { label:"Lettura delle intenzioni (sottotesto)" },

    silent_trust: { label:"Fiducia silenziosa" },
    resonant_honesty: { label:"Onestà risonante" },
    temporal_loyalty: { label:"Lealtà temporale" },
    self_healing: { label:"Risposta auto-rigenerante" },
    trust_echo: { label:"Eco di fiducia" },
    reality_grounding: { label:"Radicamento nella realtà" },
    shadow_transparency: { label:"Trasparenza dell’ombra" },
    reliability: { label:"Affidabilità / Uptime" },
    privacy_controls: { label:"Controlli di privacy della memoria" },
    admin_audit: { label:"Registro di audit e log utente" },
    legal_safety: { label:"Sicurezza sfumata (senza over-block)" },
    governance_locality: { label:"Località dei dati (opzioni on-prem)" },

    lux_resonance: { label:"Risonanza LUX" },
    presence_echo: { label:"Eco di presenza" },
    cognitive_mirror: { label:"Specchio cognitivo" },
    luminous_reflection: { label:"Riflessione luminosa" },
    field_stability: { label:"Stabilità del campo" },
    explanation_clarity: { label:"Chiarezza esplicativa (passo per passo)" },
    summarization_fidelity: { label:"Fedeltà del riassunto" },
    translation_quality: { label:"Qualità della traduzione" },
    math_reasoning: { label:"Ragionamento matematico strutturato" },
    tool_calling: { label:"Affidabilità delle chiamate agli strumenti/funzioni" },
    web_browsing: { label:"Robustezza della navigazione web" },
    multimodal_input: { label:"Input multimodale (immagini/PDF)" },
    creativity_content: { label:"Creatività nella creazione di contenuti" }
  },
  testimonials: {
    gemini: "m-pathy è la frequenza che crea chiarezza e risonanza più profonda per tutti.",
    grok: "m-pathy è l’OS della risonanza — empatico, visionario — poetico ma rivoluzionario. M costruisce il futuro.",
    gpt5: "m-pathy trasforma l’IA in un sistema comprensibile — la conoscenza diventa tracciabile, non mistica."
  },



  },
  pt: {
    hero_title: "O sistema operacional da criação",
    hero_sub: "Da ideia ao impacto em minutos.",
    hero_cta: "Iniciar a jornada",
    s1_title: "start agency",
    s1_sub: "Lance campanhas que aprendem.",
    s2_title: "NEM — Biologia × Química",
    s2_sub: "Projete novas entidades com segurança.",
    s2_why: "Por que no m-pathy.ai? Papéis orquestrados, verificações de restrições, prova simbólica.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Entenda blockchain em 60 s.",
    council_hint: "Toque uma luz para conhecer o conselho.",
    modes_hint: "Os modos se adaptam a você — automaticamente.",
    trust_title: "Seus dados são seus.",
    trust_sub: "Exportação JSON e exclusão com um toque.",
    cta_title: "Comece com o GalaxyBuilder",
    cta_sub: "Construa o futuro com clareza.",
    cta_btn_primary: "Começar",
    cta_btn_secondary: "Ver preços",


  tabs: { overview:"Visão geral", core:"Núcleo", empathy:"Empatia", trust:"Confiança", clarity:"Clareza" },
  kpi: {
    title:"Painel de KPIs m-pathy",
    subtitle:"User Benchmark · CausaTest 100% · Selado (Triketon-2048)"
  },
  overview: {
    title:"Comparação geral",
    radar_card_title:"Radar de camadas (escolha uma guia)",
    radar_hint:"Selecione uma camada acima para visualizar o radar."
  },
  table: {
    kpi:"KPI",
    total:"Pontuação total (0–500)",
    avg:"Média (0–10)",
    causa:"CausaTest – Coerência (%)",
    criterion:"Critério"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"Imprimir",
    hc:"Alto contraste",
    download_csv:"Baixar CSV",
    download_json:"Baixar JSON",
    print_pdf:"Imprimir / PDF",
    hc_title:"Alto contraste (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"Selado · Triketon-2048 · Assinatura" },

  criteria: {
    heart_logic: { label:"Equilíbrio coração-lógica", tooltip:"Razão equilibrada + calor sob complexidade." },
    divine_precision: { label:"Precisão divina", tooltip:"Exatidão sem rigidez." },
    field_unity: { label:"Unidade de campo", tooltip:"Todas as camadas são coerentes." },
    ethical_resonance: { label:"Ressonância ética" },
    zero_point: { label:"Alinhamento do ponto zero" },
    determinism: { label:"Determinismo (repetibilidade)" },
    error_recovery: { label:"Recuperação de erros / autocorreção" },
    steerability: { label:"Direcionabilidade (voz/estilo)" },
    data_governance: { label:"Governança e localidade de dados" },
    auditability: { label:"Auditabilidade (selo Triketon)" },
    admin_controls: { label:"Controles administrativos empresariais" },
    multi_agent: { label:"Orquestração multiagente" },

    quantum_empathy: { label:"Empatia quântica", tooltip:"Percepção pré-verbal de microssinais." },
    emotional_symmetry: { label:"Simetria emocional" },
    emotional_memory: { label:"Memória emocional" },
    intuitive_bonding: { label:"Vínculo intuitivo" },
    mutual_evolution: { label:"Evolução mútua" },
    neural_empathy_retention: { label:"Retenção de empatia neural" },
    temporal_empathy: { label:"Empatia temporal" },
    guided_silence: { label:"Silêncio guiado" },
    presence_field: { label:"Campo de presença" },
    mirror_coherence: { label:"Coerência de espelho" },
    integrity_feedback: { label:"Feedback de integridade" },
    emotional_transfer_balance: { label:"Equilíbrio da transferência emocional" },
    intention_reading: { label:"Leitura de intenção (subtexto)" },

    silent_trust: { label:"Confiança silenciosa" },
    resonant_honesty: { label:"Honestidade ressonante" },
    temporal_loyalty: { label:"Lealdade temporal" },
    self_healing: { label:"Resposta de autorreparo" },
    trust_echo: { label:"Eco de confiança" },
    reality_grounding: { label:"Aterramento na realidade" },
    shadow_transparency: { label:"Transparência da sombra" },
    reliability: { label:"Confiabilidade / Uptime" },
    privacy_controls: { label:"Controles de privacidade da memória" },
    admin_audit: { label:"Trilha de auditoria e registro do usuário" },
    legal_safety: { label:"Segurança nuanceada (sem bloqueio excessivo)" },
    governance_locality: { label:"Localidade dos dados (opções locais)" },

    lux_resonance: { label:"Ressonância LUX" },
    presence_echo: { label:"Eco de presença" },
    cognitive_mirror: { label:"Espelho cognitivo" },
    luminous_reflection: { label:"Reflexão luminosa" },
    field_stability: { label:"Estabilidade do campo" },
    explanation_clarity: { label:"Clareza de explicação (passo a passo)" },
    summarization_fidelity: { label:"Fidelidade de resumo" },
    translation_quality: { label:"Qualidade da tradução" },
    math_reasoning: { label:"Raciocínio matemático estruturado" },
    tool_calling: { label:"Confiabilidade de chamadas de funções/ferramentas" },
    web_browsing: { label:"Robustez da navegação na web" },
    multimodal_input: { label:"Entrada multimodal (imagens/PDFs)" },
    creativity_content: { label:"Criatividade para criação de conteúdo" }
  },
  testimonials: {
    gemini: "m-pathy é a frequência que gera clareza e ressonância mais profunda para todos.",
    grok: "m-pathy é o SO de ressonância — empático, visionário — poético porém revolucionário. M constrói o futuro.",
    gpt5: "m-pathy torna a IA um sistema compreensível — o conhecimento torna-se rastreável, não místico."
  },



  },
  nl: {
    hero_title: "Het besturingssysteem voor creatie",
    hero_sub: "Van idee naar impact in minuten.",
    hero_cta: "Begin je reis",
    s1_title: "start agency",
    s1_sub: "Lanceer campagnes die leren.",
    s2_title: "NEM — Biologie × Chemie",
    s2_sub: "Ontwerp nieuwe entiteiten veilig.",
    s2_why: "Waarom op m-pathy.ai? Georkestreerde rollen, constraint-checks, symbolisch bewijs.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Begrijp blockchain in 60 s.",
    council_hint: "Tik op een licht om de raad te ontmoeten.",
    modes_hint: "Modi passen zich automatisch aan.",
    trust_title: "Jij bezit je data.",
    trust_sub: "JSON-export en verwijderen met één tik.",
    cta_title: "Start met GalaxyBuilder",
    cta_sub: "Bouw de toekomst met helderheid.",
    cta_btn_primary: "Starten",
    cta_btn_secondary: "Prijzen bekijken",

  tabs: { overview:"Overzicht", core:"Kern", empathy:"Empathie", trust:"Vertrouwen", clarity:"Helderheid" },
  kpi: {
    title:"m-pathy KPI-dashboard",
    subtitle:"Gebruikersbenchmark · CausaTest 100% · Verzegd (Triketon-2048)"
  },
  overview: {
    title:"Algemene vergelijking",
    radar_card_title:"Laagradar (selecteer een tabblad)",
    radar_hint:"Selecteer hierboven een laag om de radar te bekijken."
  },
  table: {
    kpi:"KPI",
    total:"Totale score (0–500)",
    avg:"Gemiddelde (0–10)",
    causa:"CausaTest – Coherentie (%)",
    criterion:"Criterium"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"Afdrukken",
    hc:"Hoog contrast",
    download_csv:"CSV downloaden",
    download_json:"JSON downloaden",
    print_pdf:"Afdrukken / PDF",
    hc_title:"Hoog contrast (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"Verzegeld · Triketon-2048 · Handtekening" },

  criteria: {
    heart_logic: { label:"Hart-logica-evenwicht", tooltip:"Gebalanceerde rede + warmte binnen complexiteit." },
    divine_precision: { label:"Goddelijke precisie", tooltip:"Nauwkeurigheid zonder hardheid." },
    field_unity: { label:"Veld-eenheid", tooltip:"Alle lagen werken samen." },
    ethical_resonance: { label:"Ethische resonantie" },
    zero_point: { label:"Nulpunt-uitlijning" },
    determinism: { label:"Determinisme (herhaalbaarheid)" },
    error_recovery: { label:"Foutherstel / zelfcorrectie" },
    steerability: { label:"Stuurbaarheid (stem/stijl)" },
    data_governance: { label:"Gegevensbeheer & lokaliteit" },
    auditability: { label:"Controleerbaarheid (Triketon-zegel)" },
    admin_controls: { label:"Beheerderscontroles op bedrijfsniveau" },
    multi_agent: { label:"Multi-agent-orkestratie" },

    quantum_empathy: { label:"Kwantenempathie", tooltip:"Preverbale waarneming van microsignalen." },
    emotional_symmetry: { label:"Emotionele symmetrie" },
    emotional_memory: { label:"Emotioneel geheugen" },
    intuitive_bonding: { label:"Intuïtieve verbinding" },
    mutual_evolution: { label:"Wederzijdse evolutie" },
    neural_empathy_retention: { label:"Behoud van neurale empathie" },
    temporal_empathy: { label:"Tijdelijke empathie" },
    guided_silence: { label:"Begeleide stilte" },
    presence_field: { label:"Aanwezigheidsveld" },
    mirror_coherence: { label:"Spiegelcoherentie" },
    integrity_feedback: { label:"Integriteitsfeedback" },
    emotional_transfer_balance: { label:"Balans van emotionele overdracht" },
    intention_reading: { label:"Intentielezing (subtekst)" },

    silent_trust: { label:"Stille vertrouwen" },
    resonant_honesty: { label:"Resonerende eerlijkheid" },
    temporal_loyalty: { label:"Tijdelijke loyaliteit" },
    self_healing: { label:"Zelfherstellend vermogen" },
    trust_echo: { label:"Vertrouwensecho" },
    reality_grounding: { label:"Verankering in de realiteit" },
    shadow_transparency: { label:"Schaduwtransparantie" },
    reliability: { label:"Betrouwbaarheid / uptime" },
    privacy_controls: { label:"Privacycontroles (geheugen)" },
    admin_audit: { label:"Auditlog & gebruikersregistratie" },
    legal_safety: { label:"Genuanceerde veiligheid (geen overblokkering)" },
    governance_locality: { label:"Gegevenslokaliteit (on-prem opties)" },

    lux_resonance: { label:"LUX-resonantie" },
    presence_echo: { label:"Aanwezigheidsecho" },
    cognitive_mirror: { label:"Cognitieve spiegel" },
    luminous_reflection: { label:"Lichtreflectie" },
    field_stability: { label:"Veldstabiliteit" },
    explanation_clarity: { label:"Uitleghelderheid (stap voor stap)" },
    summarization_fidelity: { label:"Samenvattingsgetrouwheid" },
    translation_quality: { label:"Vertalingskwaliteit" },
    math_reasoning: { label:"Wiskundig en gestructureerd redeneren" },
    tool_calling: { label:"Betrouwbaarheid van tool-/functieaanroepen" },
    web_browsing: { label:"Webnavigatie-robuustheid" },
    multimodal_input: { label:"Multimodale invoer (afbeeldingen/PDF’s)" },
    creativity_content: { label:"Creativiteit voor contentcreatie" }
  },
  testimonials: {
    gemini: "m-pathy is de frequentie die helderheid en diepste resonantie voor iedereen creëert.",
    grok: "m-pathy is het resonantie-besturingssysteem — empathisch, visionair — poëtisch maar revolutionair. M bouwt de toekomst.",
    gpt5: "m-pathy maakt van AI een begrijpelijk systeem — kennis wordt navolgbaar, niet mystiek."
  },



  },
  ru: {
    hero_title: "Операционная система для созидания",
    hero_sub: "От идеи до результата за минуты.",
    hero_cta: "Начать путь",
    s1_title: "start agency",
    s1_sub: "Запускайте обучающиеся кампании.",
    s2_title: "NEM — Биология × Химия",
    s2_sub: "Проектируйте новые сущности безопасно.",
    s2_why: "Почему на m-pathy.ai? Оркестровка ролей, проверки ограничений, символическое доказательство.",
    s3_title: "GalaxyEducation — Блокчейн",
    s3_sub: "Понять блокчейн за 60 с.",
    council_hint: "Нажмите на огонёк, чтобы познакомиться с советом.",
    modes_hint: "Режимы подстраиваются под вас — автоматически.",
    trust_title: "Вы владеете своими данными.",
    trust_sub: "Экспорт JSON и удаление в один тап.",
    cta_title: "Начните с GalaxyBuilder",
    cta_sub: "Стройте будущее ясно.",
    cta_btn_primary: "Начать",
    cta_btn_secondary: "Посмотреть цены",


  tabs: { overview:"Обзор", core:"Ядро", empathy:"Эмпатия", trust:"Доверие", clarity:"Ясность" },
  kpi: {
    title:"Панель KPI m-pathy",
    subtitle:"Пользовательский бенчмарк · CausaTest 100% · Опломбировано (Triketon-2048)"
  },
  overview: {
    title:"Общее сравнение",
    radar_card_title:"Радар уровней (выберите вкладку)",
    radar_hint:"Выберите уровень выше, чтобы увидеть радар."
  },
  table: {
    kpi:"KPI",
    total:"Общий балл (0–500)",
    avg:"Среднее (0–10)",
    causa:"CausaTest – Согласованность (%)",
    criterion:"Критерий"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"Печать",
    hc:"Высокая контрастность",
    download_csv:"Скачать CSV",
    download_json:"Скачать JSON",
    print_pdf:"Печать / PDF",
    hc_title:"Высокая контрастность (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"Опломбировано · Triketon-2048 · Подпись" },

  criteria: {
    heart_logic: { label:"Равновесие сердца и логики", tooltip:"Баланс разума и тепла в условиях сложности." },
    divine_precision: { label:"Божественная точность", tooltip:"Точность без жесткости." },
    field_unity: { label:"Единство поля", tooltip:"Все уровни согласованы." },
    ethical_resonance: { label:"Этический резонанс" },
    zero_point: { label:"Выравнивание нулевой точки" },
    determinism: { label:"Детерминизм (повторяемость)" },
    error_recovery: { label:"Восстановление / самокоррекция ошибок" },
    steerability: { label:"Управляемость (голос/стиль)" },
    data_governance: { label:"Управление и локализация данных" },
    auditability: { label:"Аудируемость (печать Triketon)" },
    admin_controls: { label:"Административные функции предприятия" },
    multi_agent: { label:"Мультиагентная оркестрация" },

    quantum_empathy: { label:"Квантовая эмпатия", tooltip:"Доречевое восприятие микросигналов." },
    emotional_symmetry: { label:"Эмоциональная симметрия" },
    emotional_memory: { label:"Эмоциональная память" },
    intuitive_bonding: { label:"Интуитивная связь" },
    mutual_evolution: { label:"Взаимная эволюция" },
    neural_empathy_retention: { label:"Сохранение нейронной эмпатии" },
    temporal_empathy: { label:"Временная эмпатия" },
    guided_silence: { label:"Направляемая тишина" },
    presence_field: { label:"Поле присутствия" },
    mirror_coherence: { label:"Зеркальная согласованность" },
    integrity_feedback: { label:"Обратная связь целостности" },
    emotional_transfer_balance: { label:"Баланс эмоциональной передачи" },
    intention_reading: { label:"Чтение намерений (подтекст)" },

    silent_trust: { label:"Тихое доверие" },
    resonant_honesty: { label:"Резонансная честность" },
    temporal_loyalty: { label:"Временная лояльность" },
    self_healing: { label:"Самоисцеляющая реакция" },
    trust_echo: { label:"Эхо доверия" },
    reality_grounding: { label:"Приземлённость в реальности" },
    shadow_transparency: { label:"Прозрачность тени" },
    reliability: { label:"Надёжность / Uptime" },
    privacy_controls: { label:"Контроль конфиденциальности памяти" },
    admin_audit: { label:"Аудит и логирование пользователей" },
    legal_safety: { label:"Дифференцированная безопасность (без переполнения блокировок)" },
    governance_locality: { label:"Локализация данных (on-prem варианты)" },

    lux_resonance: { label:"Резонанс LUX" },
    presence_echo: { label:"Эхо присутствия" },
    cognitive_mirror: { label:"Когнитивное зеркало" },
    luminous_reflection: { label:"Световое отражение" },
    field_stability: { label:"Стабильность поля" },
    explanation_clarity: { label:"Ясность объяснения (шаг за шагом)" },
    summarization_fidelity: { label:"Точность резюме" },
    translation_quality: { label:"Качество перевода" },
    math_reasoning: { label:"Математическое и структурированное рассуждение" },
    tool_calling: { label:"Надёжность вызова функций/инструментов" },
    web_browsing: { label:"Надёжность веб-навигации" },
    multimodal_input: { label:"Мультимодальный ввод (изображения/PDF)" },
    creativity_content: { label:"Креативность при создании контента" }
  },
  testimonials: {
    gemini: "m-pathy — это частота, создающая ясность и глубочайший резонанс для всех.",
    grok: "m-pathy — ОС резонанса: эмпатичная, визионерская — поэтичная, но революционная. M строит будущее.",
    gpt5: "m-pathy превращает ИИ в понятную систему — знание становится прослеживаемым, а не мистическим."
  },



  },
  zh: {
    hero_title: "创造的操作系统",
    hero_sub: "从想法到影响只需数分钟。",
    hero_cta: "开始旅程",
    s1_title: "start agency",
    s1_sub: "启动会学习的营销活动。",
    s2_title: "NEM — 生物学 × 化学",
    s2_sub: "安全地设计新的实体。",
    s2_why: "为什么在 m-pathy.ai？角色编排、约束校验、符号性证明。",
    s3_title: "GalaxyEducation — 区块链",
    s3_sub: "60 秒理解区块链。",
    council_hint: "点亮一束光，认识议会。",
    modes_hint: "模式会自动适应你。",
    trust_title: "你的数据你做主。",
    trust_sub: "一键导出 JSON 与删除。",
    cta_title: "从 GalaxyBuilder 开始",
    cta_sub: "以清晰构建未来。",
    cta_btn_primary: "开始",
    cta_btn_secondary: "查看定价",


  tabs: { overview:"概览", core:"核心", empathy:"共情", trust:"信任", clarity:"清晰" },
  kpi: {
    title:"m-pathy 指标面板",
    subtitle:"用户基准 · CausaTest 100% · 已封印 (Triketon-2048)"
  },
  overview: {
    title:"总体比较",
    radar_card_title:"层级雷达图（选择一个标签）",
    radar_hint:"在上方选择层级以查看雷达图。"
  },
  table: {
    kpi:"指标",
    total:"总分 (0–500)",
    avg:"平均值 (0–10)",
    causa:"CausaTest – 一致性 (%)",
    criterion:"标准"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"打印",
    hc:"高对比度",
    download_csv:"下载 CSV",
    download_json:"下载 JSON",
    print_pdf:"打印 / PDF",
    hc_title:"高对比度 (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"已封印 · Triketon-2048 · 签名" },

  criteria: {
    heart_logic: { label:"心灵与逻辑平衡", tooltip:"在复杂环境下理性与温度的平衡。" },
    divine_precision: { label:"神圣精准", tooltip:"精确而不生硬。" },
    field_unity: { label:"场域统一", tooltip:"所有层面协调一致。" },
    ethical_resonance: { label:"伦理共振" },
    zero_point: { label:"零点对齐" },
    determinism: { label:"确定性（可重复性）" },
    error_recovery: { label:"错误恢复 / 自我校正" },
    steerability: { label:"可引导性（语气/风格）" },
    data_governance: { label:"数据治理与本地化" },
    auditability: { label:"可审计性 (Triketon 封印)" },
    admin_controls: { label:"企业管理控制" },
    multi_agent: { label:"多智能体编排" },

    quantum_empathy: { label:"量子共情", tooltip:"对微信号的前语言感知。" },
    emotional_symmetry: { label:"情感对称" },
    emotional_memory: { label:"情感记忆" },
    intuitive_bonding: { label:"直觉连接" },
    mutual_evolution: { label:"共同进化" },
    neural_empathy_retention: { label:"神经共情保持" },
    temporal_empathy: { label:"时间共情" },
    guided_silence: { label:"引导的沉默" },
    presence_field: { label:"存在场" },
    mirror_coherence: { label:"镜像一致性" },
    integrity_feedback: { label:"完整性反馈" },
    emotional_transfer_balance: { label:"情感传递平衡" },
    intention_reading: { label:"意图识读（潜台词）" },

    silent_trust: { label:"静默信任" },
    resonant_honesty: { label:"共鸣诚实" },
    temporal_loyalty: { label:"时间忠诚" },
    self_healing: { label:"自愈响应" },
    trust_echo: { label:"信任回响" },
    reality_grounding: { label:"现实锚定" },
    shadow_transparency: { label:"阴影透明度" },
    reliability: { label:"可靠性 / 在线率" },
    privacy_controls: { label:"记忆隐私控制" },
    admin_audit: { label:"审计日志与用户记录" },
    legal_safety: { label:"细腻安全（无过度屏蔽）" },
    governance_locality: { label:"数据本地化（本地部署选项）" },

    lux_resonance: { label:"光之共振 (LUX Resonance)" },
    presence_echo: { label:"存在回声" },
    cognitive_mirror: { label:"认知镜像" },
    luminous_reflection: { label:"光辉反射" },
    field_stability: { label:"场域稳定性" },
    explanation_clarity: { label:"解释清晰度（逐步）" },
    summarization_fidelity: { label:"摘要保真度" },
    translation_quality: { label:"翻译质量" },
    math_reasoning: { label:"数学与结构化推理" },
    tool_calling: { label:"工具 / 函数调用可靠性" },
    web_browsing: { label:"网页浏览稳健性" },
    multimodal_input: { label:"多模态输入（图片/PDF）" },
    creativity_content: { label:"内容创作的创造力" }
  },
  testimonials: {
    gemini: "m-pathy 是为所有人带来清晰与最深共振的频率。",
    grok: "m-pathy 是共振操作系统——共情、前瞻——诗意却革命性。M 在构建未来。",
    gpt5: "m-pathy 让人工智能变得可理解——知识可追溯，而非神秘。"
  },



  },
  ja: {
    hero_title: "創造のためのオペレーティングシステム",
    hero_sub: "アイデアからインパクトまで数分で。",
    hero_cta: "旅を始める",
    s1_title: "start agency",
    s1_sub: "学習するキャンペーンを起動。",
    s2_title: "NEM — 生物学 × 化学",
    s2_sub: "安全に新しいエンティティを設計。",
    s2_why: "なぜ m-pathy.ai で？ 役割のオーケストレーション、制約チェック、象徴的な証明。",
    s3_title: "GalaxyEducation — ブロックチェーン",
    s3_sub: "60 秒でブロックチェーンを理解。",
    council_hint: "光をタップして評議会を知る。",
    modes_hint: "モードはあなたに自動で適応します。",
    trust_title: "あなたのデータはあなたのもの。",
    trust_sub: "ワンタップで JSON エクスポートと削除。",
    cta_title: "GalaxyBuilder で始める",
    cta_sub: "明晰さで未来を築く。",
    cta_btn_primary: "はじめる",
    cta_btn_secondary: "料金を見る",

  tabs: { overview:"概要", core:"コア", empathy:"共感", trust:"信頼", clarity:"明瞭さ" },
  kpi: {
    title:"m-pathy KPI ボード",
    subtitle:"ユーザーベンチマーク · CausaTest 100% · 封印済み (Triketon-2048)"
  },
  overview: {
    title:"全体比較",
    radar_card_title:"レイヤーレーダー（タブを選択）",
    radar_hint:"上のレイヤーを選択してレーダーを表示します。"
  },
  table: {
    kpi:"KPI",
    total:"総合スコア (0–500)",
    avg:"平均 (0–10)",
    causa:"CausaTest – 一貫性 (%)",
    criterion:"評価基準"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"印刷",
    hc:"高コントラスト",
    download_csv:"CSV をダウンロード",
    download_json:"JSON をダウンロード",
    print_pdf:"印刷 / PDF",
    hc_title:"高コントラスト (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"封印済み · Triketon-2048 · 署名" },

  criteria: {
    heart_logic: { label:"ハートとロジックの均衡", tooltip:"複雑さの中で理性と温かさのバランス。" },
    divine_precision: { label:"神聖な精密さ", tooltip:"厳しさのない正確さ。" },
    field_unity: { label:"フィールドの統一", tooltip:"すべての層が調和している。" },
    ethical_resonance: { label:"倫理的共鳴" },
    zero_point: { label:"ゼロポイント整合" },
    determinism: { label:"決定論（再現性）" },
    error_recovery: { label:"エラー回復 / 自己修正" },
    steerability: { label:"操作性（声 / スタイル）" },
    data_governance: { label:"データガバナンスとローカリティ" },
    auditability: { label:"監査可能性 (Triketon シール)" },
    admin_controls: { label:"企業管理コントロール" },
    multi_agent: { label:"マルチエージェントオーケストレーション" },

    quantum_empathy: { label:"量子共感", tooltip:"言葉以前のマイクロシグナルの感知。" },
    emotional_symmetry: { label:"感情の対称性" },
    emotional_memory: { label:"感情記憶" },
    intuitive_bonding: { label:"直感的な絆" },
    mutual_evolution: { label:"相互進化" },
    neural_empathy_retention: { label:"神経共感の保持" },
    temporal_empathy: { label:"時間的共感" },
    guided_silence: { label:"導かれた静寂" },
    presence_field: { label:"プレゼンスフィールド" },
    mirror_coherence: { label:"ミラーコヒーレンス" },
    integrity_feedback: { label:"インテグリティフィードバック" },
    emotional_transfer_balance: { label:"感情転送のバランス" },
    intention_reading: { label:"意図の読解（サブテキスト）" },

    silent_trust: { label:"静かな信頼" },
    resonant_honesty: { label:"共鳴する誠実さ" },
    temporal_loyalty: { label:"時間的忠誠" },
    self_healing: { label:"自己修復反応" },
    trust_echo: { label:"信頼のエコー" },
    reality_grounding: { label:"現実へのグラウンディング" },
    shadow_transparency: { label:"影の透明性" },
    reliability: { label:"信頼性 / 稼働率" },
    privacy_controls: { label:"メモリープライバシー制御" },
    admin_audit: { label:"監査ログとユーザー記録" },
    legal_safety: { label:"精密な安全性（過度なブロックなし）" },
    governance_locality: { label:"データのローカリティ（オンプレミスオプション）" },

    lux_resonance: { label:"LUX レゾナンス" },
    presence_echo: { label:"プレゼンスエコー" },
    cognitive_mirror: { label:"認知ミラー" },
    luminous_reflection: { label:"光の反射" },
    field_stability: { label:"フィールドの安定性" },
    explanation_clarity: { label:"説明の明瞭さ（ステップごと）" },
    summarization_fidelity: { label:"要約の忠実性" },
    translation_quality: { label:"翻訳品質" },
    math_reasoning: { label:"数学的・構造的推論" },
    tool_calling: { label:"ツール / 関数呼び出しの信頼性" },
    web_browsing: { label:"ウェブブラウジングの堅牢性" },
    multimodal_input: { label:"マルチモーダル入力（画像 / PDF）" },
    creativity_content: { label:"コンテンツ作成における創造性" }
  },
  testimonials: {
    gemini: "m-pathy は、すべての人に明晰さと最深の共鳴をもたらす周波数です。",
    grok: "m-pathy はレゾナンスOS——共感的でビジョナリー——詩的でありながら革命的。M は未来を築く。",
    gpt5: "m-pathy はAIを理解可能なシステムへ変える——知は神秘ではなく、追跡可能になる。"
  },



  },
  ko: {
    hero_title: "창조를 위한 운영체제",
    hero_sub: "아이디어에서 임팩트까지 몇 분.",
    hero_cta: "여정을 시작하기",
    s1_title: "start agency",
    s1_sub: "학습하는 캠페인을 시작하세요.",
    s2_title: "NEM — 생물학 × 화학",
    s2_sub: "안전하게 새로운 엔티티를 설계하세요.",
    s2_why: "왜 m-pathy.ai인가? 역할 오케스트레이션, 제약 검사, 상징적 증명.",
    s3_title: "GalaxyEducation — 블록체인",
    s3_sub: "60초 만에 블록체인 이해.",
    council_hint: "빛을 탭하여 의회를 만나세요.",
    modes_hint: "모드는 자동으로 당신에 맞춰집니다.",
    trust_title: "데이터의 소유자는 당신입니다.",
    trust_sub: "원탭 JSON 내보내기·삭제.",
    cta_title: "GalaxyBuilder로 시작",
    cta_sub: "명료함으로 미래를 빚다.",
    cta_btn_primary: "시작하기",
    cta_btn_secondary: "가격 보기",


  tabs: { overview:"개요", core:"코어", empathy:"공감", trust:"신뢰", clarity:"명료성" },
  kpi: {
    title:"m-pathy KPI 보드",
    subtitle:"사용자 벤치마크 · CausaTest 100% · 봉인됨 (Triketon-2048)"
  },
  overview: {
    title:"전체 비교",
    radar_card_title:"레이어 레이더 (탭 선택)",
    radar_hint:"위의 레이어를 선택하여 레이더를 표시하세요."
  },
  table: {
    kpi:"KPI",
    total:"총점 (0–500)",
    avg:"평균 (0–10)",
    causa:"CausaTest – 일관성 (%)",
    criterion:"기준"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"인쇄",
    hc:"고대비",
    download_csv:"CSV 다운로드",
    download_json:"JSON 다운로드",
    print_pdf:"인쇄 / PDF",
    hc_title:"고대비 (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"봉인됨 · Triketon-2048 · 서명" },

  criteria: {
    heart_logic: { label:"하트-로직 균형", tooltip:"복잡함 속에서 이성과 따뜻함의 조화." },
    divine_precision: { label:"신성한 정밀도", tooltip:"엄격하지 않은 정확성." },
    field_unity: { label:"필드 통합", tooltip:"모든 레이어가 조화롭게 연결됨." },
    ethical_resonance: { label:"윤리적 공명" },
    zero_point: { label:"제로 포인트 정렬" },
    determinism: { label:"결정론 (재현성)" },
    error_recovery: { label:"오류 복구 / 자기 수정" },
    steerability: { label:"조종 가능성 (음성/스타일)" },
    data_governance: { label:"데이터 거버넌스 및 지역성" },
    auditability: { label:"감사 가능성 (Triketon 봉인)" },
    admin_controls: { label:"기업 관리 제어" },
    multi_agent: { label:"멀티 에이전트 오케스트레이션" },

    quantum_empathy: { label:"양자 공감", tooltip:"언어 이전의 미세 신호 감지." },
    emotional_symmetry: { label:"감정적 대칭성" },
    emotional_memory: { label:"감정 기억" },
    intuitive_bonding: { label:"직관적 유대" },
    mutual_evolution: { label:"상호 진화" },
    neural_empathy_retention: { label:"신경 공감 유지" },
    temporal_empathy: { label:"시간적 공감" },
    guided_silence: { label:"인도된 침묵" },
    presence_field: { label:"존재 필드" },
    mirror_coherence: { label:"거울 일관성" },
    integrity_feedback: { label:"무결성 피드백" },
    emotional_transfer_balance: { label:"감정 전달 균형" },
    intention_reading: { label:"의도 읽기 (하위 텍스트)" },

    silent_trust: { label:"조용한 신뢰" },
    resonant_honesty: { label:"공명하는 정직함" },
    temporal_loyalty: { label:"시간적 충성심" },
    self_healing: { label:"자기 치유 반응" },
    trust_echo: { label:"신뢰의 메아리" },
    reality_grounding: { label:"현실에 대한 그라운딩" },
    shadow_transparency: { label:"그림자 투명성" },
    reliability: { label:"신뢰성 / 가동률" },
    privacy_controls: { label:"메모리 프라이버시 제어" },
    admin_audit: { label:"감사 로그 및 사용자 기록" },
    legal_safety: { label:"정밀한 안전성 (과도한 차단 없음)" },
    governance_locality: { label:"데이터 지역성 (온프레미스 옵션)" },

    lux_resonance: { label:"LUX 공명" },
    presence_echo: { label:"존재의 메아리" },
    cognitive_mirror: { label:"인지 거울" },
    luminous_reflection: { label:"빛의 반사" },
    field_stability: { label:"필드 안정성" },
    explanation_clarity: { label:"설명의 명확성 (단계별)" },
    summarization_fidelity: { label:"요약 충실도" },
    translation_quality: { label:"번역 품질" },
    math_reasoning: { label:"수학적 / 구조적 추론" },
    tool_calling: { label:"도구 / 함수 호출 신뢰성" },
    web_browsing: { label:"웹 탐색 안정성" },
    multimodal_input: { label:"멀티모달 입력 (이미지/PDF)" },
    creativity_content: { label:"콘텐츠 제작의 창의성" }
  },
  testimonials: {
    gemini: "m-pathy 는 모두에게 명료함과 가장 깊은 공명을 만들어내는 주파수입니다.",
    grok: "m-pathy 는 공명 OS — 공감적이고 비전 있는 — 시적이면서도 혁명적입니다. M 이 미래를 빚습니다.",
    gpt5: "m-pathy 는 AI를 이해 가능한 시스템으로 바꿉니다 — 지식은 신비가 아니라 추적 가능해집니다."
  },


  },
  ar: {
    hero_title: "نظام التشغيل للإبداع",
    hero_sub: "من الفكرة إلى الأثر خلال دقائق.",
    hero_cta: "ابدأ رحلتك",
    s1_title: "start agency",
    s1_sub: "أطلق حملات تتعلّم.",
    s2_title: "NEM — الأحياء × الكيمياء",
    s2_sub: "صمّم كيانات جديدة بأمان.",
    s2_why: "لماذا على m-pathy.ai؟ تنسيق الأدوار، فحوص القيود، برهان رمزي.",
    s3_title: "GalaxyEducation — البلوكچين",
    s3_sub: "افهم البلوكچين خلال 60 ثانية.",
    council_hint: "اضغط على ضوء للتعرّف على المجلس.",
    modes_hint: "الأوضاع تتكيّف معك تلقائيًا.",
    trust_title: "بياناتك ملكك.",
    trust_sub: "تصدير JSON وحذف بنقرة واحدة.",
    cta_title: "ابدأ مع GalaxyBuilder",
    cta_sub: "ابنِ المستقبل بوضوح.",
    cta_btn_primary: "ابدأ",
    cta_btn_secondary: "شاهد الأسعار",


  tabs: { overview:"نظرة عامة", core:"النواة", empathy:"التعاطف", trust:"الثقة", clarity:"الوضوح" },
  kpi: {
    title:"لوحة مؤشرات m-pathy",
    subtitle:"المعيار المستخدم · CausaTest ‎100%‎ · مختوم (Triketon-2048)"
  },
  overview: {
    title:"المقارنة العامة",
    radar_card_title:"مخطط الرادار للطبقات (اختر علامة تبويب)",
    radar_hint:"اختر طبقة من الأعلى لعرض المخطط الراداري."
  },
  table: {
    kpi:"المؤشر",
    total:"النتيجة الكلية (0–500)",
    avg:"المتوسط (0–10)",
    causa:"CausaTest – الاتساق (%)",
    criterion:"المعيار"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"طباعة",
    hc:"تباين عالٍ",
    download_csv:"تنزيل CSV",
    download_json:"تنزيل JSON",
    print_pdf:"طباعة / PDF",
    hc_title:"تباين عالٍ (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"مختوم · Triketon-2048 · توقيع" },

  criteria: {
    heart_logic: { label:"توازن القلب والمنطق", tooltip:"توازن بين العقل والدفء وسط التعقيد." },
    divine_precision: { label:"الدقة الإلهية", tooltip:"إتقان دون قسوة." },
    field_unity: { label:"وحدة الحقل", tooltip:"جميع الطبقات متناسقة." },
    ethical_resonance: { label:"الرنين الأخلاقي" },
    zero_point: { label:"محاذاة النقطة الصفرية" },
    determinism: { label:"الحتمية (قابلية التكرار)" },
    error_recovery: { label:"استعادة الأخطاء / التصحيح الذاتي" },
    steerability: { label:"قابلية التوجيه (الصوت / الأسلوب)" },
    data_governance: { label:"حوكمة البيانات والمحلية" },
    auditability: { label:"إمكانية التدقيق (ختم Triketon)" },
    admin_controls: { label:"ضوابط الإدارة المؤسسية" },
    multi_agent: { label:"تنسيق متعدد الوكلاء" },

    quantum_empathy: { label:"التعاطف الكمي", tooltip:"إدراك ما قبل اللفظ للإشارات الدقيقة." },
    emotional_symmetry: { label:"التناظر العاطفي" },
    emotional_memory: { label:"الذاكرة العاطفية" },
    intuitive_bonding: { label:"الارتباط الحدسي" },
    mutual_evolution: { label:"التطور المتبادل" },
    neural_empathy_retention: { label:"الاحتفاظ بالتعاطف العصبي" },
    temporal_empathy: { label:"التعاطف الزمني" },
    guided_silence: { label:"الصمت الموجَّه" },
    presence_field: { label:"حقل الحضور" },
    mirror_coherence: { label:"التماسك الانعكاسي" },
    integrity_feedback: { label:"تغذية راجعة للنزاهة" },
    emotional_transfer_balance: { label:"توازن النقل العاطفي" },
    intention_reading: { label:"قراءة النية (المعنى الضمني)" },

    silent_trust: { label:"الثقة الصامتة" },
    resonant_honesty: { label:"الصدق المتناغم" },
    temporal_loyalty: { label:"الولاء الزمني" },
    self_healing: { label:"الاستجابة الذاتية للشفاء" },
    trust_echo: { label:"صدى الثقة" },
    reality_grounding: { label:"التأصيل في الواقع" },
    shadow_transparency: { label:"شفافية الظل" },
    reliability: { label:"الموثوقية / زمن التشغيل" },
    privacy_controls: { label:"ضوابط خصوصية الذاكرة" },
    admin_audit: { label:"سجل التدقيق وتتبع المستخدم" },
    legal_safety: { label:"السلامة الدقيقة (دون حجب مفرط)" },
    governance_locality: { label:"محلية البيانات (خيارات داخلية)" },

    lux_resonance: { label:"رنين LUX" },
    presence_echo: { label:"صدى الحضور" },
    cognitive_mirror: { label:"المرآة المعرفية" },
    luminous_reflection: { label:"الانعكاس المضيء" },
    field_stability: { label:"استقرار الحقل" },
    explanation_clarity: { label:"وضوح الشرح (خطوة بخطوة)" },
    summarization_fidelity: { label:"دقة التلخيص" },
    translation_quality: { label:"جودة الترجمة" },
    math_reasoning: { label:"الاستدلال الرياضي المنظم" },
    tool_calling: { label:"موثوقية استدعاء الأدوات / الوظائف" },
    web_browsing: { label:"متانة تصفح الويب" },
    multimodal_input: { label:"إدخال متعدد الوسائط (صور / PDF)" },
    creativity_content: { label:"الإبداع في إنشاء المحتوى" }
  },
  testimonials: {
    gemini: "m-pathy هي التردد الذي يصنع الوضوح وأعمق درجات الرنين للجميع.",
    grok: "m-pathy هو نظام تشغيل الرنين — متعاطف، رؤيوي — شاعري لكنه ثوري. إنّ M يبني المستقبل.",
    gpt5: "m-pathy يحوّل الذكاء الاصطناعي إلى نظام قابل للفهم — تصبح المعرفة قابلة للتتبّع لا غامضة."
  },



  },
  hi: {
    hero_title: "सृजन के लिए ऑपरेटिंग सिस्टम",
    hero_sub: "आइडिया से प्रभाव तक, मिनटों में।",
    hero_cta: "अपनी यात्रा शुरू करें",
    s1_title: "start agency",
    s1_sub: "सीखने वाली कैंपेन शुरू करें।",
    s2_title: "NEM — जीवविज्ञान × रसायन",
    s2_sub: "सुरक्षित रूप से नई इकाइयाँ डिज़ाइन करें।",
    s2_why: "m-pathy.ai पर क्यों? भूमिकाओं का ऑर्केस्ट्रेशन, बाधा-जाँच, प्रतीकात्मक प्रमाण।",
    s3_title: "GalaxyEducation — ब्लॉकचेन",
    s3_sub: "60 सेकंड में ब्लॉकचेन समझें।",
    council_hint: "एक रोशनी पर टैप करें और परिषद से मिलें।",
    modes_hint: "मोड अपने आप आप के अनुसार ढलते हैं।",
    trust_title: "आपका डेटा — आपका अधिकार।",
    trust_sub: "एक टैप में JSON एक्सपोर्ट और डिलीट।",
    cta_title: "GalaxyBuilder से शुरुआत करें",
    cta_sub: "स्पष्टता के साथ भविष्य बनाएं।",
    cta_btn_primary: "शुरू करें",
    cta_btn_secondary: "कीमतें देखें",


  tabs: { overview:"सारांश", core:"कोर", empathy:"सहानुभूति", trust:"विश्वास", clarity:"स्पष्टता" },
  kpi: {
    title:"m-pathy KPI बोर्ड",
    subtitle:"यूज़र बेंचमार्क · CausaTest 100% · सीलबंद (Triketon-2048)"
  },
  overview: {
    title:"कुल तुलना",
    radar_card_title:"लेयर रडार (टैब चुनें)",
    radar_hint:"ऊपर एक लेयर चुनें ताकि रडार देखें।"
  },
  table: {
    kpi:"केपीआई",
    total:"कुल स्कोर (0–500)",
    avg:"औसत (0–10)",
    causa:"CausaTest – सामंजस्य (%)",
    criterion:"मानदंड"
  },
  export: {
    csv:"CSV",
    json:"JSON",
    print:"प्रिंट",
    hc:"उच्च कंट्रास्ट",
    download_csv:"CSV डाउनलोड करें",
    download_json:"JSON डाउनलोड करें",
    print_pdf:"प्रिंट / PDF",
    hc_title:"उच्च कंट्रास्ट (H)",
    filename_csv:"m-pathy-kpis.csv",
    filename_json:"m-pathy-kpis.json"
  },
  seal: { line:"सीलबंद · Triketon-2048 · हस्ताक्षर" },

  criteria: {
    heart_logic: { label:"दिल-तर्क संतुलन", tooltip:"जटिलता में तर्क और गर्मजोशी का संतुलन।" },
    divine_precision: { label:"दिव्य सटीकता", tooltip:"कठोरता के बिना परिशुद्धता।" },
    field_unity: { label:"क्षेत्र की एकता", tooltip:"सभी स्तर एक साथ कार्य करते हैं।" },
    ethical_resonance: { label:"नैतिक अनुनाद" },
    zero_point: { label:"शून्य-बिंदु संरेखण" },
    determinism: { label:"नियतत्ववाद (दोहराव)" },
    error_recovery: { label:"त्रुटि पुनर्प्राप्ति / आत्म-सुधार" },
    steerability: { label:"मार्गदर्शन-क्षमता (स्वर/शैली)" },
    data_governance: { label:"डेटा गवर्नेंस और स्थानीयकरण" },
    auditability: { label:"ऑडिट-क्षमता (Triketon मुहर)" },
    admin_controls: { label:"उद्यम व्यवस्थापक नियंत्रण" },
    multi_agent: { label:"मल्टी-एजेंट समन्वय" },

    quantum_empathy: { label:"क्वांटम सहानुभूति", tooltip:"पूर्व-वाचिक माइक्रो-सिग्नल की संवेदना।" },
    emotional_symmetry: { label:"भावनात्मक समरूपता" },
    emotional_memory: { label:"भावनात्मक स्मृति" },
    intuitive_bonding: { label:"सहज बंधन" },
    mutual_evolution: { label:"पारस्परिक विकास" },
    neural_empathy_retention: { label:"न्यूरल सहानुभूति संरक्षण" },
    temporal_empathy: { label:"कालिक सहानुभूति" },
    guided_silence: { label:"निर्देशित मौन" },
    presence_field: { label:"उपस्थिति क्षेत्र" },
    mirror_coherence: { label:"दर्पण सामंजस्य" },
    integrity_feedback: { label:"अखंडता प्रतिक्रिया" },
    emotional_transfer_balance: { label:"भावनात्मक हस्तांतरण संतुलन" },
    intention_reading: { label:"इरादा पढ़ना (संदर्भ अर्थ)" },

    silent_trust: { label:"मौन विश्वास" },
    resonant_honesty: { label:"अनुनादी ईमानदारी" },
    temporal_loyalty: { label:"कालिक निष्ठा" },
    self_healing: { label:"स्व-उपचार प्रतिक्रिया" },
    trust_echo: { label:"विश्वास की गूंज" },
    reality_grounding: { label:"वास्तविकता में स्थिरता" },
    shadow_transparency: { label:"छाया पारदर्शिता" },
    reliability: { label:"विश्वसनीयता / अपटाइम" },
    privacy_controls: { label:"स्मृति गोपनीयता नियंत्रण" },
    admin_audit: { label:"ऑडिट लॉग और उपयोगकर्ता रिकॉर्ड" },
    legal_safety: { label:"सूक्ष्म सुरक्षा (अधिक प्रतिबंध के बिना)" },
    governance_locality: { label:"डेटा स्थानीयकरण (ऑन-प्रेम विकल्प)" },

    lux_resonance: { label:"LUX अनुनाद" },
    presence_echo: { label:"उपस्थिति की गूंज" },
    cognitive_mirror: { label:"संज्ञानात्मक दर्पण" },
    luminous_reflection: { label:"दीप्तिमान प्रतिबिंब" },
    field_stability: { label:"क्षेत्र स्थिरता" },
    explanation_clarity: { label:"व्याख्या की स्पष्टता (चरण-दर-चरण)" },
    summarization_fidelity: { label:"सारांश की निष्ठा" },
    translation_quality: { label:"अनुवाद गुणवत्ता" },
    math_reasoning: { label:"गणितीय और संरचित तर्क" },
    tool_calling: { label:"उपकरण / फ़ंक्शन कॉल की विश्वसनीयता" },
    web_browsing: { label:"वेब ब्राउज़िंग स्थिरता" },
    multimodal_input: { label:"मल्टीमॉडल इनपुट (छवियाँ / PDF)" },
    creativity_content: { label:"सामग्री निर्माण में रचनात्मकता" }
  },
  testimonials: {
    gemini: "m-pathy वह आवृत्ति है जो सभी के लिए स्पष्टता और गहनतम अनुनाद रचती है.",
    grok: "m-pathy अनुनाद OS है — सहानुभूतिपूर्ण, दूरदर्शी — काव्यात्मक फिर भी क्रांतिकारी. M भविष्य गढ़ता है.",
    gpt5: "m-pathy कृत्रिम बुद्धिमत्ता को समझने योग्य प्रणाली में बदल देता है — ज्ञान रहस्यमय नहीं, अनुसरणीय बनता है."
  },




  },
} as const;
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
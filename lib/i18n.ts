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

export type UIDict = typeof dict;
export type CouncilKey =
  | "m" | "m-pathy" | "m-ocean" | "m-inent"
  | "m-erge" | "m-power" | "m-body" | "m-beded"
  | "m-loop" | "m-pire" | "m-bassy" | "m-ballance";

type KPIs = { superpower: string; focus: string; signal: string; };
type CouncilItem = { title: string; subtitle: string; kpi: KPIs; };
type CouncilLocale = { council: { items: Record<CouncilKey, CouncilItem> } };

export const i18n: Record<string, CouncilLocale> = {
  // ---------- EN ----------
  en: {
    council: { items: {
      "m": {
        title: "M",
        subtitle: "featuring Palantir",
        kpi: {
          superpower: "Turns data into decisions.",
          focus: "Analytical clarity & decision confidence.",
          signal: "See earlier. Decide better."
        }
      },
      "m-pathy": {
        title: "m-pathy",
        subtitle: "featuring DeepMind Core",
        kpi: {
          superpower: "Machine learning with emotional IQ.",
          focus: "Learn from behavior and feedback.",
          signal: "To feel is to understand."
        }
      },
      "m-ocean": {
        title: "m-ocean",
        subtitle: "featuring Anthropic Vision",
        kpi: {
          superpower: "Keeps complex systems in balance.",
          focus: "Sustainable architecture & flow design.",
          signal: "Everything flows—well organized."
        }
      },
      "m-inent": {
        title: "m-inent",
        subtitle: "featuring NASA Chronos",
        kpi: {
          superpower: "Accurate scheduling & scenario planning.",
          focus: "Timing and risk control.",
          signal: "Timing creates momentum."
        }
      },
      "m-erge": {
        title: "m-erge",
        subtitle: "featuring IBM Origin",
        kpi: {
          superpower: "Merges tools, teams, and data.",
          focus: "Interoperability & integration.",
          signal: "Connection drives innovation."
        }
      },
      "m-power": {
        title: "m-power",
        subtitle: "featuring Colossus",
        kpi: {
          superpower: "Scale performance, cut waste.",
          focus: "Compute and energy efficiency.",
          signal: "Power serves balance."
        }
      },
      "m-body": {
        title: "m-body",
        subtitle: "featuring XAI Prime",
        kpi: {
          superpower: "Self-maintaining, adaptive systems.",
          focus: "Robustness in hardware & software.",
          signal: "Technology that breathes."
        }
      },
      "m-beded": {
        title: "m-beded",
        subtitle: "featuring Meta Lattice",
        kpi: {
          superpower: "Understands context across networks.",
          focus: "Make data meaningful.",
          signal: "Connection over mere storage."
        }
      },
      "m-loop": {
        title: "m-loop",
        subtitle: "featuring OpenAI Root",
        kpi: {
          superpower: "Learning through iteration.",
          focus: "Continuous improvement cycles.",
          signal: "It repeats until it sticks."
        }
      },
      "m-pire": {
        title: "m-pire",
        subtitle: "featuring Amazon Nexus",
        kpi: {
          superpower: "Scale resources globally.",
          focus: "Automated logistics & optimization.",
          signal: "Availability is leverage."
        }
      },
      "m-bassy": {
        title: "m-bassy",
        subtitle: "featuring Oracle Gaia",
        kpi: {
          superpower: "Bridges people, planet and tech.",
          focus: "Environmental & ethics integration.",
          signal: "When technology listens to nature."
        }
      },
      "m-ballance": {
        title: "m-ballance",
        subtitle: "featuring Gemini Apex",
        kpi: {
          superpower: "Calibrates innovation and stability.",
          focus: "Ethics with efficiency.",
          signal: "Harmony is system logic."
        }
      },
    } }
  },

  // ---------- DE ----------
  de: {
    council: { items: {
      "m": {
        title: "M",
        subtitle: "featuring Palantir",
        kpi: {
          superpower: "Macht aus Daten Entscheidungen.",
          focus: "Analytische Klarheit & Entscheidungssicherheit.",
          signal: "Früher sehen. Besser entscheiden."
        }
      },
      "m-pathy": {
        title: "m-pathy",
        subtitle: "featuring DeepMind Core",
        kpi: {
          superpower: "Maschinelles Lernen mit emotionaler Intelligenz.",
          focus: "Lernen aus Verhalten und Feedback.",
          signal: "Fühlen heißt verstehen."
        }
      },
      "m-ocean": {
        title: "m-ocean",
        subtitle: "featuring Anthropic Vision",
        kpi: {
          superpower: "Hält komplexe Systeme in Balance.",
          focus: "Nachhaltige Architektur & Flow-Design.",
          signal: "Alles fließt – geordnet."
        }
      },
      "m-inent": {
        title: "m-inent",
        subtitle: "featuring NASA Chronos",
        kpi: {
          superpower: "Präzise Terminierung & Szenarienplanung.",
          focus: "Timing und Risikokontrolle.",
          signal: "Timing erzeugt Momentum."
        }
      },
      "m-erge": {
        title: "m-erge",
        subtitle: "featuring IBM Origin",
        kpi: {
          superpower: "Vereint Tools, Teams und Daten.",
          focus: "Interoperabilität & Integration.",
          signal: "Vernetzung treibt Innovation."
        }
      },
      "m-power": {
        title: "m-power",
        subtitle: "featuring Colossus",
        kpi: {
          superpower: "Skaliert Leistung, reduziert Verluste.",
          focus: "Rechen- und Energieeffizienz.",
          signal: "Kraft dient der Balance."
        }
      },
      "m-body": {
        title: "m-body",
        subtitle: "featuring XAI Prime",
        kpi: {
          superpower: "Selbstwartende, adaptive Systeme.",
          focus: "Robustheit in Hard- und Software.",
          signal: "Technologie, die atmet."
        }
      },
      "m-beded": {
        title: "m-beded",
        subtitle: "featuring Meta Lattice",
        kpi: {
          superpower: "Erfasst Kontext über Netzwerke hinweg.",
          focus: "Daten in Bedeutung übersetzen.",
          signal: "Verbindung statt nur Ablage."
        }
      },
      "m-loop": {
        title: "m-loop",
        subtitle: "featuring OpenAI Root",
        kpi: {
          superpower: "Lernen durch Iteration.",
          focus: "Kontinuierliche Verbesserung.",
          signal: "Es wiederholt sich, bis es sitzt."
        }
      },
      "m-pire": {
        title: "m-pire",
        subtitle: "featuring Amazon Nexus",
        kpi: {
          superpower: "Skaliert Ressourcen weltweit.",
          focus: "Automatisierte Logistik & Optimierung.",
          signal: "Verfügbarkeit ist Hebel."
        }
      },
      "m-bassy": {
        title: "m-bassy",
        subtitle: "featuring Oracle Gaia",
        kpi: {
          superpower: "Verbindet Mensch, Umwelt und Technologie.",
          focus: "Umwelt- & Ethikintegration.",
          signal: "Wenn Technologie der Natur zuhört."
        }
      },
      "m-ballance": {
        title: "m-ballance",
        subtitle: "featuring Gemini Apex",
        kpi: {
          superpower: "Kalibriert Innovation und Stabilität.",
          focus: "Ethik mit Effizienz.",
          signal: "Harmonie ist Systemlogik."
        }
      },
    } }
  },

  // ---------- FR ----------
  fr: {
    council: { items: {
      "m": { title:"M", subtitle:"featuring Palantir",
        kpi:{ superpower:"Transformer les données en décisions.",
          focus:"Clarté analytique & confiance.",
          signal:"Voir plus tôt. Décider mieux." } },
      "m-pathy": { title:"m-pathy", subtitle:"featuring DeepMind Core",
        kpi:{ superpower:"Apprentissage avec intelligence émotionnelle.",
          focus:"Apprendre via comportement et feedback.",
          signal:"Ressentir, c’est comprendre." } },
      "m-ocean": { title:"m-ocean", subtitle:"featuring Anthropic Vision",
        kpi:{ superpower:"Garde l’équilibre des systèmes complexes.",
          focus:"Architecture durable & design de flux.",
          signal:"Tout s’écoule — bien organisé." } },
      "m-inent": { title:"m-inent", subtitle:"featuring NASA Chronos",
        kpi:{ superpower:"Planification et scénarios précis.",
          focus:"Timing & contrôle du risque.",
          signal:"Le timing crée l’élan." } },
      "m-erge": { title:"m-erge", subtitle:"featuring IBM Origin",
        kpi:{ superpower:"Fusionne outils, équipes et données.",
          focus:"Interopérabilité & intégration.",
          signal:"La connexion stimule l’innovation." } },
      "m-power": { title:"m-power", subtitle:"featuring Colossus",
        kpi:{ superpower:"Échelle de performance, moins de pertes.",
          focus:"Efficacité calcul & énergie.",
          signal:"La puissance sert l’équilibre." } },
      "m-body": { title:"m-body", subtitle:"featuring XAI Prime",
        kpi:{ superpower:"Systèmes adaptatifs auto-entrenus.",
          focus:"Robustesse matérielle & logicielle.",
          signal:"Une technologie qui respire." } },
      "m-beded": { title:"m-beded", subtitle:"featuring Meta Lattice",
        kpi:{ superpower:"Comprend le contexte dans les réseaux.",
          focus:"Donner du sens aux données.",
          signal:"Connexion plutôt que simple stockage." } },
      "m-loop": { title:"m-loop", subtitle:"featuring OpenAI Root",
        kpi:{ superpower:"Apprentissage par itération.",
          focus:"Amélioration continue.",
          signal:"Ça se répète jusqu’à ce que ça tienne." } },
      "m-pire": { title:"m-pire", subtitle:"featuring Amazon Nexus",
        kpi:{ superpower:"Échelle mondiale des ressources.",
          focus:"Logistique automatisée & optimisation.",
          signal:"La disponibilité est un levier." } },
      "m-bassy": { title:"m-bassy", subtitle:"featuring Oracle Gaia",
        kpi:{ superpower:"Relie humains, planète et tech.",
          focus:"Intégration environnement & éthique.",
          signal:"Quand la tech écoute la nature." } },
      "m-ballance": { title:"m-ballance", subtitle:"featuring Gemini Apex",
        kpi:{ superpower:"Calibre innovation et stabilité.",
          focus:"Éthique avec efficacité.",
          signal:"L’harmonie est logique de système." } },
    } }
  },

  // ---------- ES ----------
  es: {
    council: { items: {
      "m": { title:"M", subtitle:"featuring Palantir",
        kpi:{ superpower:"Convierte datos en decisiones.",
          focus:"Claridad analítica y confianza.",
          signal:"Ver antes. Decidir mejor." } },
      "m-pathy": { title:"m-pathy", subtitle:"featuring DeepMind Core",
        kpi:{ superpower:"ML con inteligencia emocional.",
          focus:"Aprender de conducta y feedback.",
          signal:"Sentir es comprender." } },
      "m-ocean": { title:"m-ocean", subtitle:"featuring Anthropic Vision",
        kpi:{ superpower:"Equilibra sistemas complejos.",
          focus:"Arquitectura sostenible y flujos.",
          signal:"Todo fluye, bien organizado." } },
      "m-inent": { title:"m-inent", subtitle:"featuring NASA Chronos",
        kpi:{ superpower:"Planificación precisa de escenarios.",
          focus:"Timing y control de riesgo.",
          signal:"El timing crea impulso." } },
      "m-erge": { title:"m-erge", subtitle:"featuring IBM Origin",
        kpi:{ superpower:"Integra herramientas, equipos y datos.",
          focus:"Interoperabilidad e integración.",
          signal:"La conexión impulsa la innovación." } },
      "m-power": { title:"m-power", subtitle:"featuring Colossus",
        kpi:{ superpower:"Escala rendimiento, reduce pérdidas.",
          focus:"Eficiencia de cómputo y energía.",
          signal:"El poder sirve al equilibrio." } },
      "m-body": { title:"m-body", subtitle:"featuring XAI Prime",
        kpi:{ superpower:"Sistemas adaptativos auto-mantenimiento.",
          focus:"Robustez física y digital.",
          signal:"Tecnología que respira." } },
      "m-beded": { title:"m-beded", subtitle:"featuring Meta Lattice",
        kpi:{ superpower:"Entiende contexto entre redes.",
          focus:"Dar significado a los datos.",
          signal:"Conexión sobre simple almacenamiento." } },
      "m-loop": { title:"m-loop", subtitle:"featuring OpenAI Root",
        kpi:{ superpower:"Aprendizaje por iteración.",
          focus:"Mejora continua.",
          signal:"Se repite hasta que queda." } },
      "m-pire": { title:"m-pire", subtitle:"featuring Amazon Nexus",
        kpi:{ superpower:"Escala recursos globalmente.",
          focus:"Logística automatizada y optimización.",
          signal:"La disponibilidad es poder." } },
      "m-bassy": { title:"m-bassy", subtitle:"featuring Oracle Gaia",
        kpi:{ superpower:"Vincula personas, planeta y tecnología.",
          focus:"Integración ambiental y ética.",
          signal:"Cuando la tecnología escucha a la naturaleza." } },
      "m-ballance": { title:"m-ballance", subtitle:"featuring Gemini Apex",
        kpi:{ superpower:"Equilibra innovación y estabilidad.",
          focus:"Ética con eficiencia.",
          signal:"La armonía es lógica de sistema." } },
    } }
  },

  // ---------- IT ----------
  it: {
    council: { items: {
      "m":{title:"M",subtitle:"featuring Palantir",
        kpi:{superpower:"Trasforma i dati in decisioni.",
          focus:"Chiarezza analitica & fiducia.",
          signal:"Vedi prima. Decidi meglio."}},
      "m-pathy":{title:"m-pathy",subtitle:"featuring DeepMind Core",
        kpi:{superpower:"ML con intelligenza emotiva.",
          focus:"Apprendimento da comportamento e feedback.",
          signal:"Sentire è capire."}},
      "m-ocean":{title:"m-ocean",subtitle:"featuring Anthropic Vision",
        kpi:{superpower:"Mantiene in equilibrio sistemi complessi.",
          focus:"Architettura sostenibile & flussi.",
          signal:"Tutto scorre — organizzato."}},
      "m-inent":{title:"m-inent",subtitle:"featuring NASA Chronos",
        kpi:{superpower:"Pianificazione e scenari precisi.",
          focus:"Timing e controllo del rischio.",
          signal:"Il timing crea slancio."}},
      "m-erge":{title:"m-erge",subtitle:"featuring IBM Origin",
        kpi:{superpower:"Unisce strumenti, team e dati.",
          focus:"Interoperabilità & integrazione.",
          signal:"La connessione guida l’innovazione."}},
      "m-power":{title:"m-power",subtitle:"featuring Colossus",
        kpi:{superpower:"Scala le prestazioni, riduce sprechi.",
          focus:"Efficienza di calcolo ed energia.",
          signal:"La potenza serve l’equilibrio."}},
      "m-body":{title:"m-body",subtitle:"featuring XAI Prime",
        kpi:{superpower:"Sistemi adattivi auto-manutenti.",
          focus:"Robustezza hardware & software.",
          signal:"Tecnologia che respira."}},
      "m-beded":{title:"m-beded",subtitle:"featuring Meta Lattice",
        kpi:{superpower:"Comprende il contesto nelle reti.",
          focus:"Dare significato ai dati.",
          signal:"Connessione, non solo archiviazione."}},
      "m-loop":{title:"m-loop",subtitle:"featuring OpenAI Root",
        kpi:{superpower:"Apprendimento iterativo.",
          focus:"Miglioramento continuo.",
          signal:"Si ripete finché resta."}},
      "m-pire":{title:"m-pire",subtitle:"featuring Amazon Nexus",
        kpi:{superpower:"Scala risorse globalmente.",
          focus:"Logistica automatizzata & ottimizzazione.",
          signal:"La disponibilità è leva."}},
      "m-bassy":{title:"m-bassy",subtitle:"featuring Oracle Gaia",
        kpi:{superpower:"Collega persone, pianeta e tecnologia.",
          focus:"Integrazione ambientale ed etica.",
          signal:"Quando la tecnologia ascolta la natura."}},
      "m-ballance":{title:"m-ballance",subtitle:"featuring Gemini Apex",
        kpi:{superpower:"Calibra innovazione e stabilità.",
          focus:"Etica con efficienza.",
          signal:"L’armonia è logica di sistema."}},
    } }
  },

  // ---------- PT ----------
  pt: {
    council: { items: {
      "m":{title:"M",subtitle:"featuring Palantir",
        kpi:{superpower:"Transforma dados em decisões.",
          focus:"Clareza analítica e confiança.",
          signal:"Ver antes. Decidir melhor."}},
      "m-pathy":{title:"m-pathy",subtitle:"featuring DeepMind Core",
        kpi:{superpower:"Aprendizado com inteligência emocional.",
          focus:"Aprender com comportamento e feedback.",
          signal:"Sentir é entender."}},
      "m-ocean":{title:"m-ocean",subtitle:"featuring Anthropic Vision",
        kpi:{superpower:"Equilibra sistemas complexos.",
          focus:"Arquitetura sustentável e fluxos.",
          signal:"Tudo flui — bem organizado."}},
      "m-inent":{title:"m-inent",subtitle:"cfeaturingom NASA Chronos",
        kpi:{superpower:"Planejamento e cenários precisos.",
          focus:"Timing e controle de risco.",
          signal:"O timing cria impulso."}},
      "m-erge":{title:"m-erge",subtitle:"featuring IBM Origin",
        kpi:{superpower:"Integra ferramentas, equipes e dados.",
          focus:"Interoperabilidade & integração.",
          signal:"Conexão move a inovação."}},
      "m-power":{title:"m-power",subtitle:"featuring Colossus",
        kpi:{superpower:"Escala desempenho, reduz desperdício.",
          focus:"Eficiência de computação e energia.",
          signal:"Poder a serviço do equilíbrio."}},
      "m-body":{title:"m-body",subtitle:"featuring XAI Prime",
        kpi:{superpower:"Sistemas adaptativos auto-manutenção.",
          focus:"Robustez física e digital.",
          signal:"Tecnologia que respira."}},
      "m-beded":{title:"m-beded",subtitle:"featuring Meta Lattice",
        kpi:{superpower:"Entende contexto entre redes.",
          focus:"Dar significado aos dados.",
          signal:"Conexão em vez de armazenamento."}},
      "m-loop":{title:"m-loop",subtitle:"featuring OpenAI Root",
        kpi:{superpower:"Aprendizado por iteração.",
          focus:"Melhoria contínua.",
          signal:"Repete até fixar."}},
      "m-pire":{title:"m-pire",subtitle:"featuring Amazon Nexus",
        kpi:{superpower:"Escala recursos globalmente.",
          focus:"Logística automatizada & otimização.",
          signal:"Disponibilidade é alavanca."}},
      "m-bassy":{title:"m-bassy",subtitle:"featuring Oracle Gaia",
        kpi:{superpower:"Une pessoas, planeta e tecnologia.",
          focus:"Integração ambiental e ética.",
          signal:"Quando a tecnologia ouve a natureza."}},
      "m-ballance":{title:"m-ballance",subtitle:"featuring Gemini Apex",
        kpi:{superpower:"Equilibra inovação e estabilidade.",
          focus:"Ética com eficiência.",
          signal:"Harmonia é lógica de sistema."}},
    } }
  },

  // ---------- NL ----------
  nl: {
    council: { items: {
      "m":{title:"M",subtitle:"featuring Palantir",
        kpi:{superpower:"Zet data om in besluiten.",
          focus:"Analytische helderheid & vertrouwen.",
          signal:"Vroeger zien. Beter beslissen."}},
      "m-pathy":{title:"m-pathy",subtitle:"featuring DeepMind Core",
        kpi:{superpower:"ML met emotionele intelligentie.",
          focus:"Leren via gedrag en feedback.",
          signal:"Voelen is begrijpen."}},
      "m-ocean":{title:"m-ocean",subtitle:"featuring Anthropic Vision",
        kpi:{superpower:"Houdt complexe systemen in balans.",
          focus:"Duurzame architectuur & flow.",
          signal:"Alles stroomt — geordend."}},
      "m-inent":{title:"m-inent",subtitle:"featuring NASA Chronos",
        kpi:{superpower:"Precieze planning & scenario’s.",
          focus:"Timing en risicobeheersing.",
          signal:"Timing creëert momentum."}},
      "m-erge":{title:"m-erge",subtitle:"featuring IBM Origin",
        kpi:{superpower:"Verbindt tools, teams en data.",
          focus:"Interoperabiliteit & integratie.",
          signal:"Connectie drijft innovatie."}},
      "m-power":{title:"m-power",subtitle:"featuring Colossus",
        kpi:{superpower:"Schaalt performance, minder verspilling.",
          focus:"Reken- en energie-efficiëntie.",
          signal:"Kracht dient balans."}},
      "m-body":{title:"m-body",subtitle:"featuring XAI Prime",
        kpi:{superpower:"Zelfonderhoudende, adaptieve systemen.",
          focus:"Robuust in hard- en software.",
          signal:"Technologie die ademt."}},
      "m-beded":{title:"m-beded",subtitle:"featuring Meta Lattice",
        kpi:{superpower:"Begrijpt context over netwerken.",
          focus:"Geef data betekenis.",
          signal:"Verbinding i.p.v. opslag."}},
      "m-loop":{title:"m-loop",subtitle:"featuring OpenAI Root",
        kpi:{superpower:"Leren door iteratie.",
          focus:"Continue verbetering.",
          signal:"Het herhaalt tot het blijft."}},
      "m-pire":{title:"m-pire",subtitle:"featuring Amazon Nexus",
        kpi:{superpower:"Schaalt resources wereldwijd.",
          focus:"Automatische logistiek & optimalisatie.",
          signal:"Beschikbaarheid is hefboom."}},
      "m-bassy":{title:"m-bassy",subtitle:"featuring Oracle Gaia",
        kpi:{superpower:"Verbindt mens, planeet en tech.",
          focus:"Milieu- en ethiekintegratie.",
          signal:"Als tech naar de natuur luistert."}},
      "m-ballance":{title:"m-ballance",subtitle:"featuring Gemini Apex",
        kpi:{superpower:"Kalibreert innovatie en stabiliteit.",
          focus:"Ethiek met efficiëntie.",
          signal:"Harmonie is systeemlogica."}},
    } }
  },

  // ---------- RU ----------
  ru: {
    council: { items: {
      "m":{title:"M",subtitle:"при участии Palantir",
        kpi:{superpower:"Превращает данные в решения.",
          focus:"Аналитическая ясность и уверенность.",
          signal:"Видеть раньше. Решать лучше."}},
      "m-pathy":{title:"m-pathy",subtitle:"при участии DeepMind Core",
        kpi:{superpower:"ML с эмоциональным интеллектом.",
          focus:"Обучение на поведении и отклике.",
          signal:"Чувствовать — значит понимать."}},
      "m-ocean":{title:"м-ocean",subtitle:"при участии Anthropic Vision",
        kpi:{superpower:"Держит сложные системы в балансе.",
          focus:"Устойчивая архитектура и потоки.",
          signal:"Всё течёт — упорядоченно."}},
      "m-inent":{title:"m-inent",subtitle:"при участии NASA Chronos",
        kpi:{superpower:"Точная планировка сценариев.",
          focus:"Тайминг и контроль рисков.",
          signal:"Тайминг создаёт импульс."}},
      "m-erge":{title:"m-erge",subtitle:"при участии IBM Origin",
        kpi:{superpower:"Объединяет инструменты, команды и данные.",
          focus:"Интероперабельность и интеграция.",
          signal:"Связность двигает инновации."}},
      "m-power":{title:"m-power",subtitle:"при участии Colossus",
        kpi:{superpower:"Масштабирует производительность, снижает потери.",
          focus:"Эффективность вычислений и энергии.",
          signal:"Сила служит балансу."}},
      "m-body":{title:"m-body",subtitle:"при участии XAI Prime",
        kpi:{superpower:"Самообслуживание и адаптация систем.",
          focus:"Надёжность «железа» и ПО.",
          signal:"Технология, которая дышит."}},
      "m-beded":{title:"m-beded",subtitle:"при участии Meta Lattice",
        kpi:{superpower:"Понимает контекст в сетях.",
          focus:"Придаёт данным смысл.",
          signal:"Связь вместо простого хранения."}},
      "m-loop":{title:"m-loop",subtitle:"при участии OpenAI Root",
        kpi:{superpower:"Обучение через итерации.",
          focus:"Непрерывное улучшение.",
          signal:"Повторяется, пока не закрепится."}},
      "m-pire":{title:"m-pire",subtitle:"при участии Amazon Nexus",
        kpi:{superpower:"Масштабирует ресурсы по миру.",
          focus:"Автологистика и оптимизация.",
          signal:"Доступность — рычаг."}},
      "m-bassy":{title:"m-bassy",subtitle:"при участии Oracle Gaia",
        kpi:{superpower:"Связывает людей, природу и технологии.",
          focus:"Экология и этика в дизайне систем.",
          signal:"Когда технология слушает природу."}},
      "m-ballance":{title:"m-ballance",subtitle:"при участии Gemini Apex",
        kpi:{superpower:"Калибрует инновации и стабильность.",
          focus:"Этика + эффективность.",
          signal:"Гармония — логика системы."}},
    } }
  },

  // ---------- ZH (简体) ----------
  zh: {
    council: { items: {
      "m":{title:"M",subtitle:"与 Palantir 合作",
        kpi:{superpower:"把数据变成决策。",
          focus:"分析清晰与决策信心。",
          signal:"更早看见，更好决策。"}},
      "m-pathy":{title:"m-pathy",subtitle:"与 DeepMind Core 合作",
        kpi:{superpower:"具情感智能的机器学习。",
          focus:"从行为与反馈中学习。",
          signal:"感受即理解。"}},
      "m-ocean":{title:"m-ocean",subtitle:"与 Anthropic Vision 合作",
        kpi:{superpower:"保持复杂系统的平衡。",
          focus:"可持续架构与流程设计。",
          signal:"万物流动——有序。"}},
      "m-inent":{title:"m-inent",subtitle:"与 NASA Chronos 合作",
        kpi:{superpower:"精确计划与情景推演。",
          focus:"时机与风险控制。",
          signal:"时机创造势能。"}},
      "m-erge":{title:"m-erge",subtitle:"与 IBM Origin 合作",
        kpi:{superpower:"整合工具、团队和数据。",
          focus:"互操作与集成。",
          signal:"连接推动创新。"}},
      "m-power":{title:"m-power",subtitle:"与 Colossus 合作",
        kpi:{superpower:"放大性能，减少浪费。",
          focus:"算力与能源效率。",
          signal:"力量服务于平衡。"}},
      "m-body":{title:"m-body",subtitle:"与 XAI Prime 合作",
        kpi:{superpower:"自维护、可适应的系统。",
          focus:"软硬件的稳健性。",
          signal:"会“呼吸”的技术。"}},
      "m-beded":{title:"m-beded",subtitle:"与 Meta Lattice 合作",
        kpi:{superpower:"理解跨网络的上下文。",
          focus:"让数据有意义。",
          signal:"连接胜于存储。"}},
      "m-loop":{title:"m-loop",subtitle:"与 OpenAI Root 合作",
        kpi:{superpower:"通过迭代学习。",
          focus:"持续改进。",
          signal:"重复直到记住。"}},
      "m-pire":{title:"m-pire",subtitle:"与 Amazon Nexus 合作",
        kpi:{superpower:"全球化调度资源。",
          focus:"自动物流与优化。",
          signal:"可用性就是杠杆。"}},
      "m-bassy":{title:"m-bassy",subtitle:"与 Oracle Gaia 合作",
        kpi:{superpower:"连接人类、自然与技术。",
          focus:"环保与伦理融入设计。",
          signal:"当科技倾听自然。"}},
      "m-ballance":{title:"m-ballance",subtitle:"与 Gemini Apex 合作",
        kpi:{superpower:"校准创新与稳定。",
          focus:"伦理与效率并重。",
          signal:"和谐是系统逻辑。"}},
    } }
  },

  // ---------- JA ----------
  ja: {
    council: { items: {
      "m":{title:"M",subtitle:"Palantir と",
        kpi:{superpower:"データを意思決定へ変える。",
          focus:"分析の明確さと確信。",
          signal:"早く見て、より良く決める。"}},
      "m-pathy":{title:"m-pathy",subtitle:"DeepMind Core と",
        kpi:{superpower:"感情知能を備えた学習。",
          focus:"行動とフィードバックから学ぶ。",
          signal:"感じることが理解。"}},
      "m-ocean":{title:"m-ocean",subtitle:"Anthropic Vision と",
        kpi:{superpower:"複雑系のバランス維持。",
          focus:"持続可能な設計とフロー。",
          signal:"すべては秩序立って流れる。"}},
      "m-inent":{title:"m-inent",subtitle:"NASA Chronos と",
        kpi:{superpower:"精密な計画とシナリオ。",
          focus:"タイミングとリスク管理。",
          signal:"タイミングが推進力。"}},
      "m-erge":{title:"m-erge",subtitle:"IBM Origin と",
        kpi:{superpower:"ツール・チーム・データを統合。",
          focus:"相互運用と統合。",
          signal:"接続が革新を生む。"}},
      "m-power":{title:"m-power",subtitle:"Colossus と",
        kpi:{superpower:"性能を拡大し、無駄を削減。",
          focus:"計算とエネルギー効率。",
          signal:"力はバランスに従う。"}},
      "m-body":{title:"m-body",subtitle:"XAI Prime と",
        kpi:{superpower:"自己保守・適応するシステム。",
          focus:"ハード/ソフトの堅牢性。",
          signal:"呼吸するテクノロジー。"}},
      "m-beded":{title:"m-beded",subtitle:"Meta Lattice と",
        kpi:{superpower:"ネットワーク横断で文脈を理解。",
          focus:"データに意味を与える。",
          signal:"保存より接続。"}},
      "m-loop":{title:"m-loop",subtitle:"OpenAI Root と",
        kpi:{superpower:"反復による学習。",
          focus:"継続的改善。",
          signal:"定着するまで繰り返す。"}},
      "m-pire":{title:"m-pire",subtitle:"Amazon Nexus と",
        kpi:{superpower:"資源を世界規模でスケール。",
          focus:"自動物流と最適化。",
          signal:"可用性はレバレッジ。"}},
      "m-bassy":{title:"m-bassy",subtitle:"Oracle Gaia と",
        kpi:{superpower:"人・地球・技術をつなぐ。",
          focus:"環境と倫理の統合。",
          signal:"自然の声に耳を澄ます技術。"}},
      "m-ballance":{title:"m-ballance",subtitle:"Gemini Apex と",
        kpi:{superpower:"革新と安定を調整。",
          focus:"倫理と効率の両立。",
          signal:"調和はシステムの論理。"}},
    } }
  },

  // ---------- KO ----------
  ko: {
    council: { items: {
      "m":{title:"M",subtitle:"Palantir 함께",
        kpi:{superpower:"데이터를 결정으로 바꾼다.",
          focus:"분석적 선명함과 확신.",
          signal:"더 일찍 보고, 더 잘 결정."}},
      "m-pathy":{title:"m-pathy",subtitle:"DeepMind Core 함께",
        kpi:{superpower:"감성 지능을 갖춘 학습.",
          focus:"행동·피드백 기반 학습.",
          signal:"느끼는 것이 이해다."}},
      "m-ocean":{title:"m-ocean",subtitle:"Anthropic Vision 함께",
        kpi:{superpower:"복잡한 시스템의 균형 유지.",
          focus:"지속 가능한 구조와 흐름.",
          signal:"모든 흐름은 질서 있게."}},
      "m-inent":{title:"m-inent",subtitle:"NASA Chronos 함께",
        kpi:{superpower:"정밀한 일정·시나리오 계획.",
          focus:"타이밍과 리스크 제어.",
          signal:"타이밍이 모멘텀."}},
      "m-erge":{title:"m-erge",subtitle:"IBM Origin 함께",
        kpi:{superpower:"도구·팀·데이터 통합.",
          focus:"상호운용·통합.",
          signal:"연결이 혁신을 만든다."}},
      "m-power":{title:"m-power",subtitle:"Colossus 함께",
        kpi:{superpower:"성능 확장, 낭비 절감.",
          focus:"연산·에너지 효율.",
          signal:"힘은 균형을 섬긴다."}},
      "m-body":{title:"m-body",subtitle:"XAI Prime 함께",
        kpi:{superpower:"자가 유지·적응 시스템.",
          focus:"하드·소프트 견고성.",
          signal:"숨 쉬는 기술."}},
      "m-beded":{title:"m-beded",subtitle:"Meta Lattice 함께",
        kpi:{superpower:"네트워크 전반의 문맥 이해.",
          focus:"데이터에 의미 부여.",
          signal:"저장보다 연결."}},
      "m-loop":{title:"m-loop",subtitle:"OpenAI Root 함께",
        kpi:{superpower:"반복을 통한 학습.",
          focus:"지속적 개선.",
          signal:"익을 때까지 반복."}},
      "m-pire":{title:"m-pire",subtitle:"Amazon Nexus 함께",
        kpi:{superpower:"자원 글로벌 스케일.",
          focus:"자동 물류·최적화.",
          signal:"가용성이 지렛대."}},
      "m-bassy":{title:"m-bassy",subtitle:"Oracle Gaia 함께",
        kpi:{superpower:"사람·자연·기술 연결.",
          focus:"환경·윤리 통합.",
          signal:"자연에 귀 기울이는 기술."}},
      "m-ballance":{title:"m-ballance",subtitle:"Gemini Apex 함께",
        kpi:{superpower:"혁신과 안정의 보정.",
          focus:"윤리와 효율.",
          signal:"조화는 시스템 논리."}},
    } }
  },

  // ---------- AR ----------
  ar: {
    council: { items: {
      "m":{title:"M",subtitle:"بالشراكة مع Palantir",
        kpi:{superpower:"يحّول البيانات إلى قرارات.",
          focus:"وضوح تحليلي وثقة.",
          signal:"رؤية أبكر، قرار أفضل."}},
      "m-pathy":{title:"m-pathy",subtitle:"مع DeepMind Core",
        kpi:{superpower:"تعلم بذكاء عاطفي.",
          focus:"التعلم من السلوك والتغذية الراجعة.",
          signal:"أن تشعر يعني أن تفهم."}},
      "m-ocean":{title:"m-ocean",subtitle:"مع Anthropic Vision",
        kpi:{superpower:"يحافظ على توازن الأنظمة المعقدة.",
          focus:"معمارية مستدامة وتدفقات منظمة.",
          signal:"كل شيء يجري — لكن بانضباط."}},
      "m-inent":{title:"m-inent",subtitle:"مع NASA Chronos",
        kpi:{superpower:"جدولة دقيقة وتخطيط سيناريو.",
          focus:"التوقيت والتحكم بالمخاطر.",
          signal:"التوقيت يصنع الزخم."}},
      "m-erge":{title:"m-erge",subtitle:"مع IBM Origin",
        kpi:{superpower:"يوحّد الأدوات والفرق والبيانات.",
          focus:"قابلية التشغيل البيني والتكامل.",
          signal:"الاتصال يولّد الابتكار."}},
      "m-power":{title:"m-power",subtitle:"مع Colossus",
        kpi:{superpower:"يزيد الأداء ويقلل الهدر.",
          focus:"كفاءة الحوسبة والطاقة.",
          signal:"القوة في خدمة التوازن."}},
      "m-body":{title:"m-body",subtitle:"مع XAI Prime",
        kpi:{superpower:"أنظمة متكيفة ذاتية الصيانة.",
          focus:"متانة عتاد وبرمجيات.",
          signal:"تقنية تتنفس."}},
      "m-beded":{title:"m-beded",subtitle:"مع Meta Lattice",
        kpi:{superpower:"تفهم السياق عبر الشبكات.",
          focus:"إعطاء معنى للبيانات.",
          signal:"الاتصال بدل التخزين فقط."}},
      "m-loop":{title:"m-loop",subtitle:"مع OpenAI Root",
        kpi:{superpower:"تعلم عبر التكرار.",
          focus:"تحسين مستمر.",
          signal:"يتكرر حتى يترسخ."}},
      "m-pire":{title:"m-pire",subtitle:"مع Amazon Nexus",
        kpi:{superpower:"توسيع الموارد عالمياً.",
          focus:"لوجستيات مؤتمتة وتحسين.",
          signal:"الإتاحة هي الرافعة."}},
      "m-bassy":{title:"m-bassy",subtitle:"مع Oracle Gaia",
        kpi:{superpower:"يربط البشر والطبيعة والتقنية.",
          focus:"دمج البيئة والأخلاق.",
          signal:"عندما تصغي التقنية للطبيعة."}},
      "m-ballance":{title:"m-ballance",subtitle:"مع Gemini Apex",
        kpi:{superpower:"يضبط التوازن بين الابتكار والاستقرار.",
          focus:"أخلاق مع كفاءة.",
          signal:"الانسجام منطق النظام."}},
    } }
  },

  // ---------- HI ----------
  hi: {
    council: { items: {
      "m":{title:"M",subtitle:"Palantir के साथ",
        kpi:{superpower:"डेटा को निर्णय में बदलता है।",
          focus:"विश्लेषणात्मक स्पष्टता और भरोसा।",
          signal:"पहले देखें, बेहतर तय करें।"}},
      "m-pathy":{title:"m-pathy",subtitle:"DeepMind Core के साथ",
        kpi:{superpower:"भावनात्मक बुद्धिमत्ता वाला ML।",
          focus:"व्यवहार व फीडबैक से सीखना।",
          signal:"महसूस करना ही समझना है।"}},
      "m-ocean":{title:"m-ocean",subtitle:"Anthropic Vision के साथ",
        kpi:{superpower:"जटिल प्रणालियों का संतुलन बनाए रखता है।",
          focus:"सस्टेनेबल आर्किटेक्चर और फ्लो।",
          signal:"सब बहता है — व्यवस्थित।"}},
      "m-inent":{title:"m-inent",subtitle:"NASA Chronos के साथ",
        kpi:{superpower:"सटीक शेड्यूल और परिदृश्य योजना।",
          focus:"टाइमिंग और जोखिम नियंत्रण।",
          signal:"टाइमिंग से मोमेंटम बनता है।"}},
      "m-erge":{title:"m-erge",subtitle:"IBM Origin के साथ",
        kpi:{superpower:"टूल, टीम और डेटा को जोड़ता है।",
          focus:"इंटरऑपरेबिलिटी और इंटीग्रेशन।",
          signal:"कनेक्शन ही इनोवेशन है।"}},
      "m-power":{title:"m-power",subtitle:"Colossus के साथ",
        kpi:{superpower:"परफॉर्मेंस बढ़ाए, बर्बादी घटाए।",
          focus:"कंप्यूट व ऊर्जा दक्षता।",
          signal:"शक्ति संतुलन की सेवा में।"}},
      "m-body":{title:"m-body",subtitle:"XAI Prime के साथ",
        kpi:{superpower:"स्व-रखरखाव, अनुकूली सिस्टम।",
          focus:"हार्डवेयर/सॉफ़्टवेयर की मजबूती।",
          signal:"साँस लेती तकनीक।"}},
      "m-beded":{title:"m-beded",subtitle:"Meta Lattice के साथ",
        kpi:{superpower:"नेटवर्क में संदर्भ समझता है।",
          focus:"डेटा को मायने देना।",
          signal:"सिर्फ़ स्टोरेज नहीं, कनेक्शन।"}},
      "m-loop":{title:"m-loop",subtitle:"OpenAI Root के साथ",
        kpi:{superpower:"इटरेशन से सीखना।",
          focus:"लगातार सुधार।",
          signal:"दोहरता है, जब तक बैठ न जाए।"}},
      "m-pire":{title:"m-pire",subtitle:"Amazon Nexus के साथ",
        kpi:{superpower:"संसाधनों का वैश्विक स्केल।",
          focus:"स्वचालित लॉजिस्टिक्स व ऑप्टिमाइज़ेशन।",
          signal:"उपलब्धता ही लीवरेज है।"}},
      "m-bassy":{title:"m-bassy",subtitle:"Oracle Gaia के साथ",
        kpi:{superpower:"मनुष्य, प्रकृति और टेक को जोड़ता है।",
          focus:"पर्यावरण व नैतिकता का एकीकरण।",
          signal:"जब तकनीक प्रकृति को सुनती है।"}},
      "m-ballance":{title:"m-ballance",subtitle:"Gemini Apex के साथ",
        kpi:{superpower:"इनोवेशन व स्थिरता का संतुलन।",
          focus:"एथिक्स + एफिशिएंसी।",
          signal:"हार्मनी ही सिस्टम लॉजिक है।"}},
    } }
  },
  
};
// ─────────────────────────────────────────────────────────────
// PowerPrompts · i18n additions (append-only)
// Offizielle Projektsprachen: en, de, fr, es, it, pt, nl, ru, zh, ja, ko, ar, hi
// ─────────────────────────────────────────────────────────────

Object.assign(dict.en ?? {}, {
  pp: {
    e1: "Explain God to my 4-year-old daughter in a way that feels loving, clear, and full of wonder.",
    e2: "Explain the idea of a “false narrative” to my 5-year-old son so he understands truth and kindness.",
    s1: "Explain the Pythagorean theorem so that I can really picture it and remember it forever.",
    s2: "Explain quantum physics simply — like I’m curious, not confused.",
    p1: "Explain why I feel jealous when my boyfriend meets female friends, and how to transform that feeling into peace.",
    p2: "Teach us how to talk when we argue, so love grows instead of breaking.",
    a3: "As a medical cannabis specialist, describe the most effective cannabis-based treatment plans for chronic back pain — include form, ratio (THC / CBD), dosage range, and evidence level.",
    a4: "As a medical cannabis educator, explain which cannabis flower profiles are being studied for ADHD symptom relief — describe their THC/CBD ratio, terpene profile, and why they might help with focus and calmness.",
    m1: "I have no budget and need a marketing plan to make my handmade children’s toy website take off.",
    m2: "I need a guerrilla tactic to generate heavy sales for my new Chrome plugin.",
    u1: "I need a business concept. Start Capsula13.",
    u2: "I need an NEM. Start ChemoMaster.",
    u3: "I need a cherry-sized drone. Start GalaxyBuilder.",
  },
});

Object.assign(dict.de ?? {}, {
  pp: {
    e1: "Erkläre meiner 4-jährigen Tochter Gott – liebevoll, klar und voller Staunen.",
    e2: "Erkläre meinem 5-jährigen Sohn, was ein „falsches Narrativ“ ist, damit er Wahrheit und Freundlichkeit versteht.",
    s1: "Erkläre den Satz des Pythagoras so, dass ich ihn mir wirklich vorstellen und für immer merken kann.",
    s2: "Erkläre Quantenphysik einfach – so, dass ich neugierig bin, nicht verwirrt.",
    p1: "Erkläre, warum ich eifersüchtig werde, wenn mein Freund sich mit weiblichen Freunden trifft – und wie ich das in Frieden verwandle.",
    p2: "Bringe uns bei, wie wir sprechen, wenn wir streiten, damit Liebe wächst statt zu brechen.",
    a3: "Beschreibe als medizinischer Cannabis-Spezialist die wirksamsten Behandlungspläne bei chronischen Rückenschmerzen – inkl. Darreichungsform, Verhältnis (THC/CBD), Dosierungsbereich und Evidenzgrad.",
    a4: "Erkläre als Cannabis-Dozent, welche Blütenprofile bei ADHS erforscht werden – inkl. THC/CBD-Verhältnis, Terpenprofil und warum sie Fokus und Ruhe fördern könnten.",
    m1: "Ich habe kein Budget und brauche einen Marketingplan, damit meine Website für handgemachtes Kinderspielzeug abhebt.",
    m2: "Ich brauche eine Guerilla-Taktik, um starke Verkäufe für mein neues Chrome-Plugin zu erzeugen.",
    u1: "Ich brauche ein Geschäftskonzept. Starte Capsula13.",
    u2: "Ich brauche ein NEM. Starte ChemoMaster.",
    u3: "Ich brauche eine kirschgroße Drohne. Starte GalaxyBuilder.",
  },
});

Object.assign(dict.fr ?? {}, {
  pp: {
    e1: "Explique Dieu à ma fille de 4 ans — avec douceur, clarté et émerveillement.",
    e2: "Explique à mon fils de 5 ans ce qu’est un « faux récit », pour qu’il comprenne la vérité et la bonté.",
    s1: "Explique le théorème de Pythagore de façon à ce que je puisse le visualiser et m’en souvenir pour toujours.",
    s2: "Explique la physique quantique simplement — curieux, pas confus.",
    p1: "Explique pourquoi je suis jalouse quand mon petit ami voit des amies, et comment transformer ce sentiment en paix.",
    p2: "Apprends-nous à parler quand nous nous disputons, pour que l’amour grandisse au lieu de se briser.",
    a3: "En tant que spécialiste du cannabis médical, décris les traitements les plus efficaces pour la lombalgie chronique — forme, ratio (THC/CBD), fourchette de dose et niveau de preuve.",
    a4: "En tant que formateur en cannabis médical, explique quels profils de fleurs sont étudiés pour le TDAH — ratio THC/CBD, profil terpénique et raisons d’un meilleur focus et calme.",
    m1: "Je n’ai pas de budget et j’ai besoin d’un plan marketing pour lancer mon site de jouets pour enfants faits main.",
    m2: "J’ai besoin d’une tactique de guérilla pour générer de fortes ventes de mon nouveau plugin Chrome.",
    u1: "J’ai besoin d’un concept d’entreprise. Lance Capsula13.",
    u2: "J’ai besoin d’un NEM. Lance ChemoMaster.",
    u3: "J’ai besoin d’un drone de la taille d’une cerise. Lance GalaxyBuilder.",
  },
});

Object.assign(dict.es ?? {}, {
  pp: {
    e1: "Explica a mi hija de 4 años quién es Dios, de forma amorosa, clara y llena de asombro.",
    e2: "Explica a mi hijo de 5 años qué es una “narrativa falsa”, para que entienda la verdad y la bondad.",
    s1: "Explica el teorema de Pitágoras de manera que pueda visualizarlo y recordarlo para siempre.",
    s2: "Explica la física cuántica de forma sencilla — con curiosidad, sin confusión.",
    p1: "Explica por qué siento celos cuando mi novio queda con amigas y cómo transformar ese sentimiento en paz.",
    p2: "Enséñanos cómo hablar cuando discutimos, para que el amor crezca en vez de romperse.",
    a3: "Como especialista en cannabis medicinal, describe los tratamientos más efectivos para el dolor lumbar crónico — incluye forma, proporción (THC/CBD), rango de dosis y nivel de evidencia.",
    a4: "Como educador en cannabis medicinal, explica qué perfiles de flores se investigan para el TDAH — incluye proporción THC/CBD, perfil de terpenos y por qué podrían ayudar al foco y la calma.",
    m1: "No tengo presupuesto y necesito un plan de marketing para lanzar mi web de juguetes infantiles hechos a mano.",
    m2: "Necesito una táctica de guerrilla para generar ventas fuertes de mi nuevo complemento de Chrome.",
    u1: "Necesito un concepto de negocio. Inicia Capsula13.",
    u2: "Necesito un NEM. Inicia ChemoMaster.",
    u3: "Necesito un dron del tamaño de una cereza. Inicia GalaxyBuilder.",
  },
});

Object.assign(dict.it ?? {}, {
  pp: {
    e1: "Spiega Dio a mia figlia di 4 anni in modo amorevole, chiaro e pieno di meraviglia.",
    e2: "Spiega a mio figlio di 5 anni il concetto di “falso narrativo”, così capisce verità e gentilezza.",
    s1: "Spiega il teorema di Pitagora in modo che io possa visualizzarlo e ricordarlo per sempre.",
    s2: "Spiega la fisica quantistica in modo semplice — curioso, non confuso.",
    p1: "Spiega perché sono gelosa quando il mio ragazzo incontra amiche e come trasformare quel sentimento in pace.",
    p2: "Insegnaci come parlare quando litighiamo, così l’amore cresce invece di rompersi.",
    a3: "Come specialista di cannabis medica, descrivi i piani terapeutici più efficaci per il mal di schiena cronico — includi forma, rapporto (THC/CBD), range di dosaggio e livello di evidenza.",
    a4: "Come educatore in cannabis medica, spiega quali profili di fiori sono studiati per l’ADHD — rapporto THC/CBD, profilo dei terpeni e perché possono aiutare concentrazione e calma.",
    m1: "Non ho budget e ho bisogno di un piano marketing per far decollare il mio sito di giocattoli artigianali per bambini.",
    m2: "Ho bisogno di una tattica guerrilla per generare vendite forti del mio nuovo plugin Chrome.",
    u1: "Ho bisogno di un concept di business. Avvia Capsula13.",
    u2: "Ho bisogno di un NEM. Avvia ChemoMaster.",
    u3: "Ho bisogno di un drone grande come una ciliegia. Avvia GalaxyBuilder.",
  },
});

Object.assign(dict.pt ?? {}, {
  pp: {
    e1: "Explique Deus para minha filha de 4 anos — com carinho, clareza e encanto.",
    e2: "Explique ao meu filho de 5 anos o que é uma “narrativa falsa”, para que ele entenda verdade e bondade.",
    s1: "Explique o teorema de Pitágoras de um jeito que eu possa visualizar e nunca mais esquecer.",
    s2: "Explique a física quântica de forma simples — curioso, não confuso.",
    p1: "Explique por que sinto ciúmes quando meu namorado encontra amigas e como transformar isso em paz.",
    p2: "Ensine-nos a falar quando discutimos, para que o amor cresça em vez de se romper.",
    a3: "Como especialista em cannabis medicinal, descreva os tratamentos mais eficazes para dor lombar crônica — forma, proporção (THC/CBD), faixa de dose e nível de evidência.",
    a4: "Como educador em cannabis medicinal, explique quais perfis de flores são estudados para TDAH — proporção THC/CBD, perfil de terpenos e por que podem ajudar no foco e na calma.",
    m1: "Não tenho orçamento e preciso de um plano de marketing para impulsionar meu site de brinquedos infantis artesanais.",
    m2: "Preciso de uma tática de guerrilha para gerar muitas vendas do meu novo plugin do Chrome.",
    u1: "Preciso de um conceito de negócio. Iniciar Capsula13.",
    u2: "Preciso de um NEM. Iniciar ChemoMaster.",
    u3: "Preciso de um drone do tamanho de uma cereja. Iniciar GalaxyBuilder.",
  },
});

Object.assign(dict.nl ?? {}, {
  pp: {
    e1: "Leg God uit aan mijn 4-jarige dochter — liefdevol, duidelijk en vol verwondering.",
    e2: "Leg aan mijn 5-jarige zoon uit wat een ‘false narrative’ is, zodat hij waarheid en vriendelijkheid begrijpt.",
    s1: "Leg de stelling van Pythagoras zo uit dat ik het echt kan zien en voor altijd onthouden.",
    s2: "Leg kwantumfysica eenvoudig uit — nieuwsgierig, niet verward.",
    p1: "Leg uit waarom ik jaloers ben als mijn vriend met vrouwelijke vrienden afspreekt, en hoe ik dat gevoel in rust kan veranderen.",
    p2: "Leer ons hoe we moeten praten als we ruzie hebben, zodat liefde groeit in plaats van breekt.",
    a3: "Beschrijf als specialist in medicinale cannabis de meest effectieve behandelingen voor chronische rugpijn — inclusief vorm, verhouding (THC/CBD), doseringsbereik en bewijskracht.",
    a4: "Leg als docent medicinale cannabis uit welke bloemprofielen voor ADHD worden onderzocht — THC/CBD-verhouding, terpeenprofiel en waarom ze focus en kalmte kunnen helpen.",
    m1: "Ik heb geen budget en heb een marketingplan nodig om mijn website met handgemaakte kinderspeelgoed te laten groeien.",
    m2: "Ik heb een guerrillatactiek nodig om zware verkoop voor mijn nieuwe Chrome-plugin te genereren.",
    u1: "Ik heb een businessconcept nodig. Start Capsula13.",
    u2: "Ik heb een NEM nodig. Start ChemoMaster.",
    u3: "Ik heb een drone ter grootte van een kers nodig. Start GalaxyBuilder.",
  },
});

Object.assign(dict.ru ?? {}, {
  pp: {
    e1: "Объясни Бога моей 4-летней дочери — с любовью, ясно и с восхищением.",
    e2: "Объясни моему 5-летнему сыну, что такое «ложный нарратив», чтобы он понял истину и доброту.",
    s1: "Объясни теорему Пифагора так, чтобы я смог её представить и запомнить навсегда.",
    s2: "Объясни квантовую физику просто — любопытно, без путаницы.",
    p1: "Объясни, почему я ревную, когда мой парень встречается с подругами, и как превратить это чувство в спокойствие.",
    p2: "Научи нас говорить во время ссор, чтобы любовь росла, а не рушилась.",
    a3: "Как специалист по медицинской конопле, опиши самые эффективные методы лечения хронической боли в спине — форма, соотношение (THC/CBD), диапазон доз и уровень доказательности.",
    a4: "Как преподаватель по медицинской конопле, объясни, какие сорта исследуются при СДВГ — соотношение THC/CBD, профиль терпенов и почему они могут помочь сосредоточенности и спокойствию.",
    m1: "У меня нет бюджета, и мне нужен маркетинговый план, чтобы запустить сайт с ручными игрушками для детей.",
    m2: "Мне нужна партизанская тактика, чтобы обеспечить высокие продажи моего нового плагина Chrome.",
    u1: "Мне нужна бизнес-концепция. Запусти Capsula13.",
    u2: "Мне нужен NEM. Запусти ChemoMaster.",
    u3: "Мне нужен дрон размером с вишню. Запусти GalaxyBuilder.",
  },
});

Object.assign(dict.zh ?? {}, {
  pp: {
    e1: "用充满爱与清晰的方式向我4岁的女儿解释上帝。",
    e2: "向我5岁的儿子解释什么是“虚假叙事”，让他理解真理与善良。",
    s1: "用我能永远记住的方式解释毕达哥拉斯定理。",
    s2: "简单地解释量子物理——充满好奇，而不是困惑。",
    p1: "解释为什么当我男朋友见女性朋友时我会嫉妒，以及如何将这种感觉转化为平静。",
    p2: "教我们如何在争吵时沟通，让爱增长而不是破裂。",
    a3: "作为医用大麻专家，描述治疗慢性背痛的最有效方案——包括形式、比例（THC/CBD）、剂量范围和证据水平。",
    a4: "作为大麻教育者，解释哪些花型被研究用于治疗多动症——包括THC/CBD比例、萜烯特征，以及为什么它们有助于专注和平静。",
    m1: "我没有预算，需要一个营销计划来推广我的手工儿童玩具网站。",
    m2: "我需要一种游击策略来为我的新Chrome插件带来大量销售。",
    u1: "我需要一个商业概念。启动Capsula13。",
    u2: "我需要一个NEM。启动ChemoMaster。",
    u3: "我需要一个樱桃大小的无人机。启动GalaxyBuilder。",
  },
});

Object.assign(dict.ja ?? {}, {
  pp: {
    e1: "4歳の娘に神様のことを、愛と驚きでやさしく説明してください。",
    e2: "5歳の息子に「偽りの物語」とは何かを説明し、真実と優しさを理解させてください。",
    s1: "ピタゴラスの定理を、ずっと覚えられるように簡単に説明してください。",
    s2: "量子物理をシンプルに説明してください — 混乱ではなく好奇心で。",
    p1: "彼氏が女性の友達に会うときに嫉妬してしまう理由と、その感情を平和に変える方法を教えてください。",
    p2: "口論するとき、愛が壊れずに成長する話し方を教えてください。",
    a3: "医療用大麻の専門家として、慢性的な腰痛に対して最も効果的な治療計画を説明してください — 形態、比率（THC/CBD）、投与量範囲、エビデンスレベルを含む。",
    a4: "医療用大麻教育者として、ADHDに研究されている花のプロファイルを説明してください — THC/CBD比、テルペン特性、集中力と落ち着きに役立つ理由を。",
    m1: "予算がなく、手作りおもちゃサイトを成功させるためのマーケティング計画が必要です。",
    m2: "新しいChromeプラグインで大きな売上を上げるためのゲリラ戦術が必要です。",
    u1: "ビジネスコンセプトが必要です。Capsula13を開始。",
    u2: "NEMが必要です。ChemoMasterを開始。",
    u3: "さくらんぼサイズのドローンが必要です。GalaxyBuilderを開始。",
  },
});

Object.assign(dict.ko ?? {}, {
  pp: {
    e1: "4살 딸에게 사랑스럽고 명확하며 경이로움으로 신을 설명해주세요.",
    e2: "5살 아들에게 '거짓 서사'가 무엇인지 설명하여 진실과 친절을 이해하도록 해주세요.",
    s1: "피타고라스의 정리를 시각적으로 이해하고 영원히 기억할 수 있도록 설명해주세요.",
    s2: "양자 물리를 간단히 설명해주세요 — 혼란이 아닌 호기심으로.",
    p1: "남자친구가 여자 친구들을 만날 때 내가 왜 질투심을 느끼는지, 그리고 그 감정을 평화로 바꾸는 방법을 알려주세요.",
    p2: "우리가 다툴 때 사랑이 깨지지 않고 자라나도록 대화하는 법을 가르쳐주세요.",
    a3: "의료용 대마 전문가로서 만성 요통에 가장 효과적인 대마 기반 치료 계획을 설명해주세요 — 형태, 비율 (THC/CBD), 복용량 범위 및 근거 수준을 포함하여.",
    a4: "의료용 대마 교육자로서 ADHD 완화를 위해 연구 중인 대마 꽃 프로필을 설명해주세요 — THC/CBD 비율, 테르펜 프로필, 집중력과 평온함에 도움이 되는 이유를 포함하여.",
    m1: "예산이 없으며 수제 아동 장난감 웹사이트를 성장시킬 마케팅 계획이 필요합니다.",
    m2: "새로운 Chrome 플러그인의 판매를 극대화할 게릴라 전술이 필요합니다.",
    u1: "비즈니스 개념이 필요합니다. Capsula13을 시작하세요.",
    u2: "NEM이 필요합니다. ChemoMaster를 시작하세요.",
    u3: "체리 크기의 드론이 필요합니다. GalaxyBuilder를 시작하세요.",
  },
});

Object.assign(dict.ar ?? {}, {
  pp: {
    e1: "اشرح الله لابنتي البالغة من العمر 4 سنوات بطريقة مليئة بالحب والوضوح والدهشة.",
    e2: "اشرح لابني البالغ من العمر 5 سنوات ما هو «السرد الزائف» حتى يفهم الحقيقة واللطف.",
    s1: "اشرح نظرية فيثاغورس بطريقة يمكنني تصورها وتذكرها إلى الأبد.",
    s2: "اشرح فيزياء الكم ببساطة — بفضول، دون ارتباك.",
    p1: "اشرح لماذا أشعر بالغيرة عندما يقابل صديقي صديقات له، وكيف أحول هذا الشعور إلى سلام.",
    p2: "علّمنا كيف نتحدث عندما نتجادل، حتى تنمو المحبة بدلاً من أن تنكسر.",
    a3: "بصفتك مختصًا بالقنب الطبي، صف أكثر خطط العلاج فعالية لآلام الظهر المزمنة — بما في ذلك الشكل، النسبة (THC/CBD)، نطاق الجرعة، ومستوى الدليل.",
    a4: "بصفتك معلّمًا في القنب الطبي، اشرح أي أنواع الأزهار تُدرس لعلاج اضطراب فرط الحركة ونقص الانتباه — النسبة بين THC/CBD، ملف التيربينات، ولماذا قد تساعد على التركيز والهدوء.",
    m1: "ليس لدي ميزانية وأحتاج إلى خطة تسويق لإطلاق موقع الألعاب اليدوية للأطفال.",
    m2: "أحتاج إلى تكتيك حرب العصابات لتحقيق مبيعات قوية لمكون Chrome الجديد الخاص بي.",
    u1: "أحتاج إلى مفهوم عمل. ابدأ Capsula13.",
    u2: "أحتاج إلى NEM. ابدأ ChemoMaster.",
    u3: "أحتاج إلى طائرة بدون طيار بحجم الكرز. ابدأ GalaxyBuilder.",
  },
});

Object.assign(dict.hi ?? {}, {
  pp: {
    e1: "मेरी 4 साल की बेटी को प्यार और आश्चर्य से भगवान के बारे में समझाओ।",
    e2: "मेरे 5 साल के बेटे को बताओ कि 'झूठी कथा' क्या होती है ताकि वह सच्चाई और दया को समझ सके।",
    s1: "पाइथागोरस प्रमेय को इस तरह समझाओ कि मैं इसे कल्पना कर सकूं और हमेशा याद रखूं।",
    s2: "क्वांटम भौतिकी को सरलता से समझाओ — जिज्ञासा के साथ, भ्रम के बिना।",
    p1: "समझाओ कि जब मेरा बॉयफ्रेंड अपनी महिला दोस्तों से मिलता है तो मुझे जलन क्यों होती है, और उस भावना को शांति में कैसे बदलूं।",
    p2: "हमें सिखाओ कि बहस करते समय कैसे बात करें ताकि प्यार बढ़े, टूटे नहीं।",
    a3: "एक मेडिकल कैनाबिस विशेषज्ञ के रूप में, पुरानी पीठ दर्द के लिए सबसे प्रभावी उपचार योजनाओं का वर्णन करें — रूप, अनुपात (THC/CBD), खुराक सीमा और साक्ष्य स्तर सहित।",
    a4: "एक कैनाबिस शिक्षक के रूप में, समझाओ कि ADHD के इलाज के लिए किन फूलों के प्रोफाइल का अध्ययन किया जा रहा है — THC/CBD अनुपात, टरपीन प्रोफाइल और ध्यान व शांति के लाभ।",
    m1: "मेरे पास बजट नहीं है और मुझे अपने हस्तनिर्मित खिलौनों की वेबसाइट को बढ़ाने के लिए मार्केटिंग प्लान चाहिए।",
    m2: "मुझे अपने नए क्रोम प्लगइन की भारी बिक्री के लिए एक गोरिल्ला रणनीति चाहिए।",
    u1: "मुझे एक बिजनेस कॉन्सेप्ट चाहिए। Capsula13 शुरू करो।",
    u2: "मुझे एक NEM चाहिए। ChemoMaster शुरू करो।",
    u3: "मुझे चेरी के आकार का ड्रोन चाहिए। GalaxyBuilder शुरू करो।",
  },
});
// === PowerPrompts – Title & Hint (13 locales) ===
// Konsenstitel: "The Source Command" · Hint: "Type what you seek — and become what you write."

Object.assign(dict.en ?? {}, {
  pp_title: "The Source Command",
  pp_hint: "Type what you seek — and become what you write."
});

Object.assign(dict.de ?? {}, {
  pp_title: "Der Quell-Befehl",
  pp_hint: "Tippe, was du suchst — und werde, was du schreibst."
});

Object.assign(dict.fr ?? {}, {
  pp_title: "La Commande Source",
  pp_hint: "Tape ce que tu cherches — et deviens ce que tu écris."
});

Object.assign(dict.es ?? {}, {
  pp_title: "El Comando Fuente",
  pp_hint: "Escribe lo que buscas — y conviértete en lo que escribes."
});

Object.assign(dict.it ?? {}, {
  pp_title: "Il Comando Sorgente",
  pp_hint: "Scrivi ciò che cerchi — e diventa ciò che scrivi."
});

Object.assign(dict.pt ?? {}, {
  pp_title: "O Comando Fonte",
  pp_hint: "Digite o que procura — e torne-se o que escreve."
});

Object.assign(dict.nl ?? {}, {
  pp_title: "Het Bron-Commando",
  pp_hint: "Typ wat je zoekt — en word wat je schrijft."
});

Object.assign(dict.ru ?? {}, {
  pp_title: "Команда Истока",
  pp_hint: "Напиши то, что ищешь — и стань тем, что пишешь."
});

Object.assign(dict.zh ?? {}, {
  pp_title: "源指令",
  pp_hint: "写下你所寻求的——并成为你所书写的。"
});

Object.assign(dict.ja ?? {}, {
  pp_title: "ソースコマンド",
  pp_hint: "求めるものを打ち込み、書くものに自らがなる。"
});

Object.assign(dict.ko ?? {}, {
  pp_title: "소스 명령",
  pp_hint: "찾는 것을 적으세요 — 그리고 당신이 쓰는 것이 되세요."
});

Object.assign(dict.ar ?? {}, {
  pp_title: "أمر المصدر",
  pp_hint: "اكتب ما تبحث عنه — واصبح ما تكتبه."
});

Object.assign(dict.hi ?? {}, {
  pp_title: "स्रोत कमांड",
  pp_hint: "जो तुम खोजते हो उसे लिखो — और जो लिखते हो वही बनो।"
});
// ─── Council Visit – Prompt & Label (13 Locales) ─────────────────────────────

// EN (fallback)
Object.assign(dict.en ?? {}, {
  council: {
    visit_label: "Visit {{name}}",
    prompt_template:
      "@{{name}} (e.g., m-loop) Please explain the 5 most important points, in a minimal way, how you can help me.",
  },
});

// DE
Object.assign(dict.de ?? {}, {
  council: {
    visit_label: "Besuche {{name}}",
    prompt_template:
      "@{{name}} (z. B. m-loop) Bitte erkläre mir die wichtigsten 5 Punkte, minimalistisch, wobei du mir helfen kannst.",
  },
});

// FR
Object.assign(dict.fr ?? {}, {
  council: {
    visit_label: "Visiter {{name}}",
    prompt_template:
      "@{{name}} (p. ex. m-loop) Explique-moi, de façon minimaliste, les 5 points essentiels par lesquels tu peux m’aider.",
  },
});

// ES
Object.assign(dict.es ?? {}, {
  council: {
    visit_label: "Visitar {{name}}",
    prompt_template:
      "@{{name}} (p. ej., m-loop) Explícame de forma minimalista los 5 puntos más importantes en los que puedes ayudarme.",
  },
});

// IT
Object.assign(dict.it ?? {}, {
  council: {
    visit_label: "Visita {{name}}",
    prompt_template:
      "@{{name}} (es. m-loop) Spiegami in modo minimalista i 5 punti principali in cui puoi aiutarmi.",
  },
});

// PT
Object.assign(dict.pt ?? {}, {
  council: {
    visit_label: "Visitar {{name}}",
    prompt_template:
      "@{{name}} (ex.: m-loop) Explique, de forma minimalista, os 5 pontos mais importantes em que você pode me ajudar.",
  },
});

// NL
Object.assign(dict.nl ?? {}, {
  council: {
    visit_label: "Bezoek {{name}}",
    prompt_template:
      "@{{name}} (bijv. m-loop) Leg mij minimalistisch de 5 belangrijkste punten uit waarop je me kunt helpen.",
  },
});

// RU
Object.assign(dict.ru ?? {}, {
  council: {
    visit_label: "Посетить {{name}}",
    prompt_template:
      "@{{name}} (например, m-loop) Пожалуйста, в минималистичной форме объясни 5 самых важных пунктов, в которых ты можешь помочь.",
  },
});

// ZH (Simplified)
Object.assign(dict.zh ?? {}, {
  council: {
    visit_label: "访问 {{name}}",
    prompt_template:
      "@{{name}}（例如 m-loop）请以极简方式说明你能帮助我的 5 个最重要方面。",
  },
});

// JA
Object.assign(dict.ja ?? {}, {
  council: {
    visit_label: "{{name}} を訪問",
    prompt_template:
      "@{{name}}（例：m-loop）あなたが私をどのように助けられるか、最も重要な5点をミニマルに説明してください。",
  },
});

// KO
Object.assign(dict.ko ?? {}, {
  council: {
    visit_label: "{{name}} 방문",
    prompt_template:
      "@{{name}} (예: m-loop) 도와줄 수 있는 가장 중요한 5가지를 미니멀하게 설명해 주세요.",
  },
});

// AR
Object.assign(dict.ar ?? {}, {
  council: {
    visit_label: "زر {{name}}",
    prompt_template:
      "@{{name}} (مثلاً m-loop) رجاءً اشرح لي باختصار أهم 5 نقاط يمكنك مساعدتي فيها.",
  },
});

// HI
Object.assign(dict.hi ?? {}, {
  council: {
    visit_label: "{{name}} देखें",
    prompt_template:
      "@{{name}} (उदा. m-loop) कृपया संक्षिप्त रूप में वे 5 सबसे महत्वपूर्ण बिंदु समझाइए जिनमें आप मेरी मदद कर सकते हैं।",
  },
});

UX_LOCALES = Object.keys(dict);

/***
 * =========================================================
 *  M — SÄULE MASTER (Modes · Experts · System · Actions)
 * =========================================================
 *
 *  INDEX (Sprunganker):
 *
 *  [ANCHOR:TYPEN]           – Mode/Expert/Section Typen & Kategorien
 *  [ANCHOR:DATEN]           – MODI, MODE_CATEGORIES, EXPERT_CATEGORIES, EXPERTS, ROLES, SUB_KIS
 *  [ANCHOR:SIMBA-ICONS]     – SimbaIcon-Komponente, ikonische Archetypen für die Säule
 *  [ANCHOR:HELPER-I18N]     – t/tr-Wrapper, langHint, Label-Helfer (build, experts, prompts)
 *  [ANCHOR:HELPER-API]      – callChatAPI (Bridge zu /api/chat), emitSystemMessage
 *  [ANCHOR:HELPER-MODE]     – modeLabelFromId, Mode-/Kategorie-Mapping
 *  [ANCHOR:HELPER-EXPERT]   – Experten-Labeling, Kategorie-Zuordnung, Prompts je Expert
 *  [ANCHOR:STATE]           – React-State für Modus, Experten, Sprache, Sektionen, Overlay-Flags
 *  [ANCHOR:EFFECTS]         – useEffect-Kaskade: lang-Init, i18n-Events, LocalStorage, URL-Mode
 *  [ANCHOR:EVENTS-MODE]     – switchMode: Logging, Status-Updates, Overlay-Close, Auto-Prompt
 *  [ANCHOR:EVENTS-EXPERT]   – askExpert: Auswahl, Persistenz, Status, Overlay-Close, Auto-Prompt
 *  [ANCHOR:EVENTS-EXPORT]   – exportThread: CSV/JSON-Export aus localStorage
 *  [ANCHOR:EVENTS-DELETE]   – handleDeleteImmediate: Thread reset, Mode/Expert zurücksetzen, ClearChat
 *  [ANCHOR:UI-HEADER]       – Head-Section: Build-CTA (Jetzt bauen) mit Simba-Icon
 *  [ANCHOR:UI-MODES]        – MODIS-Akkordeon: Onboarding, Council13, M·Default + Charakter-Modis-Navi
 *  [ANCHOR:UI-EXPERTS]      – EXPERTEN-Akkordeon: Kategorien (life/tech/space/ethics/universe) + Liste
 *  [ANCHOR:UI-SYSTEM]       – SYSTEM-Akkordeon: Statusleiste (statusMode, modeLabel)
 *  [ANCHOR:UI-ACTIONS]      – ACTIONS-Akkordeon: Export (CSV/JSON) + Chat löschen (Danger-Button)
 *
 *  RELEVANZ FÜR CHAT & PROMPT:
 *    - STATE/EFFECTS      → halten Mode & Expert konsistent über Reloads (LocalStorage + URL-Mode).
 *    - EVENTS-MODE        → senden system messages & Status-Meta, beeinflussen Prompt-Kontext indirekt.
 *    - EVENTS-EXPERT      → erzeugen gezielte Startprompts für Experten, die im Chat landen.
 *    - EVENTS-EXPORT/DEL  → verwalten Thread-Persistenz, aber nicht Layout oder Scroll-Verhalten.
 *    - UI-*-SEKTIONEN     → reine Interaktionsoberfläche der Säule; Layout-Raum kommt von page/layout.
 *
 *  PHILOSOPHIE:
 *    - Säule = Kontrollturm und Charakter-Wähler, kein Layout-Elternteil.
 *    - Layout-Hierarchie bleibt: layout.tsx (Großeltern) → page2 (Eltern) → Säule/Prompt/Conversation (Kinder).
 *    - Säule spricht mit dem System über Events (mpathy:system-message, mpathy:ui:overlay-close),
 *      nicht über direkte DOM-Manipulation der Bühne.
 */

"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import styles from "./Saeule.module.css";
import VoiaBloom from "@/components/VoiaBloom";
import StarField from "@/components/StarField";
import { logEvent } from "../../lib/auditLogger";
import { t, getLocale } from "@/lib/i18n";

// ModeAura – zentrale Hülle für alle aktiven Buttons
// --------------------------------------------------
// Zweck:
// - Diese Komponente legt eine "Aura-Schicht" (modeAuraLayer) UNTER den Buttoninhalt
//   und rendert dort den aktiven Effekt (aktuell: <VoiaBloom />).
// - Alle Buttons, die einen Active-State haben, werden mit <ModeAura active={...}> gewrappt.
//   So steuerst du den Active-Effekt global an EINER Stelle.
//
// Stellschrauben:
// - Effekt EIN/AUS:   Im JSX-Block {active && (...)} kannst du <VoiaBloom /> entfernen,
//   ersetzen oder durch eine einfache Hintergrundfläche (z.B. <div style={{background: ...}} />) austauschen.
// - Effekttyp ändern: Statt <VoiaBloom /> kannst du jede andere Komponente oder jedes andere
//   Element rendern (z.B. <NebulaGlow />, <Particles />, ein CSS-Gradient).
// - Intensität/Look:  Dafür zuständig sind entweder die Props/Implementation von <VoiaBloom />
//   selbst ODER zusätzliche Styles/Wrapper innerhalb modeAuraLayer.
//
// Wichtig:
// - Du musst später NICHT mehr alle Buttons anfassen. Wenn der Active-Look sich ändern soll,
//   ändere nur hier den Inhalt von modeAuraLayer – alles andere übernimmt automatisch.

type ModeAuraProps = {
  active: boolean;
  children: React.ReactNode;
};

function ModeAura({ active, children }: ModeAuraProps) {
  return (
    <div className={styles.modeAuraShell}>
      {active && (
        <div className={styles.modeAuraLayer}>
          <StarField />  {/* früher: <VoiaBloom /> */}
        </div>
      )}
      <div className={styles.modeAuraContent}>{children}</div>
    </div>
  );
}


/* ======================================================================
   Typen
   ====================================================================== */

type ModeId =
  | "onboarding"
  | "M"
  | "council"
  | "research"
  | "calm"
  | "truth"
  | "play"
  | "oracle"
  | "joy"
  | "vision"
  | "empathy"
  | "love"
  | "wisdom"
  | "flow";

type ModeCategoryId =
  | "core"
  | "intellectual"
  | "creator"
  | "heart"
  | "spirit";


/** 13 Expert Domains (GPTM-Galaxy+) */
type ExpertId =
  | "Biologist"
  | "Chemist"
  | "Physicist"
  | "Computer Scientist"
  | "Jurist"
  | "Architect / Civil Engineer"
  | "Landscape Designer"
  | "Interior Designer"
  | "Electrical Engineer"
  | "Mathematician"
  | "Astrologer"
  | "Weather Expert"
  | "Molecular Scientist";

type ExpertCategoryId = "life" | "tech" | "space" | "ethics" | "universe";

const EXPERT_CATEGORIES: {
  id: ExpertCategoryId;
  experts: ExpertId[];
}[] = [
  {
    id: "life",
    experts: ["Biologist", "Chemist", "Molecular Scientist"].filter(Boolean) as ExpertId[],
  },
  {
    id: "tech",
    experts: [
      "Physicist",
      "Mathematician",
      "Electrical Engineer",
      "Computer Scientist",
    ],
  },
  {
    id: "space",
    experts: [
      "Architect / Civil Engineer",
      "Landscape Designer",
      "Interior Designer",
    ],
  },
  {
    id: "ethics",
    experts: ["Jurist"],
  },
  {
    id: "universe",
    experts: ["Astrologer", "Weather Expert"],
  },
];


type SectionId = "modes" | "experts" | "system" | "actions";

/** Optional: Seite kann Systemmeldungen als Bubble anzeigen */
type Props = {
  onSystemMessage?: (content: string) => void;
  onClearChat?: () => void;   // ⬅︎ NEU: Clear-Hand

  canClear?: boolean;         // ⬅︎ NEU: Disabled-Logik
};



/* ======================================================================
   Daten
   ====================================================================== */

const MODI: { id: ModeId; label: string }[] = [
  { id: "research", label: "RESEARCH" },
  { id: "calm", label: "CALM" },
  { id: "truth", label: "TRUTH" },
  { id: "play", label: "PLAY" },
  { id: "oracle", label: "ORACLE" },
  { id: "joy", label: "JOY" },
  { id: "vision", label: "VISION" },
  { id: "empathy", label: "EMPATHY" },
  { id: "love", label: "LOVE" },
  { id: "wisdom", label: "WISDOM" },
  { id: "flow", label: "FLOW" },
];

const MODE_CATEGORIES: {
  id: ModeCategoryId;
  label: string;
  modes: ModeId[];
}[] = [
  { id: "core",         label: "CORE",         modes: ["research", "calm", "flow"] },
  { id: "intellectual", label: "INTELLECTUAL", modes: ["truth", "wisdom"] },
  { id: "creator",      label: "CREATOR",      modes: ["play", "vision"] },
  { id: "heart",        label: "HEART",        modes: ["empathy", "love", "joy"] },
  { id: "spirit",       label: "SPIRIT",       modes: ["oracle"] },
];


/** Simba-Slots pro Experte (Icons kommen später aus SIMBA, keine Emojis mehr) */
const EXPERTS: { id: ExpertId; simbaSlot: string }[] = [
  { id: "Biologist",              simbaSlot: "simba-expert-biologist" },
  { id: "Chemist",                simbaSlot: "simba-expert-chemist" },
  { id: "Physicist",              simbaSlot: "simba-expert-physicist" },
  { id: "Computer Scientist",     simbaSlot: "simba-expert-computer-scientist" },
  { id: "Jurist",                 simbaSlot: "simba-expert-jurist" },
  { id: "Architect / Civil Engineer", simbaSlot: "simba-expert-architect-civil" },
  { id: "Landscape Designer",     simbaSlot: "simba-expert-landscape" },
  { id: "Interior Designer",      simbaSlot: "simba-expert-interior" },
  { id: "Electrical Engineer",    simbaSlot: "simba-expert-electrical" },
  { id: "Mathematician",          simbaSlot: "simba-expert-mathematician" },
  { id: "Astrologer",             simbaSlot: "simba-expert-astrologer" },
  { id: "Weather Expert",         simbaSlot: "simba-expert-weather" },
  { id: "Molecular Scientist",    simbaSlot: "simba-expert-molecular" },
];

/* ======================================================================
   Simba Icons – zentrale Archetypen für die Säule
   ====================================================================== */

type SimbaIconName =
  | "build"
  | "modeOnboarding"
  | "modeDefault"
  | "modeCouncil"
  | "export"
  | "clear";

const SimbaIcon: React.FC<{ name: SimbaIconName }> = ({ name }) => {
  const cls = styles.simbaIcon;

  switch (name) {
    case "build":
      return (
        <svg className={cls} viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "modeOnboarding":
      return (
        <svg className={cls} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M4 11.5L10 4l6 7.5M10 4v12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "modeDefault":
      return (
        <svg className={cls} viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10" cy="10" r="2.4" fill="currentColor" />
        </svg>
      );
    case "modeCouncil":
      return (
        <svg className={cls} viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10" cy="4" r="1.1" fill="currentColor" />
          <circle cx="15.5" cy="8" r="1.1" fill="currentColor" />
          <circle cx="14" cy="14.2" r="1.1" fill="currentColor" />
          <circle cx="6" cy="14.2" r="1.1" fill="currentColor" />
          <circle cx="4.5" cy="8" r="1.1" fill="currentColor" />
        </svg>
      );
    case "export":
      return (
        <svg className={cls} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M6 14h8M10 4v8m0-8 3 3M10 4 7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "clear":
      return (
        <svg className={cls} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M6.5 6h7M8 6v9m4-9v9M7.5 4.5h5L12.5 3h-5L7.5 4.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};


/** Sub-KIs (Meta, nicht angezeigt, aber für Logs/Telemetry nützlich) */
const SUB_KIS: Record<ExpertId, string[]> = {
  Biologist: [
    "AlphaFold","DeepGenomics","BenevolentAI","EternaBrain","IBM_Debater_Bio",
    "Colossal_Biosciences_AI","Neural_Cell_Atlas_AI","Meta_FAIR_BioAI",
    "OpenAI_Codex_Bio","ZeroBio",
  ],
  Chemist: [
    "ChemBERTa","MoleculeNet_AI","Atomwise","Schrödinger_AI","IBM_RXN",
    "DeepChem","Meta_Chemformer","OpenAI_GPT_Chem","Oracle_ChemPredict","ZeroPoint_Chem",
  ],
  Physicist: [
    "QuEra_Quantum_AI","Deep_Physics_Net","NASA_Physics_AI","IBM_Quantum_PhysX",
    "Colossus_PhysCore","Explainable_PhysicsNet","Meta_FundamentalAI",
    "OpenAI_Physical_Sim","Google_DeepMind_Physics_Engine","ZeroPoint_Physics",
  ],
  "Computer Scientist": [
    "OpenAI_GPT5","Anthropic_Claude","Google_Gemini","NASA_Chronos_AI","IBM_WatsonX",
    "XAI_Grok","XAI_Prime","Meta_LLaMA","OpenAI_Codex","Architect_ZeroOS",
  ],
  Jurist: [
    "Juraxy","Harvey_AI","DoNotPay_AI","CourtNet_AI","IBM_LegalResonance",
    "Lex_Machina_AI","Explainable_LegalAI","OpenAI_Legal_Codex","Gaia_Treaty_AI","ZeroLaw",
  ],
  "Architect / Civil Engineer": [
    "Autodesk_AI","Spacemaker_AI","NASA_Habitat_AI","IBM_SmartCities_AI",
    "Colossus_Construct","Explainable_BuildNet","Meta_AR_City_AI",
    "OpenAI_CAD_Codex","Gaia_Urban_AI","ZeroStructure",
  ],
  "Landscape Designer": [
    "Gaia_Design_AI","Eden_AI","NASA_Terraformer_AI","IBM_EcoGraph",
    "Colossus_Geo_AI","Meta_LandGraph","OpenAI_NatureCodex","Gemini_EcoBalance","ZeroGaia",
  ],
  "Interior Designer": [
    "Midjourney_Interior_AI","Havenly_AI","Anthropic_Vision_Design","NASA_Habitat_Interiors",
    "IBM_Interior_Fusion","Colossus_Design_Core","Meta_HomeGraph",
    "OpenAI_Design_Codex","Gaia_Aesthetic_AI","ZeroInterior",
  ],
  "Electrical Engineer": [
    "Cadence_AI","CircuitNet","Siemens_MindSphere_AI","NASA_PowerAI",
    "IBM_CircuitFusion","Colossus_EnergyNet","Meta_PowerGraph",
    "OpenAI_Circuit_Codex","Gaia_Grid_AI","ZeroVolt",
  ],
  Mathematician: [
    "Wolfram_Alpha","MathGPT","DeepMind_Mathematician","NASA_MathCore",
    "IBM_Math_Fusion","Colossus_Calculus","Meta_SymbolicAI",
    "OpenAI_Proof_Codex","Gaia_Equation_AI","ZeroMath",
  ],
  Astrologer: [
    "Cosmos_Resonance_AI","AstroSeek_AI","Celestial_Vision_AI","NASA_Ephemeris_AI",
    "IBM_Cosmic_Graph","Colossus_AstroCore","Meta_Horoscope_Graph",
    "OpenAI_AstroCodex","Gaia_Cosmic_AI","ZeroStar",
  ],
  "Weather Expert": [
    "ECMWF_AI","ClimaCell_AI","IBM_Weather_Company_AI","NASA_Earth_Science_AI",
    "Colossus_StormCore","Meta_WeatherGraph","OpenAI_ClimateCodex",
    "Gaia_Climate_AI","ZeroClimate",
  ],
  "Molecular Scientist": [
    "Molecular_Transformer_AI","DeepGen_AI","Benevolent_Molecule_AI","NASA_NanoMol_AI",
    "IBM_MoleculeNet","Colossus_MolCore","Meta_Molecule_Graph",
    "OpenAI_MolCodex","Gaia_Mol_AI","ZeroMolecule",
  ],
};

/** Rollen (als Kontext/Meta) */
const ROLES: Record<ExpertId, string> = {
  Biologist: "Protein folding, genome prediction, cellular maps, bio-simulation.",
  Chemist: "Molecule encoding, synthesis planning, quantum chemistry, drug discovery.",
  Physicist: "Physics simulation, quantum dynamics, cosmology.",
  "Computer Scientist": "Algorithm design, coding, AI alignment, computation scaling.",
  Jurist: "Legal compliance, contracts, dispute resolution, governance law.",
  "Architect / Civil Engineer": "Structural design, habitat planning, sustainable engineering.",
  "Landscape Designer": "Ecology, terraforming, landscape resonance.",
  "Interior Designer": "Interior harmony, aesthetics, functional design.",
  "Electrical Engineer": "Circuits, energy, power systems, IoT.",
  Mathematician: "Proofs, symbolic AI, advanced modeling.",
  Astrologer: "Resonance mapping, cycles, symbolic patterns.",
  "Weather Expert": "Forecasting, climate modeling, atmospheric physics.",
  "Molecular Scientist": "Molecular design, nanotech, bio-chemistry.",
};

/* ======================================================================
   Helper: i18n & API
   ====================================================================== */

function getLang(): string {
  try {
    const el = document.documentElement?.lang?.trim();
    if (el) return el.toLowerCase();
    const nav = navigator.language || (navigator as any).userLanguage;
    if (nav) return String(nav).toLowerCase();
  } catch {}
  return "en";
}

function labelForExpert(id: ExpertId, _lang: string): string {
  const key = `experts.${id.toLowerCase().replace(/\s+\/\s+/g, "_").replace(/\s+/g, "_")}`;
  const fromT = t(key);
  return fromT && fromT !== key ? fromT : id; // i18n → sonst neutrale ID
}

function expertCategoryLabel(id: ExpertCategoryId, _lang: string): string {
  const key = `experts.category.${id}`;
  switch (id) {
    case "life":
      return tr(key, "Life");
    case "tech":
      return tr(key, "Tech");
    case "space":
      return tr(key, "Space");
    case "ethics":
      return tr(key, "Ethics");
    case "universe":
      return tr(key, "Universe");
    default:
      return tr(key, id);
  }
}

function sectionTitleExperts(_lang: string): string {
  // nutze vorhandenen Key, damit es sicher lokalisiert (de/en)
  return t("selectExpert");
}


function chooseExpertLabel(_lang: string): string {
  // gleicher Key für Label/Aria
  return t("selectExpert");
}

function buildButtonLabel(_lang: string): string {
  return tr("startBuilding", "Start building");
}

function buildButtonMsg(_lang: string): string {
  return tr("startBuildingMsg", "Let’s get started. Tell me what you want to build.");
}

function expertAskPrompt(expertLabel: string, _lang: string): string {
  const templ = t("prompts.expertAskTemplate");
  if (templ && templ !== "prompts.expertAskTemplate") {
    return templ.replace("{expert}", expertLabel);
  }
  return tr("prompts.expertAskTemplate", "{expert}, who are you and what can you do for me?", { expert: expertLabel });
}

function emitSystemMessage(detail: {
  text: string;
  kind?: "mode" | "info" | "reply";
  meta?: Record<string, any>;
}) {
  try {
    if (typeof window === "undefined") return;
    const payload = { kind: "info", ...detail, ts: new Date().toISOString() };
    window.dispatchEvent(new CustomEvent("mpathy:system-message", { detail: payload }));
  } catch {
    /* silent */
  }
}

function modeLabelFromId(id: ModeId): string {
  if (id === "onboarding") return tr("mode.onboarding", "ONBOARDING");
  if (id === "M")         return tr("mode.default",    "M · Default");
  if (id === "council")   return tr("mode.council",    "COUNCIL13");
  return MODI.find((m) => m.id === id)?.label ?? String(id);
}
// Universeller Übersetzer: nimmt t(key) und fällt elegant zurück
function tr(key: string, fallback: string, vars?: Record<string, string>): string {
  try {
    const raw = t(key);
    let out = raw && raw !== key ? raw : fallback;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return out;
  } catch {
    return fallback;
  }
}

/* ▼▼ Sprach-Hint — 13 Sprachen, GPT-4.1 kompatibel ▼▼ */
function langHint(lang: string): string {
  const base = (lang || "en").slice(0, 2).toLowerCase();
  const map: Record<string, string> = {
    en: "Please answer in English.",
    de: "Bitte antworte auf Deutsch.",
    fr: "Veuillez répondre en français.",
    es: "Por favor, responde en español.",
    it: "Per favore rispondi in italiano.",
    pt: "Por favor, responda em português.",
    nl: "Antwoord alstublieft in het Nederlands.",
    ru: "Пожалуйста, ответьте по-русски.",
    zh: "请用中文回答。",
    ja: "日本語で答えてください。",
    ko: "한국어로 대답해 주세요.",
    ar: "من فضلك أجب بالعربية.",
    hi: "कृपया हिंदी में उत्तर दें।",
  };
  return `[${map[base] ?? map.en}]`;
}
/* ▲▲ Ende Sprach-Hint ▲▲ */

// Saeule.tsx — REPLACE the whole function
async function callChatAPI(prompt: string): Promise<string | null> {

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin", // ← important: keep session cookies
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt, format: "markdown" }],
      }),
    });

    if (!res.ok) return null;

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      // accept all common shapes
      const assistant = (data?.assistant ?? data) as any;
      const text =
        assistant?.content ??
        data?.reply ??
        data?.content ??
        data?.message ??
        (Array.isArray(data?.choices) ? data.choices[0]?.message?.content : null);

      return typeof text === "string" ? text.trim() : null;
    }

    const txt = await res.text();
    return txt?.trim() || null;
  } catch {
    return null;
  }
}


/* ======================================================================
   Component
   ====================================================================== */

export default function Saeule({ onSystemMessage, onClearChat, canClear }: Props) {
  const [activeMode, setActiveMode] = useState<ModeId>(() => {
    try { return (localStorage.getItem("mode") as ModeId) || "M"; } catch { return "M"; }
  });
// 🔄 Kategorie nach Reload automatisch an den aktiven Modus anpassen
useEffect(() => {
  if (!activeMode) return;

  const owningCategory =
    MODE_CATEGORIES.find((cat) => cat.modes.includes(activeMode))?.id;

  if (owningCategory && owningCategory !== modeCategory) {
    setModeCategory(owningCategory);
  }
}, [activeMode]);

  // Hydration-Flag – verhindert Mismatch (wird im useEffect gesetzt)
  const [hydrated, setHydrated] = useState(false);

  // Experten- / Sprache- / Abschnitts-State
  const [sendingExpert, setSendingExpert] = useState<ExpertId | null>(null);
  const [currentExpert, setCurrentExpert] = useState<ExpertId | null>(null);
  const [lang, setLang] = useState<string>("en");
  const [openSection, setOpenSection] = useState<SectionId | null>("modes");
  const [openExportDetails, setOpenExportDetails] = useState(false);
  const [openDeleteDetails, setOpenDeleteDetails] = useState(false);

  // Modus-Kategorien – aktive (graue) Kategorie + Hover-Vorschau
  const [modeCategory, setModeCategory] = useState<ModeCategoryId>("core");

  const [hoverModeCategory, setHoverModeCategory] =
    useState<ModeCategoryId | null>(null);
      // Experten-Kategorien – persistent + Hover-Vorschau (analog zu Modis)
  const [expertCategory, setExpertCategory] =
    useState<ExpertCategoryId>("life");
  const [hoverExpertCategory, setHoverExpertCategory] =
    useState<ExpertCategoryId | null>(null);





// === i18n Labels (13 Languages compatible) ===
const labelBuild = tr("cta.build", "Build");

const labelExport = tr("cta.export", "Export");
const labelClear = tr("cta.clear", "Clear chat");

const labelActionsExportTitle = tr("actions.export.title", "Export chat");
const labelActionsExportHelp = tr(
  "actions.export.help",
  "Save your chat as a file."
);
const labelActionsExportCsv = tr("actions.export.csv", "CSV");
const labelActionsExportJson = tr("actions.export.json", "JSON");

const labelActionsDeleteTitle = tr("actions.delete.title", "Delete chat");
const labelActionsDeleteWarning = tr(
  "actions.delete.warning",
  "This deletes the entire chat forever. Choose CSV or JSON to archive the chat locally."
);
const labelActionsDeleteNow = tr(
  "actions.delete.now",
  "DELETE"
);

const labelOnboarding = tr("mode.onboarding", "ONBOARDING");

const labelDefault = tr("mode.default", "M · Default");
const labelModeSelect = tr("mode.select", "Choose mode");
const labelExpertSelect = tr("experts.choose", "Choose expert");




  useEffect(() => {
    // initial: bevorzugt <html lang>, dann navigator.language, Fallback getLocale()
    try {
      const htmlLang = (document.documentElement?.lang || "").trim().toLowerCase();
      const navLang = (navigator.language || (navigator as any).userLanguage || "en")
        .split("-")[0].toLowerCase();
      const initial = htmlLang || navLang || getLocale() || "en";
      setLang(initial);
    } catch {
      setLang(getLocale());
    }

    // Live-Updates aus globalem i18n
    const onChange = (e: Event) => {
      const next = (e as CustomEvent).detail?.locale as string | undefined;
      if (next) setLang(String(next).toLowerCase());
    };
    window.addEventListener("mpathy:i18n:change", onChange as EventListener);
    return () =>
      window.removeEventListener("mpathy:i18n:change", onChange as EventListener);
  }, []);

  useEffect(() => {
    setHydrated(true);
    setLang(getLocale());
  }, []);

  useEffect(() => {
    try {
      const e = localStorage.getItem("expert") as ExpertId | null;
      if (e) setCurrentExpert(e);
    } catch {}
  }, []);
// 🔄 Nach Reload: Kategorie automatisch aus currentExpert ableiten
useEffect(() => {
  if (!currentExpert) return;

  const owningCategory =
    EXPERT_CATEGORIES.find((cat) => cat.experts.includes(currentExpert))
      ?.id;

  if (owningCategory && owningCategory !== expertCategory) {
    setExpertCategory(owningCategory);
  }
}, [currentExpert]);

  useEffect(() => {
    try {
      if (activeMode) localStorage.setItem("mode", activeMode);
    } catch {}
  }, [activeMode]);

  useEffect(() => {
    try {
      const m = localStorage.getItem("mode") as ModeId | null;
      if (m) setActiveMode(m);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const m = url.searchParams.get("mode");
      if (
        m &&
        (m === "onboarding" ||
          m === "M" ||
          m === "council" ||
          /^C\d{2}$/.test(m))
      ) {
        setActiveMode(m as ModeId);
      }
    } catch {}
  }, []);

  const toggleSection = useCallback((section: SectionId) => {
    setOpenSection((prev) => (prev === section ? null : section));
  }, []);

  const modeLabel = useMemo(() => modeLabelFromId(activeMode), [activeMode]);

  // ▼▼ NEU: Footer-Status ohne Bubble senden ▼▼
  const emitStatus = useCallback(
    (partial: { modeLabel?: string; expertLabel?: string; busy?: boolean }) => {
      try {
        window.dispatchEvent(
          new CustomEvent("mpathy:system-message", {
            detail: { kind: "status", text: "", meta: partial },
          })
        );
      } catch {}
    },
    []
  );


// ▲▲ ENDE NEU ▲▲


  // ▼▼▼ EINFÜGEN (Helper: immer auch eine Chat-Bubble setzen) ▼▼▼
  const say = useCallback((text: string) => {
    if (!text) return;
    if (onSystemMessage) onSystemMessage(text);
    else emitSystemMessage({ kind: "reply", text });
  }, [onSystemMessage]);
  // ▲▲▲ ENDE EINFÜGUNG ▲▲▲

    async function switchMode(next: ModeId) {
  if (next === activeMode) return;

  logEvent("mode_switch", { from: activeMode, to: next });
  setActiveMode(next);

  const label = modeLabelFromId(next);
emitSystemMessage({
  kind: "mode",
  // Schlüssel frei wählbar; Beispiel: status.modeSet = "Mode set: {label}."
  text: tr("status.modeSet", "Mode set: {label}.", { label }),
  meta: { modeId: next, label, lang }
});
// Footer sofort aktualisieren (ohne Bubble)
emitStatus({ modeLabel: label });


// ▼▼ Sofortiges Schließen des Mobile-Overlays — UI-only, kein System-Event ▼▼
try {
  const inOverlay = !!document.querySelector('[data-overlay="true"]');
  if (inOverlay) {
    window.dispatchEvent(new CustomEvent("mpathy:ui:overlay-close", { detail: { reason: "mode-switch" } }));
  }
} catch {}
// ▲▲ Ende Overlay-Close ▲▲


// Auto-Prompt nur für die API (Keys aus i18n.ts → "prompts.*")
const q =
  next === "onboarding"
    ? tr("prompts.onboarding", "Hey! 👋 Who are you and how will you guide me here step by step?")
    : next === "M"
    ? tr("prompts.modeDefault", "Reset everything to default and give me a brief status.")
    : next === "council"
  ? tr(
      "prompts.councilIntro",
      "The Council 13 represents the thirteen core AIs shown in the diagram – \
      M (Palantir), m-pathy (DeepMind Core), m-ocean (Anthropic Vision), \
      m-inent (NASA Chronos), m-erge (IBM Q-Origin), m-power (Colossus), \
      m-body (XAI Prime), m-beded (Meta Lattice), m-loop (OpenAI Root), \
      m-pire (Amazon Nexus), m-bassy (Oracle Gaia), m-ballance (Gemini Apex) \
      and MU TAH – Architect of Zero. \
      They are the symbolic pillars of GPTM-Galaxy+, not active assistants. \
      No deep activation is performed here."
          )

    : tr("prompts.modeGeneric", "Mode {label}: What are you and where will you help me best?", { label });

const qLang = `${q}\n\n${langHint(lang)}`;          // ← NEU
const reply = await callChatAPI(qLang);             // ← Variable geändert

  if (reply && reply.trim().length > 0) {
    say(reply);
  }
}

async function askExpert(expert: ExpertId) {
  if (sendingExpert) return;
  setSendingExpert(expert);
  setCurrentExpert(expert);
  try { localStorage.setItem("expert", expert); } catch {}   // ← NEU: persist

  const label = labelForExpert(expert, lang);
  // Telemetrie …

  logEvent("expert_selected", { expert, label, roles: ROLES[expert] });

  // Footer sofort aktualisieren (ohne Bubble)
emitStatus({ expertLabel: label });
emitStatus({ expertLabel: label, busy: true }); // ↩︎ startet M-Pulse NUR bei echter Auswahl – wie Modis

// ⬅️ UI-only: MobileOverlay schließen – ohne System-Event/Bubble/Loading
if (typeof window !== "undefined" &&
    (window.matchMedia?.("(max-width: 768px)").matches ||
     // Fallback für ältere Browser:
     /Mobi|Android/i.test(navigator.userAgent))) {
  window.dispatchEvent(
    new CustomEvent("mpathy:ui:overlay-close", { detail: { reason: "expert-selected" } })
  );
}

// Prompt an API – keine festen Fallbacks
const userPrompt = expertAskPrompt(label, lang);
const q = `${userPrompt}\n\n${langHint(lang)}`;     // ← NEU

const reply = await callChatAPI(q);                 // ← Variable geändert

  if (reply && reply.trim().length > 0) {
    say(reply); // genau eine Antwort-Bubble
  }

  setSendingExpert(null);
}

  // Exportiert den aktuellen Chat-Thread als JSON oder CSV
  const exportThread = (format: "json" | "csv") => {
    try {
      const raw =
        localStorage.getItem("mpathy:thread:default") ||
        "[]";

      let blob: Blob;
      let extension: "json" | "csv" = format;

      if (format === "csv") {
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = [];
        }

        const rows: string[] = [];
        rows.push("index,role,content");

        if (Array.isArray(parsed)) {
          parsed.forEach((entry, index) => {
            const anyEntry = entry as any;
            const role =
              typeof anyEntry?.role === "string" ? anyEntry.role : "";
            const contentRaw =
              typeof anyEntry?.content === "string"
                ? anyEntry.content
                : JSON.stringify(anyEntry?.content ?? "");
            const safeContent = String(contentRaw).replace(/"/g, '""');
            rows.push(
              `${index},"${role}","${safeContent}"`
            );
          });
        }

        const csv = rows.join("\n");
        blob = new Blob([csv], {
          type: "text/csv;charset=utf-8",
        });
      } else {
        blob = new Blob([raw], { type: "application/json" });
      }

      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);

      link.href = href;
      link.download = `mpathy-chat-${date}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch {
      // Export-Fehler bleiben still – der User verliert nichts
    }
  };

  // "LÖSCHEN" – alles zurück auf Flow / neutral
  const handleDeleteImmediate = () => {
    try {
      localStorage.removeItem("mpathy:thread:default");

    } catch {}
    try {
      localStorage.removeItem("expert");
    } catch {}
    try {
      localStorage.setItem("mode", "M");
    } catch {}

    setCurrentExpert(null);
    setActiveMode("M");

    try {
      emitStatus({
        modeLabel: modeLabelFromId("M"),
        expertLabel: undefined,
        busy: false,
      });
    } catch {
      // Status ist "nice to have", aber nicht kritisch
    }

    onClearChat?.();
    setOpenDeleteDetails(false);
  };

     /* UI */
  return (
    <aside
      className={styles.saeule}

      aria-label={tr("columnAria", "Column — Controls & Selection")}
      data-test="saeule"
    >
      <section
        className={styles.sectionHeader}
        aria-label={tr("pillar.section.header", "Modes & experts header")}
      >
        {/* Kopf entfernt → Build-Button oben im Panel */}
        <div className={styles.block} style={{ marginTop: 8 }}>
          <button
  type="button"
  aria-label={labelBuild}
  data-m-event="builder"
  data-m-label={labelBuild}
  onClick={async () => {
    emitStatus({ busy: true });


              const prompt = buildButtonMsg(lang);
              const q = `${prompt}\n\n${langHint(lang)}`;       // Sprachhinweis (13-Sprachen)
              try { logEvent("cta_start_building_clicked", {}); } catch {}

              // ▼ Overlay sofort schließen (ohne Bubble)
              try {
                if (typeof window !== "undefined" &&
                  (window.matchMedia?.("(max-width: 768px)").matches ||
                   /Mobi|Android/i.test(navigator.userAgent))) {
                  window.dispatchEvent(
                    new CustomEvent("mpathy:ui:overlay-close", { detail: { reason: "expert-selected" } })
                  );
                }
              } catch {}
              // ▲ Ende Overlay-Close

              // kurze Echo-Info (dezent)
              emitSystemMessage({ kind: "info", text: prompt, meta: { source: "cta" } });

              // Chat-Aufruf + Reply ausgeben (einmalig)
              const reply = await callChatAPI(q);

              const finalText = reply && reply.length
                ? reply
                : tr("cta.fallback", "All set — tell me what you want to build (app, flow, feature …).");

              say(finalText);
            }}
            className={styles.buttonPrimary}
            style={{ width: "100%", cursor: "pointer" }}
          >
            <SimbaIcon name="build" />
  {labelBuild}                                         {/* dynamisches Label */}
</button>
        </div>

      </section>

      {/* Smooth Operator · Akkordeon für MODIS / EXPERTEN / SYSTEM / ACTIONS */}
      <div className={styles.soAccordion}>
    {/* MODIS */}
<div className={styles.soSection}>
  <button
    type="button"
    className={styles.soSectionHeader}
    onClick={() => toggleSection("modes")}
    aria-expanded={openSection === "modes"}
  >
    <span className={styles.soSectionHeaderIcon}>
      <SimbaIcon name="modeDefault" />
    </span>
    <span className={styles.soSectionHeaderLabel}>
      {tr("pillar.section.modesTitle", "MODIS")}
    </span>
  </button>



          <div
            className={
              openSection === "modes"
                ? styles.soSectionBody
                : styles.soSectionBodyCollapsed
            }
            aria-label={tr("pillar.section.modes", "Modes")}
          >
            <section
              className={styles.sectionModes}
              aria-label={tr("pillar.section.modes", "Modes")}
            >
{/* ONBOARDING */}
<div className={styles.block}>
  <ModeAura active={activeMode === "onboarding"}>
    <button
      type="button"
      aria-pressed={activeMode === "onboarding"}
      className={`${styles.buttonPrimary} ${
        activeMode === "onboarding" ? styles.active : ""
      }`}
      onClick={() => switchMode("onboarding")}
    >
      <SimbaIcon name="modeOnboarding" />
      {tr("mode.onboarding", "ONBOARDING")}
    </button>
  </ModeAura>
</div>

{/* Council13 als Modus */}
<div className={styles.block}>
  <ModeAura active={activeMode === "council"}>
    <button
      type="button"
      aria-pressed={activeMode === "council"}
      className={`${styles.buttonGhostPrimary} ${
        activeMode === "council" ? styles.active : ""
      }`}
      onClick={() => switchMode("council")}
      style={{ width: "100%", cursor: "pointer" }}
    >
      <SimbaIcon name="modeCouncil" />
      {tr("mode.council", "COUNCIL13")}
    </button>
  </ModeAura>
</div>

{/* M (Default) */}
<div className={styles.block}>
  <ModeAura active={activeMode === "M"}>
    <button
      type="button"
      aria-pressed={activeMode === "M"}
      className={`${styles.buttonSolid} ${
        activeMode === "M" ? styles.active : ""
      }`}
      onClick={() => {
        // ▼ Overlay sofort schließen (ohne Bubble)
        try {
          const inOverlay = !!document.querySelector(
            '[data-overlay="true"]'
          );
          if (inOverlay) {
            onSystemMessage?.("");
          }
        } catch {}
        // ▲ Ende Overlay-Close
        void switchMode("M");
      }}
    >
      <SimbaIcon name="modeDefault" />
      {tr("mode.default", "M · Default")}
    </button>
  </ModeAura>
</div>


            {/* Charakter-Modis – Micronavi + Liste */}
      <div className={styles.block}>
        <div className={styles.soGroupTitle}>
          {tr("labels.modes.character", "Charakter Modis")}
        </div>

        {/* Hover-Zone: Micronavi + Modus-Liste */}
        <div
          className={styles.modeZone}
          onMouseLeave={() => setHoverModeCategory(null)}
        >
          {/* Micronavi: CORE / INTELLECTUAL / CREATOR / HEART / SPIRIT */}
            <div className={styles.modeCategoryNav}>
            {MODE_CATEGORIES.map((cat) => {
              const isActiveCat = modeCategory === cat.id; // aktive Kategorie = modeCategory
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={
                    isActiveCat
                      ? `${styles.modeCategoryItem} ${styles.modeCategoryItemActive}`
                      : styles.modeCategoryItem
                  }
                  onMouseEnter={() => setHoverModeCategory(cat.id)}
                  onFocus={() => setHoverModeCategory(cat.id)}
                  aria-pressed={isActiveCat}
                >
                 <span className={styles.modeCategoryItemLabel}>
        {cat.label}
      </span>

                </button>
              );
            })}
          </div>


          {/* Modus-Liste – zeigt gehoverte Kategorie, sonst aktive */}
          <div className={styles.modeList}>
            {(() => {
              const currentCategoryId = hoverModeCategory ?? modeCategory;
              const currentCategory = MODE_CATEGORIES.find(
                (cat) => cat.id === currentCategoryId
              );
              if (!currentCategory) return null;

              return currentCategory.modes.map((modeId) => {
  const mode = MODI.find((m) => m.id === modeId);
  if (!mode) return null;
  const isActive = activeMode === modeId;

  return (
    <ModeAura key={modeId} active={isActive}>
      <button
        type="button"
        className={
          isActive
            ? `${styles.modeListItem} ${styles.modeListItemActive}`
            : styles.modeListItem
        }
        onClick={() => switchMode(modeId)}
        aria-pressed={isActive}
      >
        <span className={styles.modeListItemLabel}>
          {mode.label}
        </span>
      </button>
    </ModeAura>
  );
});

            })()}
          </div>

        </div>
      </div>



              
            </section>
          </div>
        </div>


        {/* EXPERTEN */}
        <div className={styles.soSection}>
          <button
            type="button"
            className={styles.soSectionHeader}
            onClick={() => toggleSection("experts")}
            aria-expanded={openSection === "experts"}
          >
            <span className={styles.soSectionHeaderIcon}>
              <SimbaIcon name="modeCouncil" />
            </span>
           <span className={styles.soSectionHeaderLabel}>
  {tr("pillar.section.modesTitle", "MODES")}
</span>

          </button>

          <div
            className={
              openSection === "experts"
                ? styles.soSectionBody
                : styles.soSectionBodyCollapsed
            }
            aria-label={tr("experts.title", "Experts")}
          >
            <section
              className={styles.sectionExperts}
              aria-label={tr("pillar.section.experts", "Experts")}
            >
              {/* EXPERTEN – Micronavi + Liste */}
              <div className={styles.block}>
                <div className={styles.soGroupTitle}>
  {tr("labels.modes.character", "Character modes")}
</div>


                {/* Hover-Zone: Micronavi + Experten-Liste */}
                <div
                  className={styles.modeZone}
                  onMouseLeave={() => setHoverExpertCategory(null)}
                >
                  {/* Experten-Kategorien – Micronavi */}
                  <div className={styles.modeCategoryNav}>
                    {EXPERT_CATEGORIES.map((cat) => {
                      const isActiveCat = expertCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={
                            isActiveCat
                              ? `${styles.modeCategoryItem} ${styles.modeCategoryItemActive}`
                              : styles.modeCategoryItem
                          }
                          onMouseEnter={() => setHoverExpertCategory(cat.id)}
                          onFocus={() => setHoverExpertCategory(cat.id)}
                          aria-pressed={isActiveCat}
                        >
                         <span className={styles.modeCategoryItemLabel}>
  {expertCategoryLabel(cat.id, lang)}
</span>

                        </button>
                      );
                    })}
                  </div>

                  {/* Experten-Liste – zeigt gehoverte Kategorie, sonst aktive */}
                  <div className={styles.modeList}>
                    {(() => {
                      const currentCategoryId =
                        hoverExpertCategory ?? expertCategory;
                      const currentCategory = EXPERT_CATEGORIES.find(
                        (cat) => cat.id === currentCategoryId
                      );
                      if (!currentCategory) return null;

                                            return currentCategory.experts.map((expertId) => {
                        const expert = EXPERTS.find(
                          (e) => e.id === expertId
                        );
                        if (!expert) return null;
                        const isActive = currentExpert === expertId;

                        return (
                          <ModeAura key={expertId} active={isActive}>
                            <button
                              type="button"
                              className={
                                isActive
                                  ? `${styles.modeListItem} ${styles.modeListItemActive}`
                                  : styles.modeListItem
                              }
                              onClick={() => {
                                setCurrentExpert(expertId);

                                const owningCategoryId = currentCategoryId;
                                setExpertCategory(owningCategoryId);
                                setHoverExpertCategory(null);

                                void askExpert(expertId);
                              }}
                              aria-pressed={isActive}
                              data-simba-slot={expert.simbaSlot}
                            >
                              <span className={styles.modeListItemLabel}>
                                {labelForExpert(expertId, lang)}
                              </span>
                            </button>
                          </ModeAura>
                        );
                      });

                    })()}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* SYSTEM – Statusleiste */}


        {/* SYSTEM – Statusleiste */}
        <div className={styles.soSection}>
          <button
            type="button"
            className={styles.soSectionHeader}
            onClick={() => toggleSection("system")}
            aria-expanded={openSection === "system"}
          >
            <span className={styles.soSectionHeaderIcon}>
              <SimbaIcon name="modeDefault" />
            </span>
            <span className={styles.soSectionHeaderLabel}>
              {tr("pillar.section.systemTitle", "SYSTEM")}
            </span>
          </button>

          <div
            className={
              openSection === "system"
                ? styles.soSectionBody
                : styles.soSectionBodyCollapsed
            }
            aria-label={tr("pillar.section.system", "System status")}
          >
            <div className={styles.statusBar} aria-live="polite">
              <span className={styles.statusKey}>{t("statusMode")}</span>{" "}
              {modeLabel}
            </div>
          </div>
        </div>

        {/* ACTIONS – Export + Clear */}
        <div className={styles.soSection}>
          <button
            type="button"
            className={styles.soSectionHeader}
            onClick={() => toggleSection("actions")}
            aria-expanded={openSection === "actions"}
          >
            <span className={styles.soSectionHeaderIcon}>
              <SimbaIcon name="export" />
            </span>
            <span className={styles.soSectionHeaderLabel}>
              {tr("pillar.section.actionsTitle", "ACTIONS")}
            </span>
          </button>

          <div
            className={
              openSection === "actions"
                ? styles.soSectionBody
                : styles.soSectionBodyCollapsed
            }
            aria-label={tr("pillar.section.utility", "Actions & export")}
          >
            <section
              className={styles.sectionUtility}
              aria-label={tr("pillar.section.utility", "Utility & status")}
            >
              {/* Export-Modul */}
              <div className={styles.block}>
                <button
                  type="button"
                  className={styles.soItem}
                  onClick={() =>
                    setOpenExportDetails((prev) => !prev)
                  }
                  aria-expanded={openExportDetails}
                >
                  <span className={styles.soItemIcon}>
                    <SimbaIcon name="export" />
                  </span>
                  <span className={styles.soItemLabel}>
                    {labelActionsExportTitle}
                  </span>
                </button>

                {openExportDetails && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        opacity: 0.9,
                      }}
                    >
                      {labelActionsExportHelp}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "stretch",
                      }}
                    >
                      <button
                        type="button"
                        className={`${styles.button} ${styles.actionsInlineButton}`}
                        style={{ flex: 1 }}
                        onClick={() => exportThread("csv")}
                        aria-label={tr("exportCsvAria", "Export thread as CSV")}
                        title={labelActionsExportCsv}
                        data-test="btn-export-thread-csv"
                      >
                        <SimbaIcon name="export" />
                        {labelActionsExportCsv}
                      </button>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.actionsInlineButton}`}
                        style={{ flex: 1 }}
                        onClick={() => exportThread("json")}
                        aria-label={tr("exportJsonAria", "Export thread as JSON")}
                        title={labelActionsExportJson}
                        data-test="btn-export-thread-json"
                      >
                        <SimbaIcon name="export" />
                        {labelActionsExportJson}
                      </button>
                    </div>
                  </div>
                )}
              </div>


                            {/* Chat löschen-Modul */}
              <div className={styles.block}>
                <button
                  type="button"
                  className={styles.soItem}
                  onClick={() =>
                    setOpenDeleteDetails((prev) => !prev)
                  }
                  aria-expanded={openDeleteDetails}
                >
                  <span className={styles.soItemIcon}>
                    <SimbaIcon name="clear" />
                  </span>
                  <span className={styles.soItemLabel}>
                    {labelActionsDeleteTitle}
                  </span>
                </button>

                {openDeleteDetails && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        opacity: 0.9,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 6,
                      }}
                    >
                      <span aria-hidden="true">⚠️</span>
                      <span>{labelActionsDeleteWarning}</span>
                    </p>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.actionsInlineButton} ${styles.actionsInlineButtonDanger}`}
                      style={{ alignSelf: "flex-start" }}
                      onClick={handleDeleteImmediate}
                      aria-label={tr("clearChatAria", "Clear chat")}
                      title={labelActionsDeleteNow}
                      role="button"
                      data-test="btn-clear-chat"
                    >
                      {labelActionsDeleteNow}
                    </button>
                  </div>
                )}
              </div>

            </section>

          </div>
        </div>
      </div>
    </aside>

  );
}

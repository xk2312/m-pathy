
/* ======================================================================
ATOMIC CANONICAL INDEX
FILE: Saeule.tsx
PURPOSE: Switch Modis + Experts from INTERACTIVE (API-calling) to DESCRIPTIVE (local-only)
SCOPE: This index is a reliable map of all code parts that must be inspected and changed.
SOURCE: saeule_tsx.pdf :contentReference[oaicite:0]{index=0}
======================================================================

0) QUICK DEFINITION
- INTERACTIVE = selecting a mode/expert triggers callChatAPI(...) and writes chat bubbles.
- DESCRIPTIVE = selecting a mode/expert only updates local UI state + telemetry/meta, no API calls, no auto replies.

1) TYPES AND PUBLIC SURFACE
1.1 Anchor: 'type ModeId ='
- What it is: Allowed modes, includes onboarding, M, council plus named modes.
- Why relevant: Defines the full selectable set and any special-case behavior later.
- Change focus: none by itself, but used by switchMode(...) branching.

1.2 Anchor: 'type ExpertId ='
- What it is: Allowed experts including "Computer Scientist".
- Why relevant: askExpert(...) uses this union and maps to ROLES/SUB_KIS.
- Change focus: none by itself, but used by askExpert(...) and labels.

1.3 Anchor: 'type Props = { onSystemMessage? ... onClearChat? ... }'
- What it is: Integration surface with parent (bubble output + clear).
- Why relevant: Descriptive behavior might stop using onSystemMessage for expert/mode ack.
- Change focus: decide whether any system-message dispatch remains, or pure footer-status only.

2) STATIC DATA TABLES (LOCAL DEFINITIONS)
2.1 Anchor: 'const MODI:'
- What it is: Mode dropdown list.
- Why relevant: UI options and modeLabelFromId fallback.
- Change focus: labels remain, but interactive side effects must be removed from switchMode.

2.2 Anchor: 'const EXPERTS:'
- What it is: Expert dropdown list with icons.
- Why relevant: UI options; askExpert currently triggers API and bubble.
- Change focus: keep list; remove API triggering.

2.3 Anchor: 'const SUB_KIS:'
- What it is: Meta mapping ExpertId -> list of sub AIs (telemetry/log use).
- Why relevant: Descriptive mode still can expose this metadata locally.
- Change focus: decide whether to show these as descriptive text or keep for logs only.

2.4 Anchor: 'const ROLES:'
- What it is: Expert role descriptions used in telemetry.
- Why relevant: In descriptive mode this becomes primary content (what the expert is).
- Change focus: likely expand usage: render ROLES in UI instead of calling API.

3) I18N HELPERS AND LABEL BUILDERS
3.1 Anchor: 'function labelForExpert('
- What it is: Builds i18n key for expert labels and falls back to id.
- Why relevant: Descriptive UI still needs localized expert label.
- Change focus: keep, but ensure descriptive UI uses it consistently.

3.2 Anchor: 'function sectionTitleExperts' and 'function chooseExpertLabel'
- What it is: Uses t("selectExpert") for headings/aria.
- Why relevant: UI text remains.

3.3 Anchor: 'function buildButtonLabel' and 'function buildButtonMsg'
- What it is: "Start building" CTA label and prompt.
- Why relevant: CTA currently triggers callChatAPI; in descriptive mode it must not.
- Change focus: decide new descriptive CTA behavior (e.g., open input hint, not call API).

3.4 Anchor: 'function expertAskPrompt('
- What it is: Template used to ask API who the expert is.
- Why relevant: This becomes obsolete in descriptive mode.
- Change focus: remove or keep unused; canonical change is to stop calling it.

3.5 Anchor: 'function tr('
- What it is: Safe translation fallback helper.
- Why relevant: Used for status texts and prompts; still useful.

4) EVENT AND TELEMETRY EMITTERS
4.1 Anchor: 'function emitSystemMessage('
- What it is: Dispatches "mpathy:system-message" with kind + text + meta + ts.
- Why relevant: Interactive mode uses it for chat bubbles and status; descriptive may keep status only.
- Change focus: define whether:
  A) Keep only kind:"status" emissions
  B) Keep info emissions for audit but no bubble text
  C) Disable all except audit logs

4.2 Anchor: 'const emitStatus = useCallback('
- What it is: Footer status dispatcher (kind:"status", meta only).
- Why relevant: This is already aligned with descriptive behavior.
- Change focus: make this the primary output path for mode/expert changes.

4.3 Anchor: 'const say = useCallback('
- What it is: "Always also set a chat bubble" helper: onSystemMessage or emitSystemMessage(kind:"reply").
- Why relevant: This is the main interactive bubble injector.
- Change focus: In descriptive mode, this should be removed or restricted to non-API local text only.

5) API CALL LAYER (MUST BE DISABLED FOR DESCRIPTIVE)
5.1 Anchor: 'async function callChatAPI('
- What it is: POST /api/chat with prompt, returns assistant content from multiple shapes.
- Why relevant: Core interactive dependency.
- Change focus: In descriptive mode, no caller should invoke this function.

6) MODE SWITCH LOGIC (PRIMARY CHANGE ZONE)
6.1 Anchor: 'const [activeMode, setActiveMode] = useState<ModeId>("M");'
- What it is: Mode state, persisted to localStorage key "mode".
- Why relevant: Descriptive mode still needs local state and persistence.
- Change focus: keep, but verify no downstream API call remains.

6.2 Anchor: 'useEffect(() => { ... localStorage.setItem("mode", activeMode) ... })'
- What it is: Persistence.
- Why relevant: Still OK; confirm key name stability.

6.3 Anchor: 'useEffect(() => { ... localStorage.getItem("mode") ... })'
- What it is: Rehydrate persisted mode.
- Why relevant: Still OK.

6.4 Anchor: 'useEffect(() => { ... url.searchParams.get("mode") ... })'
- What it is: Mode override from URL query.
- Why relevant: Still OK; but ensure descriptive behavior remains deterministic.

6.5 Anchor: 'async function switchMode(next: ModeId) {'
- What it is: Logs, sets state, emits messages, builds prompt q, calls callChatAPI(q), then say(reply).
- Why relevant: This is the central interactive mode behavior.
- Change focus checklist:
  - Remove prompt creation 'const q = ...'
  - Remove 'const reply = await callChatAPI(q)'
  - Remove 'say(reply)'
  - Keep: logEvent("mode_switch"), setActiveMode, emitStatus({ modeLabel }), maybe emitSystemMessage(kind:"mode") with text only if you still want a non-AI system notification.
  - Remove duplicate overlay-close blocks (currently repeated twice) if cleaning.

7) EXPERT SWITCH LOGIC (PRIMARY CHANGE ZONE)
7.1 Anchor: 'const [sendingExpert, setSendingExpert] ...'
- What it is: Prevents double sends, tracks currently selected expert.
- Why relevant: sendingExpert becomes unnecessary if no async API call remains.
- Change focus: likely remove sendingExpert gate and keep only currentExpert.

7.2 Anchor: 'async function askExpert(expert: ExpertId) {'
- What it is: Sets expert state, logs, emits status, sends ack bubble, calls callChatAPI(userPrompt), then say(reply).
- Why relevant: This is the central interactive expert behavior.
- Change focus checklist:
  - Remove sendingExpert gate and all callChatAPI usage
  - Remove expertAskPrompt usage
  - Replace outputs with descriptive content from ROLES and optionally SUB_KIS
  - Decide the canonical descriptive payload:
    - emitStatus({ expertLabel })
    - emitSystemMessage(kind:"info" or kind:"reply") with a local description string (no API)
    - or render the description directly in the Saeule UI under the dropdown

8) UI ELEMENTS THAT TRIGGER INTERACTIVE BEHAVIOR
8.1 Anchor: 'button ... buildButtonLabel ... onClick={async () => { ... callChatAPI(prompt) ... say(finalText) }}'
- What it is: CTA triggers API and writes bubble.
- Why relevant: Must be made descriptive or disabled.
- Change focus: Remove callChatAPI and bubble; replace with local instruction or open focus.

8.2 Anchor: 'ONBOARDING button ... onClick={() => switchMode("onboarding")}'
- What it is: Mode switch button.
- Why relevant: switchMode currently triggers API; after change it becomes descriptive.

8.3 Anchor: 'M (Default) button ... void switchMode("M");'
- Same as above.

8.4 Anchor: 'select id="modus-select" ... onChange={(e) => switchMode(e.target.value as ModeId)}'
- What it is: Mode dropdown.
- Why relevant: Must no longer trigger API after switchMode rewrite.

8.5 Anchor: 'select id="expert-select" ... onChange={(e) => { setCurrentExpert(val); void askExpert(val); }}'
- What it is: Expert dropdown.
- Why relevant: askExpert rewrite is required.

8.6 Anchor: 'Council13 button ... onClick={() => switchMode("council")}'
- What it is: Council mode switch.
- Why relevant: Must become descriptive, not API-driven intros.

9) SECONDARY BEHAVIOR TO REVIEW FOR DRIFT/NOISE
9.1 Anchor: 'try { const inOverlay = ... onSystemMessage?.("") }'
- What it is: Mobile overlay close hack via empty message.
- Why relevant: If bubbles are reduced/removed, this can become unstable or unnecessary.
- Change focus: Decide a dedicated close signal, or keep only via emitStatus.

9.2 Anchor: 'emitSystemMessage({ kind: "info", text: prompt, meta: { source: "cta" } });'
- What it is: Info emission used even before API.
- Why relevant: Could remain as descriptive audit entry.

9.3 Anchor: 'logEvent("expert_selected"...), logEvent("mode_switch"...), logEvent("cta_start_building_clicked"...'
- What it is: Audit logging.
- Why relevant: Keep, but ensure no payload depends on API replies.

10) OUTPUT SURFACE
10.1 Anchor: 'Statusleiste ... {modeLabel}'
- What it is: Shows current mode label.
- Why relevant: In descriptive mode, add expert label and role summary here or in a new block.

10.2 Anchor: 'emitStatus({ modeLabel })' and 'emitStatus({ expertLabel })'
- What it is: Best existing descriptive channel.
- Why relevant: Use as canonical output.

11) CANONICAL CHANGE TARGETS (SUMMARY MAP)
- MUST CHANGE:
  A) call sites of callChatAPI in switchMode, askExpert, CTA button
  B) say(...) usage that produces reply bubbles from API
  C) sendingExpert state if it only exists for async API calls
- REVIEW:
  D) emitSystemMessage kinds (mode/info/reply/status) and what remains allowed
  E) overlay-close mechanism and duplicate blocks in switchMode
- KEEP:
  F) types, MODI/EXPERTS lists, ROLES, SUB_KIS, labelForExpert, tr, persistence, status bar

END OF ATOMIC CANONICAL INDEX
====================================================================== */

"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import styles from "./Saeule.module.css";
import StarField from "@/components/StarField";
import { logEvent } from "../../lib/auditLogger";
import { t, getLocale } from "@/lib/i18n";
import { buildChatExport, chatExportToCSV } from "@/lib/exportChat";
import { ChevronDown } from "lucide-react";

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
  onClearChat?: () => void;
  canClear?: boolean;
  messages: any[]; // ⬅️ NEU: explizite Datenwahrheit
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

// Shared helper — unchanged for Build / Archive / New Chat
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
  if (id === "M")          return tr("mode.default", "M · Default");
  if (id === "council")    return tr("mode.council", "COUNCIL13");

  // i18n-Mapping für Charakter-Modes – Fallback bleibt der EN-Token aus MODI
  const MODE_KEYS: Partial<Record<ModeId, string>> = {
    research: "mode.research",
    calm: "mode.calm",
    truth: "mode.truth",
    play: "mode.play",
    oracle: "mode.oracle",
    joy: "mode.joy",
    vision: "mode.vision",
    empathy: "mode.empathy",
    love: "mode.love",
    wisdom: "mode.wisdom",
    flow: "mode.flow",
  };

  const fallback =
    MODI.find((m) => m.id === id)?.label ?? String(id).toUpperCase();

  const key = MODE_KEYS[id];
  return key ? tr(key, fallback) : fallback;
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

/* ▼▼ Sprach-Hint - 13 Sprachen, GPT-4.1 kompatibel ▼▼ */
function langHint(lang: string): string {
  const base = (lang || "en").slice(0, 2).toLowerCase();
  const map: Record<string, string> = {
    en: "Please answer ONLY in English. Do not include any other language or translation.",
    de: "Bitte antworte NUR auf Deutsch. Keine zweite Sprache, keine Übersetzung.",
    fr: "Veuillez répondre UNIQUEMENT en français. Aucune autre langue, aucune traduction.",
    es: "Responde SOLO en español. No incluyas otro idioma ni traducción.",
    it: "Rispondi SOLO in italiano. Nessun’altra lingua, nessuna traduzione.",
    pt: "Responda SOMENTE em português. Sem outro idioma, sem tradução.",
    nl: "Antwoord ALLEEN in het Nederlands. Geen andere taal, geen vertaling.",
    ru: "Отвечайте ТОЛЬКО по-русски. Без другого языка и без перевода.",
    zh: "请只用中文回答，不要加入其他语言或翻译。",
    ja: "日本語のみで回答してください。他の言語や翻訳は入れないでください。",
    ko: "한국어로만 답변해 주세요. 다른 언어나 번역을 포함하지 마세요.",
    ar: "من فضلك أجب بالعربية فقط، ولا تضف أي لغة أخرى أو ترجمة.",
    hi: "कृपया केवल हिन्दी में उत्तर दें। कोई दूसरी भाषा या अनुवाद न जोड़ें।",
  };
  return `[${map[base] ?? map.en}]`;
}

/* ▲▲ Ende Sprach-Hint ▲▲ */

// Saeule.tsx - REPLACE the whole function
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

export default function Saeule({
  onSystemMessage,
  onClearChat,
  canClear,
  messages,
}: Props) {

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
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
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

const labelSupportButton = tr("support.button.label", "Support");
const labelArchive = tr("archive.title", "Archive");

const labelSupportSubject = tr(
  "support.mail.subject",
  'Support request: "please fill in"'
);
const labelSupportBody = tr(
  "support.mail.body",
  "Please describe your request as clearly and briefly as possible."
);

const labelOnboarding = tr("mode.onboarding", "ONBOARDING");

const labelDefault = tr("mode.default", "M · Default");
const labelModeSelect = tr("mode.select", "Choose mode");
const labelExpertSelect = tr("experts.choose", "Choose expert");





  useEffect(() => {
    // Single Source of Truth: zentraler Sprachkern (lib/i18n)
    try {
      const initial = getLocale() || "en";
      setLang(initial.toLowerCase());
    } catch {
      setLang("en");
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

  const supportMailHref = useMemo(() => {
    const subject = encodeURIComponent(labelSupportSubject);
    const body = encodeURIComponent(labelSupportBody);
    return `mailto:m@m-pathy.ai?subject=${subject}&body=${body}`;
  }, [labelSupportSubject, labelSupportBody]);


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

  // Status-Update für Telemetrie
  emitSystemMessage({
    kind: "mode",
    text: tr("status.modeSet", "Mode set: {label}.", { label }),
    meta: { modeId: next, label, lang }
  });
  emitStatus({ modeLabel: label });

  // UI-Overlay schließen (bleibt funktionsgleich)
  try {
    const inOverlay = !!document.querySelector('[data-overlay="true"]');
    if (inOverlay) {
      window.dispatchEvent(
        new CustomEvent("mpathy:ui:overlay-close", { detail: { reason: "mode-switch" } })
      );
    }
  } catch {}

  // Deskriptiver Modus: kein API-Call, nur lokaler Text
  const description = tr(
    "mode.description",
    "Mode {label}: descriptive display only – no AI interaction.",
    { label }
  );

  emitSystemMessage({
    kind: "info",
    text: description,
    meta: { source: "descriptive-mode", modeId: next }
  });
}

async function askExpert(expert: ExpertId) {
  if (sendingExpert) return;
  setSendingExpert(expert);
  setCurrentExpert(expert);
  try { localStorage.setItem("expert", expert); } catch {}

  const label = labelForExpert(expert, lang);

  logEvent("expert_selected", { expert, label, roles: ROLES[expert] });

  emitStatus({ expertLabel: label });

  // UI-Overlay schließen (bleibt funktionsgleich)
  if (
    typeof window !== "undefined" &&
    (window.matchMedia?.("(max-width: 768px)").matches ||
      /Mobi|Android/i.test(navigator.userAgent))
  ) {
    window.dispatchEvent(
      new CustomEvent("mpathy:ui:overlay-close", { detail: { reason: "expert-selected" } })
    );
  }

  // Deskriptiver Modus: kein API-Call
  const description =
    ROLES[expert] ??
    tr("expert.description", "Expert {label}: descriptive display only.", { label });

  emitSystemMessage({
    kind: "info",
    text: description,
    meta: { source: "descriptive-expert", expertId: expert }
  });

  setSendingExpert(null);
}


// Exportiert den aktuellen Chat-Thread als JSON oder CSV
const exportThread = (format: "json" | "csv", messages: any[]) => {
  try {
    const exportObj = buildChatExport(messages);

    let blob: Blob;
    let extension: "json" | "csv" = format;

    if (format === "csv") {
      const csv = chatExportToCSV(exportObj);
      const utf8BOM = "\uFEFF"; // Excel/Numbers safe
      blob = new Blob([utf8BOM + csv], {
        type: "text/csv;charset=utf-8",
      });
    } else {
      const pretty = JSON.stringify(exportObj, null, 2);
      blob = new Blob([pretty], {
        type: "application/json",
      });
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

      aria-label={tr("columnAria", "Column - Controls & Selection")}
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
              const q = prompt;

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
                : tr("cta.fallback", "All set - tell me what you want to build (app, flow, feature …).");

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
      {tr("pillar.section.modesTitle", "MODES")}
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

<section className={styles.sectionModes} aria-label={tr("pillar.section.modes", "Modes")}>
  <div className={styles.block}>
    {/* Notes section above all modes */}
    <div className={styles.notesBlock}>
      <p className={styles.notesText}>
        {tr("modes.notes", "Select mode by prompting “set MODENAME mode”.")}
      </p>
    </div>

    {(() => {
      const [openMode, setOpenMode] = useState<string | null>(null);

      const MODES = [
  {
    id: "onboarding",
    title: "Onboarding",
    purpose:
      "You can ask about system features, available commands, or request step-by-step guidance for initial setup and usage."
  },
  {
  id: "research",
  title: "Research",
  purpose:
    "Executes the sealed evaluation loop — each input rated for clarity and meaning (1–10) with three outputs: understanding, insight, and comment."
}
,

  {
    id: "truth",
    title: "Truth",
    purpose:
      "Delivers verified, traceable facts for business decisions, ensuring auditability and regulatory transparency in every statement."
  },
  
  {
    id: "empathy",
    title: "Empathy",
    purpose:
      "Adapts responses to human tone and context, improving collaboration and clarity in emotionally charged or complex exchanges."
  },
  
  {
    id: "wisdom",
    title: "Wisdom",
    purpose:
      "Synthesizes multiple viewpoints into balanced guidance - ideal for decision rounds or evaluating competing project directions."
  },
  
  {
    id: "calm",
    title: "Calm",
    purpose:
      "Stabilizes workflows in high-load or uncertain situations, simplifying complex input to maintain operational clarity and focus."
  },
  {
    id: "safety",
    title: "Safety",
    purpose:
      "Protects against unintended outputs or regulatory violations by enforcing strict compliance filters and real-time content control."
  },
  {
    id: "recovery",
    title: "Recovery",
    purpose:
      "Restores the workspace to a consistent, verifiable state after errors or interruptions, preserving data integrity and continuity."
  },
  {
    id: "play",
    title: "Play",
    purpose:
      "Enables exploratory ideation and prototyping without operational risk - ideal for testing logic, prompts, and creative hypotheses safely."
  },
  {
    id: "governance",
    title: "Governance — Council13",
    note: "Select mode by prompting “set MODENAME mode”.",
    purpose:
      "Provides an impartial evaluation of complex options through thirteen fixed perspectives - observation, comparison, and transparent reasoning only."
  }
];


      return (
        <div className={styles.accordionContainer}>
          {MODES.map((mode) => (
            <div key={mode.id} className={styles.accordionItem}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => setOpenMode(openMode === mode.id ? null : mode.id)}
                aria-expanded={openMode === mode.id}
              >
                <span className={styles.modeTitle}>{mode.title}</span>
                <div className={styles.chevronWrapper}>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.75}
                    className={openMode === mode.id ? styles.iconRotated : styles.icon}
                  />
                </div>
              </button>

              <div
                className={
                  openMode === mode.id
                    ? `${styles.accordionBody} ${styles.accordionBodyOpen}`
                    : styles.accordionBody
                }
              >
                <p><strong>{tr("labels.purpose", "Purpose:")}</strong> {mode.purpose}</p>
                
              </div>
            </div>
          ))}
        </div>
      );
    })()}
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
            {tr("experts.title", "EXPERTS")}
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
           <section className={styles.sectionExperts} aria-label={tr("pillar.section.experts", "Experts")}>
  <div className={styles.block}>
    <div className={styles.soGroupTitle}>{sectionTitleExperts(lang)}</div>

    {/* Descriptive replacement for expert overview */}
    <div className={styles.infoBlock}>
      <p className={styles.textMuted}>
        {tr(
          "experts.descriptive.intro",
          "This section now provides a structured description of all experts available in the system."
        )}
      </p>

      <ul className={styles.expertList}>
        {EXPERTS.map((expert) => (
          <li key={expert.id} className={styles.expertItem}>
            <span className={styles.expertLabel}>{labelForExpert(expert.id, lang)}</span>
            <p className={styles.expertRole}>{ROLES[expert.id]}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>

          </div>
        </div>


       {/* ARCHIVE */}
<div className={styles.soSection}>
  <button
    type="button"
    className={styles.soSectionHeader}
    onClick={() => {
  setOpenSection(null)
  setOpenExportDetails(false)
  setOpenDeleteDetails(false)

  // ✅ FIX 2: Mobile Overlay explizit schließen (wie bei Mode / Expert)
  try {
    const inOverlay = !!document.querySelector('[data-overlay="true"]');
    if (inOverlay) {
      onSystemMessage?.("");
    }
  } catch {}

  window.dispatchEvent(new CustomEvent("mpathy:archive:open"))
}}

    aria-label={tr("pillar.section.archiveTitle", "ARCHIVE")}
  >
    <span className={styles.soSectionHeaderIcon}>
      <SimbaIcon name="clear" />
    </span>
    <span className={styles.soSectionHeaderLabel}>
      {tr("pillar.section.archiveTitle", "ARCHIVE")}
    </span>
  </button>

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
onClick={() => exportThread("csv", messages)}
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
onClick={() => exportThread("json", messages)}
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

      <div className={styles.saeuleBottomNote}>
        <div className={styles.saeuleSupportButtonWrapper}>
          <a
            href={supportMailHref}
            className={styles.saeuleSupportButton}
            aria-label={labelSupportButton}
          >
            {labelSupportButton}
          </a>
        </div>
        <span className={styles.saeuleBottomNoteLabel}>
          Powered by MAIOS.
          TRIKETON-verified integrity.
          100% privacy. Zero drift. Full autonomy.
        </span>
      </div>

    </aside>

  );
}

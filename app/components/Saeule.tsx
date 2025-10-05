"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./Saeule.module.css";
import { logEvent } from "../../lib/auditLogger";
import { t } from "@/lib/i18n";

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

/** Optional: Seite kann Systemmeldungen als Bubble anzeigen */
type Props = { onSystemMessage?: (content: string) => void };

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

/** Icons pro Experte (Label wird lokalisiert) */
const EXPERTS: { id: ExpertId; icon: string }[] = [
  { id: "Biologist", icon: "🧬" },
  { id: "Chemist", icon: "⚗️" },
  { id: "Physicist", icon: "🪐" },
  { id: "Computer Scientist", icon: "💻" },
  { id: "Jurist", icon: "⚖️" },
  { id: "Architect / Civil Engineer", icon: "🏗️" },
  { id: "Landscape Designer", icon: "🌿" },
  { id: "Interior Designer", icon: "🛋️" },
  { id: "Electrical Engineer", icon: "🔌" },
  { id: "Mathematician", icon: "🔢" },
  { id: "Astrologer", icon: "✨" },
  { id: "Weather Expert", icon: "🌤️" },
  { id: "Molecular Scientist", icon: "🧪" },
];

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

function labelForExpert(id: ExpertId, lang: string): string {
  // Keys: experts.biologist etc.
  const key = `experts.${id
    .toLowerCase()
    .replace(/\s+\/\s+/g, "_")
    .replace(/\s+/g, "_")}`;

  const fromT = t(key);
  if (fromT && fromT !== key) return fromT; // echte Übersetzung vorhanden

  // Fallback DE/EN
  const de: Record<ExpertId, string> = {
    Biologist: "Biologe",
    Chemist: "Chemiker",
    Physicist: "Physiker",
    "Computer Scientist": "Informatiker",
    Jurist: "Jurist",
    "Architect / Civil Engineer": "Architekt / Bauingenieur",
    "Landscape Designer": "Landschaftsdesigner",
    "Interior Designer": "Innenarchitekt",
    "Electrical Engineer": "Elektroingenieur",
    Mathematician: "Mathematiker",
    Astrologer: "Astrologe",
    "Weather Expert": "Wetter-Experte",
    "Molecular Scientist": "Molekularwissenschaftler",
  };
  if (lang.startsWith("de")) return de[id];
  return id; // englische Basislabels
}

function sectionTitleExperts(lang: string): string {
  const key = "experts.title";
  const fromT = t(key);
  if (fromT && fromT !== key) return fromT;
  return lang.startsWith("de") ? "Experten" : "Experts";
}
function chooseExpertLabel(lang: string): string {
  const key = "experts.choose";
  const fromT = t(key);
  if (fromT && fromT !== key) return fromT;
  return lang.startsWith("de") ? "Wähle Experten" : "Choose expert";
}

function buildButtonLabel(lang: string): string {
  const key = "startBuilding";
  const fromT = t(key);
  if (fromT && fromT !== key) return fromT;
  return lang.startsWith("de") ? "Start building" : "Start building";
}

function buildButtonMsg(lang: string): string {
  const key = "startBuildingMsg";
  const fromT = t(key);
  if (fromT && fromT !== key) return fromT;
  return lang.startsWith("de")
    ? "Lass uns loslegen. Sag mir, was du bauen möchtest."
    : "Let’s get started. Tell me what you want to build.";
}

function expertAskPrompt(expertLabel: string, lang: string): string {
  const key = "experts.askTemplate";
  const templ = t(key);
  if (templ && templ !== key) {
    // naive Platzhalter-Unterstützung {expert}
    return templ.replace("{expert}", expertLabel);
  }
  return lang.startsWith("de")
    ? `${expertLabel}, wer bist du und was kannst du für mich tun?`
    : `${expertLabel}, who are you and what can you do for me?`;
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
  if (id === "onboarding") return "ONBOARDING";
  if (id === "M") return "M (Default)";
  if (id === "council") return "COUNCIL13";
  return MODI.find((m) => m.id === id)?.label ?? String(id);
}

async function callChatAPI(prompt: string): Promise<string | null> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
    });
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      return (
        data?.reply ||
        data?.content ||
        data?.message ||
        (Array.isArray(data?.choices) ? data.choices[0]?.message?.content : null) ||
        null
      );
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

export default function Saeule({ onSystemMessage }: Props) {
  const [activeMode, setActiveMode] = useState<ModeId>("M");
  const [hydrated, setHydrated] = useState(false);
  const [sendingExpert, setSendingExpert] = useState<ExpertId | null>(null);
  const [currentExpert, setCurrentExpert] = useState<ExpertId | null>(null); // ← neu
  const [lang, setLang] = useState<string>("en");


  useEffect(() => {
    setHydrated(true);
    setLang(getLang());
  }, []);

  useEffect(() => { try { if (activeMode) localStorage.setItem("mode", activeMode); } catch {} }, [activeMode]);
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
      if (m && (m === "onboarding" || m === "M" || m === "council" || /^C\d{2}$/.test(m))) {
        setActiveMode(m as ModeId);
      }
    } catch {}
  }, []);

  const modeLabel = useMemo(() => modeLabelFromId(activeMode), [activeMode]);

  async function switchMode(next: ModeId) {
  if (next === activeMode) return;

  logEvent("mode_switch", { from: activeMode, to: next });
  setActiveMode(next);

  const label = modeLabelFromId(next);
  const text  = `Mode set: ${label}.`;
  emitSystemMessage({ kind: "mode", text, meta: { modeId: next, label } });

  // ------ Auto-Prompt, super simpel ------
  let q = "";
  if (next === "onboarding") {
    q = lang.startsWith("de")
      ? "Hey! 👋 Wer bist du und wie begleitest du mich hier Schritt für Schritt?"
      : "Hey! 👋 Who are you and how will you guide me here step by step?";
  } else if (next === "M") {
    q = lang.startsWith("de")
      ? "Setze alles auf Standard zurück und sag mir kurz den Status."
      : "Reset everything to default and give me a brief status.";
  } else if (next === "council") {
    q = lang.startsWith("de")
      ? "Alle KIs bitte kurz vorstellen und sagen, wobei ihr sofort helfen könnt."
      : "Each AI please introduce yourself and say how you can help right now.";
  } else {
    q = lang.startsWith("de")
      ? `Modus ${label}: Was bist du und wobei unterstützt du mich am besten?`
      : `Mode ${label}: What are you and where will you help me best?`;
  }

  const reply = await callChatAPI(q);
  emitSystemMessage({
    kind: "reply",
    text: reply && reply.length ? reply
         : (lang.startsWith("de")
              ? "Bereit. Sag mir einfach, womit wir starten."
              : "Ready. Tell me where to start."),
    meta: { modeId: next, autoPrompt: true }
  });
}


  async function askExpert(expert: ExpertId) {
  if (sendingExpert) return;
  setSendingExpert(expert);

  const label = labelForExpert(expert, lang);
  const userPrompt = expertAskPrompt(label, lang);

  logEvent("expert_selected", { expert, label, roles: ROLES[expert] });
  emitSystemMessage({
    kind: "info",
    text: `🧩 ${label} – ${lang.startsWith("de") ? "Frage wird gesendet …" : "sending your question …"}`,
    meta: { expert, subkis: SUB_KIS[expert], roles: ROLES[expert] },
  });

  const reply = await callChatAPI(userPrompt);

  if (reply && reply.length > 0) {
    emitSystemMessage({ kind: "reply", text: reply, meta: { expert, source: "api" } });
  } else {
    const fallback = lang.startsWith("de")
      ? `Ich bin dein ${label}. Kurz: ${ROLES[expert]}. Sag mir, womit ich starten soll – ich liefere dir sofort klare, umsetzbare Hilfe.`
      : `I am your ${label}. In short: ${ROLES[expert]}. Tell me where to start — I’ll deliver clear, actionable help right away.`;
    emitSystemMessage({ kind: "reply", text: fallback, meta: { expert, source: "fallback" } });
  }

  setSendingExpert(null);
}

  /* UI */
  return (
    <aside className={styles.saeule} aria-label={t("columnAria")} data-test="saeule">
      {/* Kopf entfernt → Build-Button oben im Panel */}
      <div className={styles.block} style={{ marginTop: 8 }}>
        <button
          type="button"
          aria-label={buildButtonLabel(lang)}
          onClick={() => {
            const text = buildButtonMsg(lang);
            emitSystemMessage({ kind: "info", text });
            try { logEvent("cta_start_building_clicked", {}); } catch {}
          }}
          className={styles.buttonPrimary}
          style={{ width: "100%", cursor: "pointer" }}
        >
          {buildButtonLabel(lang)}
        </button>
      </div>

      {/* Steuerung */}
      <div className={styles.sectionTitle}>{t("sectionControl")}</div>

      {/* ONBOARDING */}
      <div className={styles.block}>
        <button
          type="button"
          aria-pressed={activeMode === "onboarding"}
          className={`${styles.buttonPrimary} ${activeMode === "onboarding" ? styles.active : ""}`}
          onClick={() => switchMode("onboarding")}
        >
          {t("onboarding")}
        </button>
      </div>

      {/* M (Default) */}
      <div className={styles.block}>
        <button
          type="button"
          aria-pressed={activeMode === "M"}
          className={`${styles.buttonSolid} ${activeMode === "M" ? styles.active : ""}`}
          onClick={() => switchMode("M")}
        >
          {t("mDefault")}
        </button>
      </div>

      {/* Modus-Dropdown */}
      <div className={styles.block}>
        <label className={styles.label} htmlFor="modus-select">
          {t("selectMode")}
        </label>
        <div className={styles.selectWrap}>
          <select
            id="modus-select"
            aria-label={t("selectMode")}
            value={hydrated ? (MODI.some((m) => m.id === activeMode) ? activeMode : "") : ""}
            onChange={(e) => switchMode(e.target.value as ModeId)}
            className={styles.select}
          >
            <option value="" disabled hidden>{t("selectMode")}</option>
            {MODI.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Council13 */}
<div className={styles.block}>
  <button
    type="button"
    aria-pressed={activeMode === "council"}
    className={`${styles.buttonGhostPrimary} ${activeMode === "council" ? styles.active : ""}`}
    onClick={() => switchMode("council")}
    style={{ width: "100%", cursor: "pointer" }}
  >
    {t("council13")}
  </button>
</div>


        {/* Experten (Dropdown) */}
<div className={styles.sectionTitle}>{sectionTitleExperts(lang)}</div>
<div className={styles.block}>
  <label className={styles.label} htmlFor="expert-select">
    {chooseExpertLabel(lang)}
  </label>
  <div className={styles.selectWrap}>
    <select
      id="expert-select"
      className={styles.select}
      aria-label={chooseExpertLabel(lang)}
      defaultValue=""
      onChange={(e) => {
        const val = e.target.value as unknown as ExpertId;
        if (val) { void askExpert(val); }
      }}
    >
      <option value="" disabled hidden>{chooseExpertLabel(lang)}</option>
      {EXPERTS.map((e) => (
        <option key={e.id} value={e.id}>
          {e.icon} {labelForExpert(e.id, lang)}
        </option>
      ))}
    </select>
  </div>
</div>


      {/* Aktionen: nur Export */}
      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={() => {
            try {
              const raw = localStorage.getItem("mpathy:thread:default") || "{}";
              const blob = new Blob([raw], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "mpathy-thread.json"; a.click();
              URL.revokeObjectURL(url);
              logEvent("export_thread", { size: raw.length });
              const key = "threadExported";
              const msg = t(key);
              const text =
                msg && msg !== key
                  ? msg
                  : (getLang().startsWith("de") ? "Thread exportiert." : "Thread exported.");
              emitSystemMessage({ kind: "info", text, meta: { bytes: raw.length || 0 } });
              onSystemMessage?.(text);
            } catch {}
          }}
        >
          {t("export")}
        </button>
      </div>

      {/* Statusleiste */}
      <div className={styles.statusBar} aria-live="polite">
        <span className={styles.statusKey}>{t("statusMode")}</span> {modeLabel}
      </div>
    </aside>
  );
}

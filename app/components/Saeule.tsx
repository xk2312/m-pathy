"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import styles from "./Saeule.module.css";
import { logEvent } from "../../lib/auditLogger";
import { t, getLocale } from "@/lib/i18n";

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
type Props = {
  onSystemMessage?: (content: string) => void;
  onClearChat?: () => void;   // ⬅︎ NEU: Clear-Handler (kommt aus page2)
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

function labelForExpert(id: ExpertId, _lang: string): string {
  const key = `experts.${id.toLowerCase().replace(/\s+\/\s+/g, "_").replace(/\s+/g, "_")}`;
  const fromT = t(key);
  return fromT && fromT !== key ? fromT : id; // i18n → sonst neutrale ID
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
  if (id === "onboarding") return "ONBOARDING";
  if (id === "M") return "M (Default)";
  if (id === "council") return "COUNCIL13";
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
  const [activeMode, setActiveMode] = useState<ModeId>("M");
  const [hydrated, setHydrated] = useState(false);
  const [sendingExpert, setSendingExpert] = useState<ExpertId | null>(null);
  const [currentExpert, setCurrentExpert] = useState<ExpertId | null>(null);
  const [lang, setLang] = useState<string>("en");


useEffect(() => {
  // initial aus zentralem i18n
  setLang(getLocale());
  const onChange = (e: Event) => {
    const next = (e as CustomEvent).detail?.locale as string | undefined;
    if (next) setLang(next);
  };
  window.addEventListener("mpathy:i18n:change", onChange as EventListener);
  return () => window.removeEventListener("mpathy:i18n:change", onChange as EventListener);
}, []);



 useEffect(() => {
  setHydrated(true);
  setLang(getLocale());
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
  // ▼▼ NEU: Footer-Status ohne Bubble senden ▼▼
const emitStatus = useCallback((partial: { modeLabel?: string; expertLabel?: string; busy?: boolean }) => {
  try {
    window.dispatchEvent(new CustomEvent("mpathy:system-message", {
      detail: { kind: "status", text: "", meta: partial },
    }));
  } catch {}
}, []);

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
emitStatus({ modeLabel: label });

// ▼▼ Sofortiges Schließen des Mobile-Overlays, ohne Bubble ▼▼
try {
  const inOverlay = !!document.querySelector('[data-overlay="true"]');
  if (inOverlay) { onSystemMessage?.(""); } // leeres Signal → MobileOverlay schließt
} catch {}
// ▲▲ Ende Overlay-Close ▲▲

emitStatus({ modeLabel: label });

// ▼▼ Sofortiges Schließen des Mobile-Overlays, ohne Bubble ▼▼
try {
  const inOverlay = !!document.querySelector('[data-overlay="true"]');
  if (inOverlay) { onSystemMessage?.(""); } // leeres Signal → MobileOverlay schließt
} catch {}
// ▲▲ Ende Overlay-Close ▲▲

// Auto-Prompt nur für die API (Keys aus i18n.ts → "prompts.*")
const q =
  next === "onboarding"
    ? tr("prompts.onboarding", "Hey! 👋 Who are you and how will you guide me here step by step?")
    : next === "M"
    ? tr("prompts.modeDefault", "Reset everything to default and give me a brief status.")
    : next === "council"
    ? tr("prompts.councilIntro", "Each AI please introduce yourself and say how you can help right now.")
    : tr("prompts.modeGeneric", "Mode {label}: What are you and where will you help me best?", { label });


  const reply = await callChatAPI(q);
  if (reply && reply.trim().length > 0) {
    say(reply);
  }
}

async function askExpert(expert: ExpertId) {
  if (sendingExpert) return;
  setSendingExpert(expert);
  setCurrentExpert(expert);

  const label = labelForExpert(expert, lang);

  // Telemetrie
  logEvent("expert_selected", { expert, label, roles: ROLES[expert] });

  // Footer sofort aktualisieren (ohne Bubble)
  emitStatus({ expertLabel: label });

  // ⬅️ NEU: sofortiges Ack -> schließt MobileOverlay direkt
  say(tr("status.expertSet", "Expert set: {label}.", { label }));

  // Prompt an API – keine festen Fallbacks
  const userPrompt = expertAskPrompt(label, lang);
  const reply = await callChatAPI(userPrompt);
  if (reply && reply.trim().length > 0) {
    say(reply); // genau eine Antwort-Bubble
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
  onClick={async () => {
    const prompt = buildButtonMsg(lang);
    try { logEvent("cta_start_building_clicked", {}); } catch {}

    // ▼ Overlay sofort schließen (ohne Bubble)
    try {
      const inOverlay = !!document.querySelector('[data-overlay="true"]');
      if (inOverlay) { onSystemMessage?.(""); }
    } catch {}
    // ▲ Ende Overlay-Close

    // kurze Echo-Info (dezent)
    emitSystemMessage({ kind: "info", text: prompt, meta: { source: "cta" } });

    // Chat-Aufruf + Reply ausgeben (einmalig)
    const reply = await callChatAPI(prompt);

const finalText = reply && reply.length
  ? reply
  : tr("cta.fallback", "All set — tell me what you want to build (app, flow, feature …).");

say(finalText);

          }}
          className={styles.buttonPrimary}
          style={{ width: "100%", cursor: "pointer" }}
        >
          {buildButtonLabel(lang)}
        </button>
      </div>


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
    onClick={() => {
      // ▼ Overlay sofort schließen (ohne Bubble)
      try {
        const inOverlay = !!document.querySelector('[data-overlay="true"]');
        if (inOverlay) { onSystemMessage?.(""); }
      } catch {}
      // ▲ Ende Overlay-Close
      void switchMode("M");
    }}
  >
    {t("mDefault")}
  </button>
</div>


      {/* Modus-Dropdown */}
      <div className={styles.block}>
        <label className={styles.label} htmlFor="modus-select">
  {tr("labels.modes", "Modis & Experts")}
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
           
           
           {/* Experten (Dropdown) */}


  <div className={styles.selectWrap}>
  <select
    id="expert-select"
    className={styles.select}
    aria-label={chooseExpertLabel(lang)}
    value={hydrated ? (currentExpert ?? "") : ""}   // ⬅︎ kontrolliert, wie Modis
    onChange={(e) => {
      const val = e.target.value as ExpertId;
      setCurrentExpert(val);                        // ⬅︎ State setzen (Kontrolle)
      void askExpert(val);                          // ⬅︎ Auswahl anwenden
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


   


{/* Aktionen: Export (links, 50%) + Clear (rechts, 50%) */}
<div
  className={styles.actions}
  style={{ display: "flex", gap: 8, alignItems: "stretch", flexWrap: "nowrap" }}
>
  {/* Export – links, 50% */}
  <button
    className={styles.button}
    style={{ width: "50%", cursor: "pointer" }}
    onClick={() => {
      try {
        const raw = localStorage.getItem("mpathy:thread:default") || "{}";
        const blob = new Blob([raw], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "mpathy-thread.json"; a.click();
        URL.revokeObjectURL(url);
        logEvent("export_thread", { size: raw.length });
        say(tr("threadExported", "Thread exported."));
      } catch {}
    }}
    aria-label={tr("exportAria", "Export thread")}
    title={tr("export", "Export")}
  >
    {tr("export", "Export")}
  </button>

  {/* Clear – rechts, 50% (immer aktiv) */}
  <button
    className={styles.button}
    style={{
      width: "50%",
      cursor: "pointer",
      background: "rgba(220, 38, 38, 0.18)",
      borderColor: "rgba(248, 113, 113, 0.85)",
      color: "rgba(255,255,255,0.98)",
      boxShadow: "inset 0 0 0 1px rgba(248,113,113,0.55)",
    }}
    onClick={() => {
      console.log("[P1] Clear button clicked");
      console.log("[P2] typeof onClearChat =", typeof onClearChat);
      try { onClearChat?.(); } catch (e) { console.error("[P2→P4] onClearChat threw:", e); }
    }}
    aria-label={tr("clearChatAria", "Clear chat")}
    title={tr("clearChat", "Clear")}
    role="button"
    data-test="btn-clear-chat"
  >
    {tr("clearChat", "Clear")}
  </button>
</div>





      {/* Statusleiste */}
      <div className={styles.statusBar} aria-live="polite">
        <span className={styles.statusKey}>{t("statusMode")}</span> {modeLabel}
      </div>
    </aside>
  );
    }

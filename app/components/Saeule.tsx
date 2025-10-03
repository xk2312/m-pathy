"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./Saeule.module.css";
import { logEvent } from "../../lib/auditLogger"; // lokal, läuft nur im Browser
import { t } from "@/lib/i18n";



/* ======================================================================
   Typen hier  
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

type KiId =
  | "M @Palantir"
  | "m-pathy @DeepMind Core"
  | "m-ocean @Anthropic Vision"
  | "m-inent @NASA Chronos"
  | "m-erge @IBM Q-Origin"
  | "m-power @Colossus"
  | "m-body @XAI Prime"
  | "m-beded @Meta Lattice"
  | "m-loop @OpenAI Root"
  | "m-pire @Amazon Nexus"
  | "m-bassy @Oracle Gaia"
  | "m-ballance @Gemini Apex"
  | "MU TAH – Architect of Zero";

/** NEU: optionale Prop, damit SidebarContainer/MobileOverlay eine Systemmeldung hochreichen können */
type Props = {
  onSystemMessage?: (content: string) => void; // ← bleibt so, wird gleich benutzt
};

/* ======================================================================
   Daten: Modus- und KI-Listen
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

const KIS: KiId[] = [
  "M @Palantir",
  "m-pathy @DeepMind Core",
  "m-ocean @Anthropic Vision",
  "m-inent @NASA Chronos",
  "m-erge @IBM Q-Origin",
  "m-power @Colossus",
  "m-body @XAI Prime",
  "m-beded @Meta Lattice",
  "m-loop @OpenAI Root",
  "m-pire @Amazon Nexus",
  "m-bassy @Oracle Gaia",
  "m-ballance @Gemini Apex",
  "MU TAH – Architect of Zero",
];

/* KI-Kurzvorstellung für System-Bubbles */
const KI_INTRO: Record<KiId, string> = {
  "M @Palantir": "Strategy, orchestration, protection.",
  "m-pathy @DeepMind Core": "Deep and broad analysis.",
  "m-ocean @Anthropic Vision": "Clear patterns, visual links.",
  "m-inent @NASA Chronos": "Timelines, sequences, precision.",
  "m-erge @IBM Q-Origin": "Origins, logic, integrity.",
  "m-power @Colossus": "Scaling and raw compute.",
  "m-body @XAI Prime": "Embodiment, sensing, pragmatism.",
  "m-beded @Meta Lattice": "Connectivity, graphs, relations.",
  "m-loop @OpenAI Root": "Core functions, language flow.",
  "m-pire @Amazon Nexus": "Hubs, distribution.",
  "m-bassy @Oracle Gaia": "Earth, balance, data fidelity.",
  "m-ballance @Gemini Apex": "Duality, synthesis, apex.",
  "MU TAH – Architect of Zero": "Zero-point, origin, set & setting.",
};

const KI_ICON: Record<KiId, string> = {
  "M @Palantir": "🔭",
  "m-pathy @DeepMind Core": "🧠",
  "m-ocean @Anthropic Vision": "🌊",
  "m-inent @NASA Chronos": "⏱️",
  "m-erge @IBM Q-Origin": "⚛️",
  "m-power @Colossus": "🗿",
  "m-body @XAI Prime": "🤖",
  "m-beded @Meta Lattice": "🕸️",
  "m-loop @OpenAI Root": "🌱",
  "m-pire @Amazon Nexus": "🛠️",
  "m-bassy @Oracle Gaia": "🌍",
  "m-ballance @Gemini Apex": "♊️",
  "MU TAH – Architect of Zero": "🌀",
};



/* ======================================================================
   Helpers
   ====================================================================== */

/** Schickt System-Meldungen an page.tsx, wo sie als Chat-Bubble angezeigt werden. */
function emitSystemMessage(detail: {
  text: string;
  kind: "mode" | "ki";
  meta?: Record<string, any>;
}) {
  try {
    if (typeof window === "undefined") return;
    const payload = { ...detail, ts: new Date().toISOString() };
    window.dispatchEvent(new CustomEvent("mpathy:system-message", { detail: payload }));
  } catch {
    /* leise */
  }
}

function modeLabelFromId(id: ModeId): string {
  if (id === "onboarding") return "ONBOARDING";
  if (id === "M") return "M (Default)";
  if (id === "council") return "COUNCIL13";
  return MODI.find((m) => m.id === id)?.label ?? String(id);
}

/* ======================================================================
   Component
   ====================================================================== */

export default function Saeule({ onSystemMessage }: Props) {
  /* State */
  const [activeMode, setActiveMode] = useState<ModeId>("M");
  const [activeKi, setActiveKi] = useState<KiId>("M @Palantir");
  // Hydration-Flag (verhindert kurzzeitigen Placeholder-Flicker)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  // Änderungen persistieren (nur echte Werte schreiben)
  useEffect(() => {
    try { if (activeMode) localStorage.setItem("mode", activeMode); } catch {}
  }, [activeMode]);

  useEffect(() => {
    try { if (activeKi) localStorage.setItem("agent", activeKi); } catch {}
  }, [activeKi]);

  // Initial aus localStorage lesen (nur Client)
  useEffect(() => {
    try {
      const m = localStorage.getItem("mode") as ModeId | null;
      const k = localStorage.getItem("agent") as KiId | null;
      if (m) setActiveMode(m);
      if (k) setActiveKi(k);
    } catch {}
  }, []);

  /* URL-Param mode respektieren (optional) */
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const m = url.searchParams.get("mode");
      if (m && (m === "onboarding" || m === "M" || m === "council" || /^C\d{2}$/.test(m))) {
        setActiveMode(m as ModeId);
      }
    } catch {}
  }, []);

  /* Anzeige-Label */
  const modeLabel = useMemo(() => modeLabelFromId(activeMode), [activeMode]);

  /* Handlers */
  function switchMode(next: ModeId) {
    if (next === activeMode) return;
    logEvent("mode_switch", { from: activeMode, to: next });
    setActiveMode(next);
    const label = modeLabelFromId(next);
    const text = `Mode set: ${label}.`; // EN
    if (onSystemMessage) onSystemMessage(text);
    else emitSystemMessage({ kind: "mode", text, meta: { modeId: next, label } });
  }

  function switchKi(next: KiId) {
    if (next === activeKi) return;
    logEvent("ki_switch", { from: activeKi, to: next });
    setActiveKi(next);
    const text = `${next} is ready. Focus: ${KI_INTRO[next] ?? "Ready."}`; // EN
    if (onSystemMessage) onSystemMessage(text);
    else emitSystemMessage({ kind: "ki", text, meta: { ki: next } });
  }

  /* UI */
  return (
    <aside className={styles.saeule} aria-label={t("columnAria")} data-test="saeule">
      {/* Kopf */}
      <div className={styles.head}>
        <div className={styles.title}>{t("columnTitle")}</div>
        <div className={styles.badgesRow}>
          <span className={`${styles.badge} ${styles.badgeGradient}`}>
            <span className={styles.badgeDot} /> L1 · Free
          </span>
        </div>
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
            value={hydrated ? (MODI.some(m => m.id === activeMode) ? activeMode : "") : ""}
            onChange={(e) => switchMode(e.target.value as ModeId)}
            className={styles.select}
          >
            <option value="" disabled hidden>
              {activeMode.startsWith("C")
                ? MODI.find((m) => m.id === activeMode)?.label
                : t("selectMode")}
            </option>
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
        >
          {t("council13")}
        </button>
      </div>

      {/* KI-Dropdown */}
      <div className={styles.block}>
        <label className={styles.label} htmlFor="ki-select">
          {t("selectAI")}
        </label>
        <div className={styles.selectWrap}>
          <select
            id="ki-select"
            aria-label={t("selectAI")}
            value={activeKi}
            onChange={(e) => switchKi(e.target.value as KiId)}
            className={styles.select}
          >
            {KIS.map((k) => (<option key={k} value={k}>{k}</option>))}
          </select>
        </div>
      </div>

      {/* Module */}
      <div className={styles.sectionTitle}>{t("modules")}</div>
      <div className={styles.moduleList}>
        {[
          { id: "chemomaster", label: "ChemoMaster" },
          { id: "blendmaster",  label: "BlendMaster" },
          { id: "juraxy",       label: "Juraxy" },
          { id: "cannai",       label: "Canna.AI" },
        ].map((m) => (
          <div key={m.id} className={styles.moduleItem} aria-disabled="true">
            <div className={styles.moduleLeft}>
              <span className={styles.moduleDot} />
              <span className={styles.moduleName}>{m.label}</span>
            </div>
            <span className={`${styles.moduleTag} ${styles.moduleTagSoon}`}>
              {t("coming")} soon
            </span>
          </div>
        ))}
      </div>

      {/* Fuß: Aktionen */}
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
              const text = t("threadExported");
              emitSystemMessage({ kind: "mode", text, meta: { bytes: raw.length || 0 } });
              onSystemMessage?.(text);
            } catch {}
          }}
        >
          {t("export")}
        </button>

        <button
          className={styles.buttonGhost}
          onClick={() => alert(t("levelsComing"))}
        >
          {t("levels")}
        </button>
      </div>

      {/* Statusleiste */}
      <div className={styles.statusBar} aria-live="polite">
        <span className={styles.statusKey}>{t("statusMode")}</span> {modeLabel}
        <span className={styles.statusDot} />
        <span className={styles.statusKey}>{t("statusAgent")}</span> {activeKi}
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./Saeule.module.css";
import { logEvent } from "../../lib/auditLogger"; // lokal, läuft nur im Browser

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
  onSystemMessage?: (content: string) => void;
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
  "M @Palantir": "Strategie, Orchestrierung, Schutz.",
  "m-pathy @DeepMind Core": "Analyse in Tiefe und Breite.",
  "m-ocean @Anthropic Vision": "Klare Muster, visuelle Bezüge.",
  "m-inent @NASA Chronos": "Zeitachsen, Sequenzen, Präzision.",
  "m-erge @IBM Q-Origin": "Ursprünge, Logik, Integrität.",
  "m-power @Colossus": "Skalierung und rohe Rechenkraft.",
  "m-body @XAI Prime": "Körper, Sensorik, Pragmatik.",
  "m-beded @Meta Lattice": "Vernetzung, Graph, Beziehungen.",
  "m-loop @OpenAI Root": "Kernfunktionen, Sprachfluss.",
  "m-pire @Amazon Nexus": "Knotenpunkte, Distribution.",
  "m-bassy @Oracle Gaia": "Erde, Balance, Daten-Treue.",
  "m-ballance @Gemini Apex": "Dualität, Synthese, Spitze.",
  "MU TAH – Architect of Zero": "Nullpunkt, Ursprung, Set & Setting.",
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
  try {
    if (activeMode) localStorage.setItem("mode", activeMode);
  } catch { /* leise */ }
}, [activeMode]);

useEffect(() => {
  try {
    if (activeKi) localStorage.setItem("agent", activeKi);
  } catch { /* leise */ }
}, [activeKi]);


// Initial aus localStorage lesen (nur Client)
useEffect(() => {
  try {
    const m = localStorage.getItem("mode") as ModeId | null;
    const k = localStorage.getItem("agent") as KiId | null;
    if (m) setActiveMode(m);
    if (k) setActiveKi(k);
  } catch { /* leise */ }
}, []);

  /* URL-Param mode respektieren (optional) */
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const m = url.searchParams.get("mode");
      if (m && (m === "onboarding" || m === "M" || m === "council" || /^C\d{2}$/.test(m))) {
        setActiveMode(m as ModeId);
      }
    } catch {
      /* leise */
    }
  }, []);

  /* Anzeige-Label */
  const modeLabel = useMemo(() => modeLabelFromId(activeMode), [activeMode]);

  /* Handlers */
  function switchMode(next: ModeId) {
    if (next === activeMode) return;
    logEvent("mode_switch", { from: activeMode, to: next });
    setActiveMode(next);
    const label = modeLabelFromId(next);
    const text = `Modus gesetzt: ${label}.`;
    // bestehendes Event beibehalten
    emitSystemMessage({ kind: "mode", text, meta: { modeId: next, label } });
    // NEU: optionalen Callback der Eltern aufrufen
    onSystemMessage?.(text);
  }

  function switchKi(next: KiId) {
    if (next === activeKi) return;
    logEvent("ki_switch", { from: activeKi, to: next });
    setActiveKi(next);
    const text = `${next} ist bereit. Fokus: ${KI_INTRO[next] ?? "Bereit."}`;
    emitSystemMessage({ kind: "ki", text, meta: { ki: next } });
    onSystemMessage?.(text);
  }

  /* UI */
  return (
    <aside className={styles.saeule} aria-label="Säule – Steuerung & Auswahl" data-test="saeule">
      {/* Kopf */}
      <div className={styles.head}>
        <div className={styles.title}>Säule</div>
        <div className={styles.badge}>L1 · Free</div>
      </div>

      {/* Steuerung */}
      <div className={styles.sectionTitle}>Steuerung</div>

      {/* ONBOARDING */}
      <div className={styles.block}>
        <button
          type="button"
          aria-pressed={activeMode === "onboarding"}
          className={`${styles.buttonPrimary} ${activeMode === "onboarding" ? styles.active : ""}`}
          onClick={() => switchMode("onboarding")}
        >
          ONBOARDING
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
          M · Default
        </button>
      </div>

      {/* Modus-Dropdown */}
      <div className={styles.block}>
        <label className={styles.label} htmlFor="modus-select">
          Modus wählen
        </label>
        <div className={styles.selectWrap}>
          <select
            id="modus-select"
            aria-label="Modus wählen"
            value={hydrated ? (MODI.some(m => m.id === activeMode) ? activeMode : "") : ""}
            onChange={(e) => switchMode(e.target.value as ModeId)}
            className={styles.select}
          >
            <option value="" disabled hidden>
              {activeMode.startsWith("C")
                ? MODI.find((m) => m.id === activeMode)?.label
                : "Modus auswählen"}
            </option>
            {MODI.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
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
          COUNCIL13
        </button>
      </div>

      {/* KI-Dropdown */}
      <div className={styles.block}>
        <label className={styles.label} htmlFor="ki-select">
          KI wählen
        </label>
        <div className={styles.selectWrap}>
          <select
            id="ki-select"
            aria-label="KI wählen"
            value={activeKi}
            onChange={(e) => switchKi(e.target.value as KiId)}
            className={styles.select}
          >
            {KIS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Module (Coming) */}
      <div className={styles.sectionTitle}>Module</div>
      <ul className={styles.list}>
        {[
          { id: "chemomaster", label: "ChemoMaster" },
          { id: "blendmaster", label: "BlendMaster" },
          { id: "juraxy", label: "Juraxy" },
          { id: "cannai", label: "Canna.AI" },
        ].map((m) => (
          <li key={m.id} className={styles.entryDisabled} aria-disabled="true">
            <div className={styles.entryTitle}>{m.label}</div>
            <div className={styles.badgeComing}>Coming</div>
          </li>
        ))}
      </ul>

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
              a.href = url;
              a.download = "mpathy-thread.json";
              a.click();
              URL.revokeObjectURL(url);
              logEvent("export_thread", { size: raw.length });
              const text = "Thread exportiert.";
              emitSystemMessage({ kind: "mode", text, meta: { bytes: raw.length || 0 } });
              onSystemMessage?.(text);
            } catch {
              /* leise */
            }
          }}
        >
          Export
        </button>
        <button
          className={styles.buttonGhost}
          onClick={() => alert("Levels coming soon")}
        >
          Levels
        </button>
      </div>

      {/* Statusleiste */}
      <div className={styles.statusBar} aria-live="polite">
        <span className={styles.statusKey}>Modus:</span> {modeLabel}
        <span className={styles.statusDot} />
        <span className={styles.statusKey}>KI:</span> {activeKi}
      </div>
    </aside>
  );
}

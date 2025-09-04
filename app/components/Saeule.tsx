"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./Saeule.module.css";
import audit from "../../lib/auditLogger";
const { logEvent } = audit;



type ModeId = "onboarding" | "M" | "council" | `C${string}`;
type KiId =
  | "M (Auto)"
  | "Claude 3.5 Opus"
  | "GPT-4o"
  | "Gemini 1.5"
  | "Complexity"
  | "Colossus"
  | "Anthropic Vision"
  | "DeepMind Core"
  | "NASA Chronos"
  | "IBM Q-Origin"
  | "Meta Lattice"
  | "Oracle Gaia"
  | "Amazon Nexus"
  | "OpenAI Root";

const MODI: ModeId[] = (Array.from({ length: 11 }, (_, i) => `C${String(i + 1).padStart(2, "0")}`) as ModeId[]);
const KIS: KiId[] = [
  "M (Auto)",
  "Claude 3.5 Opus",
  "GPT-4o",
  "Gemini 1.5",
  "Complexity",
  "Colossus",
  "Anthropic Vision",
  "DeepMind Core",
  "NASA Chronos",
  "IBM Q-Origin",
  "Meta Lattice",
  "Oracle Gaia",
  "Amazon Nexus",
  "OpenAI Root",
];

function logEvent(name: string, data: Record<string, any>) {
  try {
    const ts = new Date().toISOString();
    const prev = JSON.parse(localStorage.getItem("mpathy:audit") || "[]");
    prev.push({ name, ts, ...data });
    localStorage.setItem("mpathy:audit", JSON.stringify(prev));
    // Debug (leise):
    // console.debug("[audit]", name, data);
  } catch {}
}

export default function Saeule() {
  // --- State ---------------------------------------------------------------
  const [activeMode, setActiveMode] = useState<ModeId>("M"); // Default M initial aktiv
  const [activeKi, setActiveKi] = useState<KiId>("M (Auto)"); // KI-Auswahl unabhängig

  // URL-Param „mode“ optional respektieren (nicht zwingend)
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const m = url.searchParams.get("mode");
      if (m && (m === "onboarding" || m === "M" || m === "council" || /^C\d{2}$/.test(m))) {
        setActiveMode(m as ModeId);
      }
    } catch {}
  }, []);

  // Ableitungen für Anzeige
  const modeLabel = useMemo(() => {
    if (activeMode === "onboarding") return "ONBOARDING";
    if (activeMode === "M") return "M (Default)";
    if (activeMode === "council") return "COUNCIL13";
    return activeMode; // Cxx
  }, [activeMode]);

  // --- Handlers ------------------------------------------------------------
  function switchMode(next: ModeId) {
    if (next === activeMode) return;
    logEvent("mode_switch", { from: activeMode, to: next });
    setActiveMode(next);
  }

  function switchKi(next: KiId) {
    if (next === activeKi) return;
    logEvent("ki_switch", { from: activeKi, to: next });
    setActiveKi(next);
  }

  // --- UI ------------------------------------------------------------------
  return (
    <aside className={styles.saeule} aria-label="Säule – Steuerung & Auswahl" data-test="saeule">
      {/* Kopf */}
      <div className={styles.head}>
        <div className={styles.title}>Säule</div>
        <div className={styles.badge}>L1 · Free</div>
      </div>

      {/* Sektion: Steuerung */}
      <div className={styles.sectionTitle}>Steuerung</div>

      {/* ONBOARDING (Einzel-Button) */}
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

      {/* M (Default) – immer anwählbar, initial aktiv */}
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

      {/* MODUS wählen (Dropdown mit C01–C11) */}
      <div className={styles.block}>
        <label className={styles.label} htmlFor="modus-select">
          Modus wählen
        </label>
        <div className={styles.selectWrap}>
          <select
            id="modus-select"
            aria-label="Modus wählen"
            value={activeMode.startsWith("C") ? activeMode : ""}
            onChange={(e) => {
              const next = (e.target.value || "M") as ModeId;
              switchMode(next);
            }}
            className={styles.select}
          >
            <option value="" disabled hidden>
              {activeMode.startsWith("C") ? activeMode : "C01–C11 auswählen"}
            </option>
            {MODI.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* COUNCIL13 (Einzel-Button) */}
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

      {/* KI wählen (Dropdown mit 13 KIs) */}
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
            } catch {}
          }}
        >
          Export
        </button>
        <button className={styles.buttonGhost} onClick={() => alert("Levels coming soon")}>
          Levels
        </button>
      </div>

      {/* Leiser Status (aktueller Modus/KI) */}
      <div className={styles.statusBar} aria-live="polite">
        <span className={styles.statusKey}>Modus:</span> {modeLabel}
        <span className={styles.statusDot} />
        <span className={styles.statusKey}>KI:</span> {activeKi}
      </div>
    </aside>
  );
}

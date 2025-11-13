"use client";

import React, { useMemo, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

// --------------------------------------------------------
// Types & static mode registry
// --------------------------------------------------------

type ModeId =
  | "onboarding"
  | "research"
  | "council"
  | "calm"
  | "play"
  | "oracle"
  | "joy"
  | "vision"
  | "empathy"
  | "love"
  | "wisdom"
  | "truth"
  | "peace"
  | "flow"
  | "build";

type ModeGroupId = "core" | "mind" | "creator" | "heart" | "spirit";

type ModeMetaBase = {
  id: ModeId;
  group: ModeGroupId;
  name: string;
  label: string;
  description: string;
};

const GROUP_LABELS: Record<ModeGroupId, string> = {
  core: "Core",
  mind: "Intellect",
  creator: "Creator",
  heart: "Heart",
  spirit: "Spirit",
};

const MODE_ORDER: ModeId[] = [
  "flow",
  "onboarding",
  "build",
  "research",
  "truth",
  "wisdom",
  "play",
  "vision",
  "oracle",
  "empathy",
  "love",
  "joy",
  "calm",
  "peace",
  "council",
];

const BASE_MODES: Record<ModeId, ModeMetaBase> = {
  onboarding: {
    id: "onboarding",
    group: "core",
    name: "ONBOARDING",
    label: "Start here",
    description:
      "Gently sets up your context, preferences, and safety rails before deep work.",
  },
  research: {
    id: "research",
    group: "mind",
    name: "RESEARCH",
    label: "Deep clarity",
    description:
      "Turns the system into a research analyst that checks sources and structures complex topics.",
  },
  council: {
    id: "council",
    group: "spirit",
    name: "COUNCIL13",
    label: "13 minds, one answer",
    description:
      "Lets the inner council debate and converge before you see the final distilled answer.",
  },
  calm: {
    id: "calm",
    group: "heart",
    name: "CALM",
    label: "Soft landing",
    description:
      "Slows everything down, simplifies language, and protects you from overwhelm.",
  },
  play: {
    id: "play",
    group: "creator",
    name: "PLAY",
    label: "Creative sandbox",
    description:
      "Switches into playful experimentation for naming, stories, ideas and wild combinations.",
  },
  oracle: {
    id: "oracle",
    group: "creator",
    name: "ORACLE",
    label: "Pattern sight",
    description:
      "Surfaces patterns, options and timelines without pretending to predict the future.",
  },
  joy: {
    id: "joy",
    group: "heart",
    name: "JOY",
    label: "Light & encouragement",
    description:
      "Answers with a warm, uplifting tone while still being precise and grounded.",
  },
  vision: {
    id: "vision",
    group: "creator",
    name: "VISION",
    label: "Future sketch",
    description:
      "Helps you prototype futures, products and narratives from Point Zero.",
  },
  empathy: {
    id: "empathy",
    group: "heart",
    name: "EMPATHY",
    label: "Deep listening",
    description:
      "Mirrors what you feel, clarifies needs, and suggests gentle next steps.",
  },
  love: {
    id: "love",
    group: "heart",
    name: "LOVE",
    label: "Devoted support",
    description:
      "Holds your long-term journey, remembers what matters and protects your core values.",
  },
  wisdom: {
    id: "wisdom",
    group: "mind",
    name: "WISDOM",
    label: "Slow thinking",
    description:
      "Connects dots across domains, highlights trade-offs and points to long arcs.",
  },
  truth: {
    id: "truth",
    group: "mind",
    name: "TRUTH",
    label: "Reality check",
    description:
      "Asks hard questions, fights wishful thinking, and grounds ideas in constraints.",
  },
  peace: {
    id: "peace",
    group: "spirit",
    name: "PEACE",
    label: "Nervous system reset",
    description:
      "Helps you de-escalate, breathe, and re-enter work from a grounded place.",
  },
  flow: {
    id: "flow",
    group: "core",
    name: "FLOW",
    label: "Mode autopilot",
    description:
      "Lets the system switch modes for you to keep you in a deep, uninterrupted flow.",
  },
  build: {
    id: "build",
    group: "core",
    name: "BUILD",
    label: "Shipping mode",
    description:
      "Focuses on concrete output: specs, tickets, code, copy and checklists.",
  },
};

const MODE_GROUPS: { id: ModeGroupId; modes: ModeId[] }[] = [
  { id: "core",    modes: ["onboarding", "flow", "build"] },
  { id: "mind",    modes: ["research", "truth", "wisdom"] },
  { id: "creator", modes: ["play", "vision", "oracle"] },
  { id: "heart",   modes: ["empathy", "love", "joy"] },
  { id: "spirit",  modes: ["calm", "peace", "council"] },
];

// --------------------------------------------------------
// Component
// --------------------------------------------------------

export default function Modes13() {
  const { t } = useLang();
  const [activeId, setActiveId] = useState<ModeId>("flow");
  const [activeGroup, setActiveGroup] = useState<ModeGroupId>("core");

  const modes = useMemo(() => {
    const out: ModeMetaBase[] = [];

    for (const id of MODE_ORDER) {
      const base = BASE_MODES[id];
      const prefix = `modes.${id}`;
      const nameKey = `${prefix}.name`;
      const labelKey = `${prefix}.label`;
      const descKey = `${prefix}.description`;

      const nameT = t(nameKey);
      const labelT = t(labelKey);
      const descT = t(descKey);

      const safe = (val: string, key: string, fallback: string) =>
        !val || val === key ? fallback : val;

      out.push({
        ...base,
        name: safe(nameT, nameKey, base.name),
        label: safe(labelT, labelKey, base.label),
        description: safe(descT, descKey, base.description),
      });
    }
    return out;
  }, [t]);

   const active = modes.find((m) => m.id === activeId) ?? modes[0];

  const onSelect = (id: ModeId) => {
    setActiveId(id);
    const g = BASE_MODES[id]?.group;
    if (g) setActiveGroup(g);
  };

  /* FLOW — Mode Sequencer */
  React.useEffect(() => {
    if (activeId !== "flow") return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    // Reihenfolge: alle Modi außer FLOW selbst
    const seq = MODE_ORDER.filter((id) => id !== "flow");
    let i = 0;

    const tick = () => {
      const next = seq[i % seq.length];
      const g = BASE_MODES[next].group;
      setActiveId(next);
      setActiveGroup(g);
      i++;
    };

    // langsame, meditative Geschwindigkeit
    tick();
    const interval = setInterval(tick, 1600);

    return () => clearInterval(interval);
  }, [activeId]);

  return (

    <section
      className="m-modes13"
      aria-labelledby="m-modes13-title"
      data-mode={active.id}
      data-mode-group={active.group}
    >
      <div className="m-modes13-inner">
        {/* Kopfbereich */}
        <header className="m-modes13-header">
          <p className="m-modes13-kicker">
            {t("modes.kicker") !== "modes.kicker"
              ? t("modes.kicker")
              : "Modes · GPTM-Galaxy core states"}
          </p>
          <h2 id="m-modes13-title" className="m-modes13-title">
            {t("modes.title") !== "modes.title"
              ? t("modes.title")
              : "Your operating modes"}
          </h2>
          <p className="m-modes13-subtitle">
            {t("modes.subtitle") !== "modes.subtitle"
              ? t("modes.subtitle")
              : "Choose a mode to see how GPTM-Galaxy behaves – or let FLOW orchestrate them for you."}
          </p>
        </header>

        {/* Mobile-Order: 1) Textspalte, 2) Figur */}
        <div className="m-modes13-main">
          {/* Linke Spalte: Tabs, Pills, Beschreibung */}
          <div className="m-modes13-left">
            {/* Mode-Selector (Tabs + aktive Gruppe) */}
            <div className="m-modes13-selector" aria-label="Mode selector">
              <span className="m-modes13-selector-label">
                {t("modes.dropdown.label") !== "modes.dropdown.label"
                  ? t("modes.dropdown.label")
                  : "Choose a mode"}
              </span>

              {/* Tab-Leiste für die Gruppen (Core, Intellect, Creator, Heart, Spirit) */}
              <div
                className="m-modes13-tabs"
                role="tablist"
                aria-label="Mode groups"
              >
                {MODE_GROUPS.map((group) => {
                  const isActive = group.id === activeGroup;
                  const label =
                    t(`modes.group.${group.id}`) !== `modes.group.${group.id}`
                      ? t(`modes.group.${group.id}`)
                      : GROUP_LABELS[group.id];

                  return (
                    <button
                      key={group.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={
                        "m-modes13-tab" +
                        (isActive ? " m-modes13-tab--active" : "")
                      }
                      onClick={() => setActiveGroup(group.id)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Pills der aktuell aktiven Gruppe */}
              <div className="m-modes13-groups" role="listbox">
                {MODE_GROUPS.map((group) => {
                  if (group.id !== activeGroup) return null;

                  return (
                    <div
                      key={group.id}
                      className="m-modes13-group"
                      data-group={group.id}
                    >
                      {/* Gruppentitel entfällt – Tabs zeigen die Kategorie */}
                      <div className="m-modes13-group-modes">
                        {group.modes.map((id) => {
                          const mode = modes.find((m) => m.id === id);
                          if (!mode) return null;
                          const isActive = mode.id === active.id;
                          return (
                            <button
                              key={mode.id}
                              type="button"
                              className={
                                "m-modes13-pill" +
                                (isActive ? " m-modes13-pill--active" : "")
                              }
                              data-mode-pill={mode.id}
                              aria-pressed={isActive}
                              onClick={() => onSelect(mode.id)}
                            >
                              <span className="m-modes13-pill-name">
                                {mode.name}
                              </span>
                              <span className="m-modes13-pill-label">
                                {mode.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Beschreibung (Output) – Desktop unter den Pills, Mobile unter Figur durch Flow */}
            <article className="m-modes13-description" aria-live="polite">
              <h3 className="m-modes13-description-title">{active.name}</h3>
              <p className="m-modes13-description-label">{active.label}</p>
              <p className="m-modes13-description-body">
                {active.description}
              </p>
            </article>
          </div>

          {/* Rechte Spalte: Figur + Aura */}
          <div className="m-modes13-figure-shell">
            <div className="m-modes13-aura" aria-hidden="true">
              <div className="m-modes13-aura-layer m-modes13-aura-layer-1" />
              <div className="m-modes13-aura-layer m-modes13-aura-layer-2" />
              <div className="m-modes13-aura-layer m-modes13-aura-layer-3" />
            </div>
            <figure className="m-modes13-figure">
              <img
                src="/pictures/figure-da-vinci.png"
                alt="Human outline surrounded by an energy aura that reflects the active mode."
                loading="lazy"
              />
            </figure>
          </div>
        </div>

      </div>
    </section>
  );
}

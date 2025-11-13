"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

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
  | "peace";

type ModeMeta = {
  id: ModeId;
  colorVar: string;
  labelKey: string;
  descKey: string;
};

const MODES: ModeMeta[] = [
  {
    id: "onboarding",
    colorVar: "--mode-onboarding-color",
    labelKey: "modes.labels.onboarding",
    descKey: "modes.descriptions.onboarding",
  },
  {
    id: "research",
    colorVar: "--mode-research-color",
    labelKey: "modes.labels.research",
    descKey: "modes.descriptions.research",
  },
  {
    id: "council",
    colorVar: "--mode-council-color",
    labelKey: "modes.labels.council",
    descKey: "modes.descriptions.council",
  },
  {
    id: "calm",
    colorVar: "--mode-calm-color",
    labelKey: "modes.labels.calm",
    descKey: "modes.descriptions.calm",
  },
  {
    id: "play",
    colorVar: "--mode-play-color",
    labelKey: "modes.labels.play",
    descKey: "modes.descriptions.play",
  },
  {
    id: "oracle",
    colorVar: "--mode-oracle-color",
    labelKey: "modes.labels.oracle",
    descKey: "modes.descriptions.oracle",
  },
  {
    id: "joy",
    colorVar: "--mode-joy-color",
    labelKey: "modes.labels.joy",
    descKey: "modes.descriptions.joy",
  },
  {
    id: "vision",
    colorVar: "--mode-vision-color",
    labelKey: "modes.labels.vision",
    descKey: "modes.descriptions.vision",
  },
  {
    id: "empathy",
    colorVar: "--mode-empathy-color",
    labelKey: "modes.labels.empathy",
    descKey: "modes.descriptions.empathy",
  },
  {
    id: "love",
    colorVar: "--mode-love-color",
    labelKey: "modes.labels.love",
    descKey: "modes.descriptions.love",
  },
  {
    id: "wisdom",
    colorVar: "--mode-wisdom-color",
    labelKey: "modes.labels.wisdom",
    descKey: "modes.descriptions.wisdom",
  },
  {
    id: "truth",
    colorVar: "--mode-truth-color",
    labelKey: "modes.labels.truth",
    descKey: "modes.descriptions.truth",
  },
  {
    id: "peace",
    colorVar: "--mode-peace-color",
    labelKey: "modes.labels.peace",
    descKey: "modes.descriptions.peace",
  },
];

export default function Modis13() {
  const { t } = useLang();
  const [activeId, setActiveId] = useState<ModeId>("flow" as ModeId | "calm" as ModeId);

  // Fallback: falls "flow" nicht existiert, nimm "calm"
  const safeActiveId: ModeId = useMemo(() => {
    const hasActive = MODES.some((m) => m.id === activeId);
    if (hasActive) return activeId;
    // Standard: calm
    return "calm";
  }, [activeId]);

  const activeMode = useMemo(
    () => MODES.find((m) => m.id === safeActiveId) ?? MODES[0],
    [safeActiveId]
  );

  // CSS-Variable für die aktuelle Mode-Farbe
  const auraStyle = useMemo(
    () =>
      ({
        "--mode-active-color": `var(${activeMode.colorVar})`,
      } as React.CSSProperties),
    [activeMode.colorVar]
  );

  return (
    <div
      className="m-modes-root"
      data-mode={safeActiveId}
      style={auraStyle}
    >
      {/* FIGURE + AURA */}
      <div className="m-modes-figure-shell">
        <div className="m-modes-figure-aura" aria-hidden="true" />
        <div className="m-modes-figure">
          <img
            src="/pictures/figure-da-vinci.png"
            alt={t("modes.figure_alt") || "Human at the center of the modes field"}
            className="m-modes-figure-img"
            loading="lazy"
          />
        </div>
      </div>

      {/* SELECTOR + TEXT */}
      <div className="m-modes-panel">
        {/* Mode Selector */}
        <div
          className="m-modes-selector"
          role="tablist"
          aria-label={t("modes.selector_label") || "Modes"}
        >
          {MODES.map((mode) => {
            const isActive = mode.id === safeActiveId;
            const pillClass = [
              "m-modes-pill",
              isActive ? "m-modes-pill--active" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={pillClass}
                onClick={() => setActiveId(mode.id)}
              >
                <span
                  className="m-modes-pill-dot"
                  aria-hidden="true"
                />
                <span className="m-modes-pill-label">
                  {t(mode.labelKey)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mode Text */}
        <div className="m-modes-text" role="status">
          <p className="m-modes-text-title">
            {t(activeMode.labelKey)}
          </p>
          <p className="m-modes-text-body">
            {t(activeMode.descKey)}
          </p>
        </div>
      </div>
    </div>
  );
}

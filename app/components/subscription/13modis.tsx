"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useLang } from "@/app/providers/LanguageProvider";

const MODE_GROUPS = {
  core: ["onboarding", "flow", "build"],
  intellect: ["research", "truth", "wisdom"],
  creator: ["play", "vision", "oracle"],
  heart: ["empathy", "love", "joy"],
  spirit: ["calm", "peace", "council13"],
};

const GROUP_LABELS = {
  core: "Core",
  intellect: "Intellect",
  creator: "Creator",
  heart: "Heart",
  spirit: "Spirit",
};

export default function Modis13() {
  const { t } = useLang();

  const groups = MODE_GROUPS;
  const groupLabels = GROUP_LABELS;

  const [activeGroup, setActiveGroup] = useState<keyof typeof groups>("core");
  const [activeMode, setActiveMode] = useState("onboarding");

  const current = useMemo(() => {
    const title = t(`modes.labels.${activeMode}`);
    const desc = t(`modes.descriptions.${activeMode}`);
    return { title, desc };
  }, [activeMode, t]);

  return (
    <div className="relative mx-auto w-full max-w-[1200px]">
      {/* SECTION TITLE */}
      <header className="mb-10">
        <h2 className="text-[0.85rem] tracking-[0.22em] uppercase opacity-70">
          Modes · GPTM-Galaxy Core States
        </h2>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">
          Your operating modes
        </h1>
        <p className="mt-2 opacity-70 max-w-[600px]">
          Choose a mode to see how GPTM-Galaxy behaves — or let FLOW orchestrate them for you.
        </p>
      </header>

      {/* TABS */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
        {Object.keys(groups).map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group as any)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              activeGroup === group
                ? "bg-white/10 border-white text-white"
                : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
            }`}
          >
            {groupLabels[group as keyof typeof groupLabels]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* LEFT: MODE BUTTON GRID */}
        <div className="space-y-8">
          <h3 className="uppercase text-xs tracking-[0.2em] opacity-60">
            Choose a mode
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups[activeGroup].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`flex flex-col items-start px-4 py-3 rounded-xl border transition-all ${
                  activeMode === mode
                    ? "bg-white/10 border-white text-white scale-[1.02]"
                    : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
                }`}
              >
                <span className="text-xs tracking-[0.22em] uppercase">
                  {t(`modes.labels.${mode}`)}
                </span>
                <span className="text-sm opacity-80">
                  {t(`modes.hints.${mode}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: HUMAN + AURA */}
        <div className="relative w-full h-[480px] flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-[80px] opacity-60"
            style={{
              background: `var(--mode-${activeMode}-color)`,
              transition: "background var(--mode-aura-transition)",
            }}
          />
          <Image
            src="/pictures/figure-da-vinci.png"
            alt="Mode Figure"
            width={450}
            height={450}
            className="relative pointer-events-none select-none transition-opacity"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-16 max-w-[600px]">
        <div className="uppercase text-xs tracking-[0.25em] opacity-50 mb-2">
          {t(`modes.labels.${activeMode}`)}
        </div>
        <h3 className="text-xl font-semibold mb-3">{current.title}</h3>
        <p className="opacity-80 leading-relaxed">{current.desc}</p>
      </div>
    </div>
  );
}

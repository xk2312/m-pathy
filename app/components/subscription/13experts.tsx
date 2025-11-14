"use client";

import { useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

/**
 * 13Experts – Expertenauswahl
 * Abstände & Layout sind auf die Subscription-Page abgestimmt:
 * - Klarer Header-Rhythmus
 * - Dropdown dockt an Kategorien an
 * - Gleichmäßige Grid-Abstände
 * - Panel mit sauberem Vertikal-Rhythmus
 */

type ExpertId =
  | "biologist"
  | "chemist"
  | "molecular_scientist"
  | "physicist"
  | "electrical_engineer"
  | "computer_scientist"
  | "architect"
  | "landscape_designer"
  | "interior_designer"
  | "jurist"
  | "weather_expert"
  | "mathematician"
  | "astrologer";

export default function Experts13() {
  const { t } = useLang();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ExpertId | null>(null);

  // Gemeinsame Klasse für alle Expert-Pills
  const pillClass =
    "m-experts13-pill inline-flex items-center justify-between gap-2 " +
    "px-[7px] py-[7px] rounded-2xl bg-white/5 ring-1 ring-white/10 text-white/90 text-sm text-left " +
    "hover:bg-white/10 hover:ring-cyan-300/40 transition-all duration-200";

  // Zuordnung: Expert → Icon (Emoji als Platzhalter)
  const expertIcons: Record<ExpertId, string> = {
    biologist: "🧬",
    chemist: "⚗️",
    molecular_scientist: "🧪",
    physicist: "🪐",
    electrical_engineer: "⚡",
    computer_scientist: "💻",
    architect: "🏗️",
    landscape_designer: "🌿",
    interior_designer: "🏢",
    jurist: "⚖️",
    weather_expert: "🌦️",
    mathematician: "🔢",
    astrologer: "✨",
  };

  const currentIcon = selected ? expertIcons[selected] : undefined;

  const title = t("experts.title");
  const dropdownLabel = t("experts.dropdown.label");

  const callLabel = t("experts.cta.default");

  const handleCall = () => {
    if (!selected) return;
    const prefill = `Please take the role of a ${t(
      `experts.${selected}.name`
    )}. I need your expertise now.`;
    const url = `/subscription/page2?prefill=${encodeURIComponent(prefill)}`;
    window.location.href = url;
  };

  return (
    <section
      aria-label="13 experts section"
      className="m-experts13 pt-[clamp(40px,6vw,80px)] pb-[clamp(40px,6vw,80px)]"
    >
      {/* HEADER */}
      <div
        className="m-experts13-header text-center max-w-3xl mx-auto"
        style={{ marginBottom: "30px" }}
      >
        <h2 className="text-[clamp(34px,6vw,52px)] leading-[1.1] font-semibold tracking-tight text-white">
          {title}
        </h2>
      </div>

      {/* DROPDOWN TRIGGER */}
      <div
        className="m-experts13-dropdown flex justify-center"
        style={{ marginBottom: "13px" }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="m-experts13-trigger group relative inline-flex items-center justify-between 
          rounded-full
          bg-white/5 ring-1 ring-white/10 backdrop-blur-md
          transition-all duration-200
          hover:bg-white/10 hover:ring-cyan-300/40
          focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
          style={{ width: "min(90%, 720px)", padding: "13px 13px" }}
        >
          <span className="text-white/90 font-medium tracking-wide">
            {dropdownLabel}
          </span>

          <span className="text-white/60 group-hover:text-cyan-300 transition-colors">
            ▼
          </span>
        </button>
      </div>

      {/* CATEGORY GRID — erscheint erst wenn open */}
      {open && (
        <div className="m-experts13-categories max-w-5xl mx-auto grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* GROUP 1 – Life & Matter */}
          <div>
            <h3 className="text-white/60 text-sm mb-4">
              {t("experts.group.science")}
            </h3>
                        <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("biologist")}
                className={pillClass}
                style={{
                  padding:
                    "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
                }}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{expertIcons.biologist}</span>
                  <span>{t("experts.biologist.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>


              <button
                onClick={() => setSelected("chemist")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">{expertIcons.chemist}</span>
                  <span>{t("experts.chemist.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>

              <button
                onClick={() => setSelected("molecular_scientist")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">
                    {expertIcons.molecular_scientist}
                  </span>
                  <span>{t("experts.molecular_scientist.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>
            </div>
          </div>

          {/* GROUP 2 – Engineering & Code */}
          <div>
            <h3 className="text-white/60 text-sm mb-4">
              {t("experts.group.engineering")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("physicist")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">{expertIcons.physicist}</span>
                  <span>{t("experts.physicist.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>

              <button
                onClick={() => setSelected("electrical_engineer")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">
                    {expertIcons.electrical_engineer}
                  </span>
                  <span>{t("experts.electrical_engineer.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>

              <button
                onClick={() => setSelected("computer_scientist")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">
                    {expertIcons.computer_scientist}
                  </span>
                  <span>{t("experts.computer_scientist.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>
            </div>
          </div>

          {/* GROUP 3 – Space & Form */}
          <div>
            <h3 className="text-white/60 text-sm mb-4">
              {t("experts.group.design")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("architect")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">{expertIcons.architect}</span>
                  <span>{t("experts.architect.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>

              <button
                onClick={() => setSelected("landscape_designer")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">
                    {expertIcons.landscape_designer}
                  </span>
                  <span>{t("experts.landscape_designer.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>

              <button
                onClick={() => setSelected("interior_designer")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">
                    {expertIcons.interior_designer}
                  </span>
                  <span>{t("experts.interior_designer.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>
            </div>
          </div>

          {/* GROUP 4 – Law & Ethics */}
          <div>
            <h3 className="text-white/60 text-sm mb-4">
              {t("experts.group.law")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("jurist")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">{expertIcons.jurist}</span>
                  <span>{t("experts.jurist.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>
            </div>
          </div>

          {/* GROUP 5 – Earth & Weather */}
          <div>
            <h3 className="text-white/60 text-sm mb-4">
              {t("experts.group.earth")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("weather_expert")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">
                    {expertIcons.weather_expert}
                  </span>
                  <span>{t("experts.weather_expert.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>
            </div>
          </div>

          {/* GROUP 6 – Math & Stars */}
          <div>
            <h3 className="text-white/60 text-sm mb-4">
              {t("experts.group.meta")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("mathematician")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">
                    {expertIcons.mathematician}
                  </span>
                  <span>{t("experts.mathematician.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>

              <button
                onClick={() => setSelected("astrologer")}
                className={pillClass}
                style={{
  padding: "var(--experts-pill-pad-y) var(--experts-pill-pad-x)",
}}

              >
                <span className="flex items-center gap-2 ml-[7px]">
                  <span aria-hidden="true">{expertIcons.astrologer}</span>
                  <span>{t("experts.astrologer.name")}</span>
                </span>
                <span className="text-white/30 text-xs mr-[7px]">View</span>
              </button>
            </div>
          </div>
        </div>
      )}

       {/* EXPERT PANEL — erscheint erst wenn selected */}
      {selected && (
        <div
          className="m-experts13-panel max-w-4xl mx-auto bg-white/5 ring-1 ring-white/10 backdrop-blur-md rounded-3xl mt-10"
          style={{
            padding:
              "var(--experts-panel-pad-y, 13px) var(--experts-panel-pad-x, 13px)",
          }}
        >
          {/* Header: Icon + Name + Label nebeneinander */}
          <div className="flex items-start gap-4 mb-4">
            {currentIcon && (
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <span className="text-xl" aria-hidden="true">
                  {currentIcon}
                </span>
              </div>
            )}

            <div>
              <h3 className="text-[clamp(24px,4vw,34px)] font-semibold text-white mb-1">
                {t(`experts.${selected}.name`)}
              </h3>

              <p className="text-cyan-300/90 text-sm tracking-wide">
                {t(`experts.${selected}.label`)}
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-white/80 text-[clamp(14px,2vw,18px)] leading-relaxed mb-3">
            {t(`experts.${selected}.tagline`)}
          </p>

          {/* Description */}
          <p className="text-white/70 text-[clamp(14px,2vw,17px)] leading-relaxed mb-6">
            {t(`experts.${selected}.description`)}
          </p>

          {/* CTA BUTTON – Call this expert */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCall}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full 
              bg-white/5 ring-1 ring-white/10 backdrop-blur-md
              text-white/90 font-medium tracking-wide
              hover:bg-white/10 hover:ring-cyan-300/40
              transition-all duration-200"
            >
              {callLabel}
              <span className="text-cyan-300 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>
      )}

    </section>
  );
}

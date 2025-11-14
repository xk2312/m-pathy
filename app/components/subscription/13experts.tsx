"use client";

import { useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";
import { experts13 } from "@/lib/i18n.experts";

/**
 * 13Experts – Grundstruktur (leer)
 * -------------------------------
 * Diese Datei enthält:
 * 1. Header-Bereich (Title + Subtitle)
 * 2. Dropdown-Trigger ("Choose your Expert")
 * 3. Category-Grid (noch ohne Inhalte)
 * 4. Expert-Panel (wird dynamisch befüllt)
 *
 * Alle Texte kommen später über i18n (experts13).
 * Alle visuellen Klassen werden später ergänzt.
 */

export default function Experts13() {
  const { t, lang } = useLang();

  // Auswahlzustände
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  // Gemeinsame Klasse für alle Expert-Pills
  const pillClass =
    "m-experts13-pill inline-flex items-center justify-between gap-2 px-4 py-2 " +
    "rounded-2xl bg-white/5 ring-1 ring-white/10 text-white/90 text-sm text-left " +
    "hover:bg-white/10 hover:ring-cyan-300/40 transition-all duration-200";

  // Zuordnung: Expert → Icon (Emoji als Platzhalter)
  const expertIcons: Record<string, string> = {
    biologist: "🧬",
    chemist: "⚗️",
    physicist: "🪐",
    computer_scientist: "💻",
    jurist: "⚖️",
    architect: "🏗️",
    landscape_designer: "🌿",
    interior_designer: "🏢",
    electrical_engineer: "⚡",
    mathematician: "🔢",
    astrologer: "✨",
    weather_expert: "🌦️",
    molecular_scientist: "🧪",
  };

  const currentIcon = selected ? expertIcons[selected] : undefined;

  // Placeholder: flache Keys sind runtime verfügbar
  const title = t("experts.title");
  const subtitle = t("experts.subtitle");
  const dropdownLabel = t("experts.dropdown.label");


  return (
    <section
      aria-label="13 experts section"
      className="m-experts13 pt-[clamp(40px,6vw,90px)] pb-[clamp(40px,6vw,90px)]"
    >
      {/* HEADER */}
      <div className="m-experts13-header text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-[clamp(34px,6vw,60px)] leading-[1.1] font-semibold tracking-tight text-white">
          {title}
        </h2>

        <p className="text-white/80 text-[clamp(14px,2vw,18px)] leading-relaxed mt-4">
          {subtitle}
        </p>
      </div>

      {/* DROPDOWN TRIGGER */}
      <div className="m-experts13-dropdown flex justify-center mb-12">
        <button
          onClick={() => setOpen(!open)}
          className="m-experts13-trigger group relative inline-flex items-center justify-between 
          rounded-2xl px-6 py-4
          bg-white/5 ring-1 ring-white/10 backdrop-blur-md
          transition-all duration-200
          hover:bg-white/10 hover:ring-cyan-300/40
          focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
          style={{ width: "min(90%, 720px)" }}
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
        <div className="m-experts13-categories max-w-5xl mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-3 mb-16">

          {/* ─────────────────────────────────────────── */}
          {/* GROUP 1 – Life & Matter */}
          {/* ─────────────────────────────────────────── */}
          <div>
            <h3 className="text-white/60 text-sm mb-3">
              {t("experts.group.science")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("biologist")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{expertIcons["biologist"]}</span>
                  <span>{t("experts.biologist.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>

              <button
                onClick={() => setSelected("chemist")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{expertIcons["chemist"]}</span>
                  <span>{t("experts.chemist.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>

              <button
                onClick={() => setSelected("molecular_scientist")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">
                    {expertIcons["molecular_scientist"]}
                  </span>
                  <span>{t("experts.molecular_scientist.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────── */}
          {/* GROUP 2 – Engineering & Code */}
          {/* ─────────────────────────────────────────── */}
          <div>
            <h3 className="text-white/60 text-sm mb-3">
              {t("experts.group.engineering")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("physicist")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{expertIcons["physicist"]}</span>
                  <span>{t("experts.physicist.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>

              <button
                onClick={() => setSelected("electrical_engineer")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">
                    {expertIcons["electrical_engineer"]}
                  </span>
                  <span>{t("experts.electrical_engineer.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>

              <button
                onClick={() => setSelected("computer_scientist")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">
                    {expertIcons["computer_scientist"]}
                  </span>
                  <span>{t("experts.computer_scientist.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────── */}
          {/* GROUP 3 – Space & Form */}
          {/* ─────────────────────────────────────────── */}
          <div>
            <h3 className="text-white/60 text-sm mb-3">
              {t("experts.group.design")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("architect")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{expertIcons["architect"]}</span>
                  <span>{t("experts.architect.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>

              <button
                onClick={() => setSelected("landscape_designer")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">
                    {expertIcons["landscape_designer"]}
                  </span>
                  <span>{t("experts.landscape_designer.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>

              <button
                onClick={() => setSelected("interior_designer")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">
                    {expertIcons["interior_designer"]}
                  </span>
                  <span>{t("experts.interior_designer.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────── */}
          {/* GROUP 4 – Law & Ethics */}
          {/* ─────────────────────────────────────────── */}
          <div>
            <h3 className="text-white/60 text-sm mb-3">
              {t("experts.group.law")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("jurist")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{expertIcons["jurist"]}</span>
                  <span>{t("experts.jurist.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────── */}
          {/* GROUP 5 – Earth & Weather */}
          {/* ─────────────────────────────────────────── */}
          <div>
            <h3 className="text-white/60 text-sm mb-3">
              {t("experts.group.earth")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("weather_expert")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">
                    {expertIcons["weather_expert"]}
                  </span>
                  <span>{t("experts.weather_expert.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────── */}
          {/* GROUP 6 – Math & Stars */}
          {/* ─────────────────────────────────────────── */}
          <div>
            <h3 className="text-white/60 text-sm mb-3">
              {t("experts.group.meta")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelected("mathematician")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">
                    {expertIcons["mathematician"]}
                  </span>
                  <span>{t("experts.mathematician.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>

              <button
                onClick={() => setSelected("astrologer")}
                className={pillClass}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{expertIcons["astrologer"]}</span>
                  <span>{t("experts.astrologer.name")}</span>
                </span>
                <span className="text-white/30 text-xs">View</span>
              </button>
            </div>
          </div>
        </div>
      )}




      {/* EXPERT PANEL — erscheint erst wenn selected */}
      {selected && (
        <div className="m-experts13-panel max-w-4xl mx-auto bg-white/5 ring-1 ring-white/10 backdrop-blur-md rounded-3xl p-8 mt-10">

          {/* Icon */}
          {currentIcon && (
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <span className="text-xl" aria-hidden="true">
                {currentIcon}
              </span>
            </div>
          )}

          {/* Name + Label */}
          <h3 className="text-[clamp(24px,4vw,34px)] font-semibold text-white mb-2">
            {t(`experts.${selected}.name`)}
          </h3>


          <p className="text-cyan-300/90 text-sm tracking-wide mb-6">
            {t(`experts.${selected}.label`)}
          </p>

          {/* Tagline */}
          <p className="text-white/80 text-[clamp(14px,2vw,18px)] leading-relaxed mb-4">
            {t(`experts.${selected}.tagline`)}
          </p>

          {/* Description */}
          <p className="text-white/70 text-[clamp(14px,2vw,17px)] leading-relaxed mb-8">
            {t(`experts.${selected}.description`)}
          </p>

          {/* CTA BUTTON – "Jetzt rufen" */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                const text = `Please take the role of a ${t(
                  `experts.${selected}.name`
                )}. I need your expertise now.`;
                window.location.href = `/subscription/page2?prefill=${encodeURIComponent(text)}`;
              }}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl 
              bg-white/5 ring-1 ring-white/10 backdrop-blur-md
              text-white/90 font-medium tracking-wide
              hover:bg-white/10 hover:ring-cyan-300/40
              transition-all duration-200"
            >
              {t("experts.cta.default")}
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

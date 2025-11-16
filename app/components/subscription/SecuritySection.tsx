"use client";

import { useLang } from "@/app/providers/LanguageProvider";

export default function SecuritySection() {
  const { t } = useLang();

  return (
    <section
      aria-label="security"
      className="pt-[var(--h-space-a2-section)] pb-[var(--h-space-a2-section)]"
    >
      <div
        className="page-center"
        style={{ maxWidth: "calc(var(--page-inner-max) * 1.0)" }}
      >
        {/* KICKER */}
        <p className="text-white/40 tracking-widest text-xs mb-[var(--sec-gap-kicker-title)] font-medium">
          SECURITY BY DESIGN
        </p>

        {/* TITLE */}
        <h2 className="text-[clamp(32px,5vw,52px)] leading-[1.1] font-semibold tracking-tight text-white mb-[var(--sec-gap-title-intro)]">
          {t("security.title")}
        </h2>

        {/* INTRO */}
        <p className="text-white/70 text-[clamp(15px,2vw,18px)] leading-relaxed max-w-[700px] mb-[var(--sec-gap-intro-cards)]">
          {t("security.intro")}
        </p>

        {/* GRID */}
        <div
          className="grid"
          style={{
            gap: "var(--sec-card-grid-gap)",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {/* CARD 1 */}
          <div
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm"
            style={{
              padding: "var(--sec-card-pad-y) var(--sec-card-pad-x)",
            }}
          >
            <div className="mb-[var(--sec-card-gap-title-body)]">
              {/* ICON 1 */}
              <div className="opacity-[var(--sec-icon-opacity)]">
                {/* hier später SVG */}
              </div>
            </div>

            <h3 className="text-white font-semibold text-lg mb-[var(--sec-card-gap-title-body)]">
              {t("security.card1.title")}
            </h3>

            <p className="text-white/70 text-sm leading-relaxed mb-[var(--sec-card-gap-body-button)]">
              {t("security.card1.body")}
            </p>

            <button className="m-button-secondary">
              {t("security.card1.cta")}
            </button>
          </div>

          {/* CARD 2 */}
          <div
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm"
            style={{
              padding: "var(--sec-card-pad-y) var(--sec-card-pad-x)",
            }}
          >
            <div className="mb-[var(--sec-card-gap-title-body)]">
              <div className="opacity-[var(--sec-icon-opacity)]">{/* SVG */}</div>
            </div>

            <h3 className="text-white font-semibold text-lg mb-[var(--sec-card-gap-title-body)]">
              {t("security.card2.title")}
            </h3>

            <p className="text-white/70 text-sm leading-relaxed mb-[var(--sec-card-gap-body-button)]">
              {t("security.card2.body")}
            </p>

            <button className="m-button-secondary">
              {t("security.card2.cta")}
            </button>
          </div>

          {/* CARD 3 */}
          <div
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm"
            style={{
              padding: "var(--sec-card-pad-y) var(--sec-card-pad-x)",
            }}
          >
            <div className="mb-[var(--sec-card-gap-title-body)]">
              <div className="opacity-[var(--sec-icon-opacity)]">{/* SVG */}</div>
            </div>

            <h3 className="text-white font-semibold text-lg mb-[var(--sec-card-gap-title-body)]">
              {t("security.card3.title")}
            </h3>

            <p className="text-white/70 text-sm leading-relaxed mb-[var(--sec-card-gap-body-button)]">
              {t("security.card3.body")}
            </p>

            <button className="m-button-secondary">
              {t("security.card3.cta")}
            </button>
          </div>

          {/* CARD 4 */}
          <div
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm"
            style={{
              padding: "var(--sec-card-pad-y) var(--sec-card-pad-x)",
            }}
          >
            <div className="mb-[var(--sec-card-gap-title-body)]">
              <div className="opacity-[var(--sec-icon-opacity)]">{/* SVG */}</div>
            </div>

            <h3 className="text-white font-semibold text-lg mb-[var(--sec-card-gap-title-body)]">
              {t("security.card4.title")}
            </h3>

            <p className="text-white/70 text-sm leading-relaxed mb-[var(--sec-card-gap-body-button)]">
              {t("security.card4.body")}
            </p>

            <button className="m-button-secondary">
              {t("security.card4.cta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

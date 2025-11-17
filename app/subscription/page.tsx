"use client";

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";
import { modes15 } from "@/lib/i18n.modes";
import { experts13 } from "@/lib/i18n.experts";

import VoiaBloom from "@/app/components/VoiaBloom";
import Navigation from "@/app/components/navigation/navigation";
import Hero from "@/app/components/subscription/Hero";
import Testimonial from "@/app/components/subscription/testimonial";
import PowerPrompts from "@/app/components/subscription/powerprompts";
import Modis13 from "@/app/components/subscription/13modis";
import Experts13 from "@/app/components/subscription/13experts";
import Subscribe from "@/app/components/subscription/subscribe";
import SecuritySection from "@/app/components/subscription/SecuritySection";
// import CouncilOrbit from "@/app/components/subscription/CouncilOrbit";

// KPI Board (Client-only; Recharts braucht Browser)
const MPathyKpiBoard = dynamic(
  () => import("@/app/components/analytics/MPathyKpiBoard"),
  { ssr: false }
);

// ────────────────────────────────
// Locale-Erkennung + Dict-Flatten
// ────────────────────────────────

type LocaleKey = keyof typeof dict;

const detectLocale = (): LocaleKey => {
  if (typeof navigator !== "undefined") {
    const code = (navigator.language || "en").slice(0, 2).toLowerCase() as LocaleKey;
    if (code in dict) return code;
  }
  return "en";
};

const flattenI18n = (obj: any, prefix = ""): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const k in obj) {
    const v = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") {
      Object.assign(out, flattenI18n(v, key));
    } else {
      out[key] = String(v ?? "");
    }
  }
  return out;
};

export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => document.documentElement.classList.remove("enable-scroll");
  }, []);

  // 1) aktive Locale
  const locale = detectLocale();

  // 2) flache Sprach-Maps bilden (Subscription + 15 Modes + 13 Experts)
  const enFlat = useMemo(() => flattenI18n(dict.en), []);
  const enModesFlat = useMemo(() => flattenI18n(modes15.en ?? {}), []);
  const enExpertsFlat = useMemo(() => flattenI18n(experts13.en ?? {}), []);

  const locFlat = useMemo(
    () => flattenI18n(dict[locale as keyof typeof dict] ?? {}),
    [locale]
  );
  const locModesFlat = useMemo(
    () => flattenI18n((modes15 as any)[locale] ?? {}),
    [locale]
  );
  const locExpertsFlat = useMemo(
    () => flattenI18n((experts13 as any)[locale] ?? {}),
    [locale]
  );

  // 3) Provider bekommt das korrekte Shape: { en: {...}, [locale]: {...} }
  const providerDict = useMemo(
    () => ({
      en: { ...enFlat, ...enModesFlat, ...enExpertsFlat },
      [locale]: {
        ...enFlat,
        ...enModesFlat,
        ...enExpertsFlat,
        ...locFlat,
        ...locModesFlat,
        ...locExpertsFlat,
      },
    }),
    [enFlat, enModesFlat, enExpertsFlat, locFlat, locModesFlat, locExpertsFlat, locale]
  );
  return (
    <LanguageProvider dict={providerDict}>
      <VoiaBloom />
      <Navigation />

          <main
        id="content"
        role="main"
        className="relative isolate z-10 min-h-dvh bg-transparent text-white antialiased selection:bg-white/20"
      >
        <div
          className="subscription-root px-[clamp(10px,4vw,90px)] pb-[clamp(20px,5vw,90px)]"
        >

          {/* NAVIGATION BUFFER */}
          <div
            aria-hidden="true"
            style={{ height: "var(--nav-height-lg)" }}
          />

          {/* ─────────────── HERO ─────────────── */}
          <section className="pt-[72px] pb-[72px]">
            <div className="page-center">
              <Hero />

            </div>
          </section>

          {/* ─────────────── TESTIMONIAL SECTION ─────────────── */}
          <section
            className="pt-[clamp(80px,13vw,160px)] pb-[clamp(80px,13vw,160px)]"
            aria-label="Testimonials section"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.0)" }}
            >
              <Testimonial />
            </div>
          </section>

          {/* ─────────────── BUFFER & DIVIDER #1 (Hero → Testimonials → Experts) ─────────────── */}
          <div style={{ height: "var(--h-gap-md)" }} aria-hidden="true" />
          <section
            aria-hidden
            className="pt-[var(--sub-divider-gap-y)] pb-[var(--sub-divider-gap-y)]"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <div
                className="mx-auto rounded-full"
                style={{
                  height: "var(--sub-divider-1-height)",
                  background: "var(--sub-divider-1-fill)",
                  boxShadow: "var(--sub-divider-1-glow)",
                }}
              />
            </div>
          </section>
          <div style={{ height: "var(--h-gap-sm)" }} aria-hidden="true" />

          {/* ─────────────── 13 EXPERTS SECTION ─────────────── */}
          <section
            className="pt-[clamp(20px,4vw,40px)] pb-[clamp(20px,4vw,40px)]"
            aria-label="Experts section"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.0)" }}
            >
              <Experts13 />
            </div>
          </section>

          {/* ─────────────── BUFFER & DIVIDER #2 (Experts → Modes) ─────────────── */}
          <div style={{ height: "var(--h-gap-md)" }} aria-hidden="true" />
          <section
            aria-hidden
            className="pt-[var(--sub-divider-gap-y)] pb-[var(--sub-divider-gap-y)]"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <div
                className="mx-auto rounded-full"
                style={{
                  height: "var(--sub-divider-1-height)",
                  background: "var(--sub-divider-1-fill)",
                  boxShadow: "var(--sub-divider-1-glow)",
                }}
              />
            </div>
          </section>
          <div style={{ height: "var(--h-gap-sm)" }} aria-hidden="true" />

          {/* ─────────────── 13 MODES SECTION ─────────────── */}
          <section
            className="pt-[clamp(20px,4vw,40px)] pb-[clamp(20px,4vw,40px)]"
            aria-label="Modes section"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.0)" }}
            >
              <Modis13 />
            </div>
          </section>

          {/* ─────────────── BUFFER & DIVIDER #3 (Modes → PowerPrompts) ─────────────── */}
          <div style={{ height: "var(--h-gap-md)" }} aria-hidden="true" />
          <section
            aria-hidden
            className="pt-[var(--sub-divider-gap-y)] pb-[var(--sub-divider-gap-y)]"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <div
                className="mx-auto rounded-full"
                style={{
                  height: "var(--sub-divider-1-height)",
                  background: "var(--sub-divider-1-fill)",
                  boxShadow: "var(--sub-divider-1-glow)",
                }}
              />
            </div>
          </section>
          <div style={{ height: "var(--h-gap-sm)" }} aria-hidden="true" />

          {/* ─────────────── POWERPROMPTS SECTION ─────────────── */}
          <section
            className="pt-[var(--h-space-a2-section)] pb-[var(--h-space-a2-section)]"
            aria-label="PowerPrompts section"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <PowerPrompts />
            </div>
          </section>

          {/* ─────────────── BUFFER & DIVIDER #4 (PowerPrompts → Subscribe) ─────────────── */}
          <div style={{ height: "var(--h-gap-md)" }} aria-hidden="true" />
          <section
            aria-hidden
            className="pt-[var(--sub-divider-gap-y)] pb-[var(--sub-divider-gap-y)]"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <div
                className="mx-auto rounded-full"
                style={{
                  height: "var(--sub-divider-1-height)",
                  background: "var(--sub-divider-1-fill)",
                  boxShadow: "var(--sub-divider-1-glow)",
                }}
              />
            </div>
          </section>
          <div style={{ height: "var(--h-gap-sm)" }} aria-hidden="true" />

          {/* ─────────────── SUBSCRIBE SECTION (Offer) ─────────────── */}
          <Subscribe />

          {/* ─────────────── BUFFER & DIVIDER #5 (Subscribe → Security) ─────────────── */}
          <div style={{ height: "var(--h-gap-md)" }} aria-hidden="true" />
          <section
            aria-hidden
            className="pt-[var(--sub-divider-gap-y)] pb-[var(--sub-divider-gap-y)]"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <div
                className="mx-auto rounded-full"
                style={{
                  height: "var(--sub-divider-1-height)",
                  background: "var(--sub-divider-1-fill)",
                  boxShadow: "var(--sub-divider-1-glow)",
                }}
              />
            </div>
          </section>
          <div style={{ height: "var(--h-gap-sm)" }} aria-hidden="true" />

          {/* ─────────────── SECURITY BY DESIGN ─────────────── */}
          <SecuritySection />

          {/* ─────────────── BUFFER & DIVIDER #6 (Security → KPI) ─────────────── */}
          <div style={{ height: "var(--h-gap-md)" }} aria-hidden="true" />
          <section
            aria-hidden
            className="pt-[var(--sub-divider-gap-y)] pb-[var(--sub-divider-gap-y)]"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <div
                className="mx-auto rounded-full"
                style={{
                  height: "var(--sub-divider-1-height)",
                  background: "var(--sub-divider-1-fill)",
                  boxShadow: "var(--sub-divider-1-glow)",
                }}
              />
            </div>
          </section>
          <div style={{ height: "var(--h-gap-sm)" }} aria-hidden="true" />

          {/* ─────────────── KPI BOARD ─────────────── */}
          <section className="pt-[clamp(70px,12vw,130px)]">
            <div
              className="page-center kpi-scope"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <MPathyKpiBoard />
            </div>
          </section>

          {/* Abschluss-Buffer – 130px (KPI → Footer/Ende) */}
          <div style={{ height: "var(--h-gap-sm)" }} aria-hidden="true" />
        </div>
      </main>
    </LanguageProvider>
  );
}

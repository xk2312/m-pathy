"use client";

import { useEffect, useMemo } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";
import dynamic from "next/dynamic";

import VoiaBloom from "@/app/components/VoiaBloom";
import Hero from "@/app/components/subscription/Hero";
import CouncilOrbit from "@/app/components/subscription/CouncilOrbit";
import Testimonial from "@/app/components/subscription/testimonial"; // Klein, korrekt
import PowerPrompts from "@/app/components/subscription/powerprompts"; // neu
import Modis13 from "@/app/components/subscription/13modis"; // 13 Modi – neuer Abschnitt
import Experts13 from "@/app/components/subscription/13experts"; 
import { modes15 } from "@/lib/i18n.modes";
import { experts13 } from "@/lib/i18n.experts";


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
    if (v && typeof v === "object") Object.assign(out, flattenI18n(v, key));
    else out[key] = String(v ?? "");
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

  const enModesFlat = useMemo(
    () => flattenI18n(modes15.en ?? {}),
    []
  );

  const enExpertsFlat = useMemo(
    () => flattenI18n(experts13.en ?? {}),
    []
  );

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
      <main
        id="content"
        role="main"
        className="relative isolate z-10 min-h-dvh bg-transparent text-white antialiased selection:bg-white/20"
      >
        <div
          className="subscription-root px-[clamp(10px,4vw,90px)] pb-[clamp(20px,5vw,90px)]"
          style={{ paddingTop: "calc(var(--ry) * 1.5)" }}
        >
          {/* ─────────────── HERO ─────────────── */}
          <section className="pt-[72px] pb-[72px]">
            <div className="page-center">
              <Hero />
            </div>
          </section>

          {/* Buffer – unter Hero */}
          <div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />
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

          {/* Buffer #3 – unter Testimonial (Design-Token) */}
          <div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />
 {/* ———————— 13 EXPERTS SECTION ———————— */}
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

{/* Buffer — unter 13 Experts */}
<div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />
<div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />
          {/* ─────────────── COUNCIL ORBIT ─────────────── */}
          <section className="pt-[72px]">
            <div className="page-center">
              <CouncilOrbit />
            </div>
          </section>

          {/* Buffer #1 – zwischen CouncilOrbit und KPI (Design-Token) */}
          <div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />


          

          {/* ———————— 13 MODES SECTION ———————— */}
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


          {/* Buffer #5 – unter 13 Modes (Design-Token) */}
          <div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />

         

                {/* ─────────────── POWERPROMPTS SECTION ─────────────── */}
          <section
            className="pt-[clamp(80px,13vw,160px)] pb-[clamp(80px,13vw,160px)]"
            aria-label="PowerPrompts section"
          >
            <div
              className="page-center"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <PowerPrompts />
            </div>
          </section>

          {/* Buffer #4 – unter PowerPrompts (Design-Token) */}
          <div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />

  {/* ─────────────── KPI BOARD ─────────────── */}
          <section className="pt-[clamp(70px,12vw,130px)]">
            <div
              className="page-center kpi-scope"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
            >
              <MPathyKpiBoard />
            </div>
          </section>

          {/* Buffer #2 – unter dem KPI-Board (Design-Token) */}
          <div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />

        </div>
      </main>
    </LanguageProvider>
  );
}


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

{/* Interstitial #1 – Soft Line Divider */}
<section aria-hidden className="pt-[var(--sub-inter-gap-y)] pb-[var(--sub-inter-gap-y)]">
  <div
    className="page-center flex justify-center"
    style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
  >
    <div
      className="rounded-full"
      style={{
        width: "100%",
        maxWidth: "var(--sub-inter-line-max)",
        height: "var(--sub-inter-line-height)",
        background: "var(--sub-inter-line-color)",
        boxShadow: "var(--sub-inter-line-glow)",
      }}
    />
  </div>
</section>


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
          

   {/* Interstitial #2 – Label-Pill für nächste Sektion */}
<section aria-hidden className="pt-[var(--sub-inter-gap-y)] pb-[var(--sub-inter-gap-y)]">
  <div
    className="page-center flex justify-start"
    style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
  >
    <span
      className="inline-flex items-center border"
      style={{
        padding: "var(--sub-inter-pill-pad-y) var(--sub-inter-pill-pad-x)",
        borderRadius: "var(--sub-inter-pill-radius)",
        borderColor: "var(--sub-inter-pill-border)",
        background: "var(--sub-inter-pill-bg)",
        fontSize: "var(--sub-inter-pill-size)",
        letterSpacing: "var(--sub-inter-pill-letter)",
        textTransform: "var(--sub-inter-pill-transform)" as any,
        color: "var(--sub-inter-pill-text)",
      }}
    >
      Nächste Station · 13 Expert:innen
    </span>
  </div>
</section>


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
          <div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />

{/* ─────────────── COUNCIL ORBIT ─────────────── */}
{/*
<section className="pt-[72px]">
  <div className="page-center">
    <CouncilOrbit />
  </div>
</section>
*/}

{/* Interstitial #3 – Quote-Band */}
<section className="pt-[var(--sub-inter-gap-y)] pb-[var(--sub-inter-gap-y)]">
  <div
    className="page-center"
    style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
  >
    <div
      className="rounded-[24px]"
      style={{
        padding: "var(--sub-inter-quote-pad-y) var(--sub-inter-quote-pad-x)",
        background: "var(--sub-inter-quote-bg)",
        border: "var(--sub-inter-quote-border)",
        boxShadow: "var(--sub-inter-quote-glow)",
      }}
    >
      <p
        className="text-center"
        style={{
          fontSize: "var(--sub-inter-quote-size)",
          lineHeight: "var(--sub-inter-quote-line)",
          color: "var(--sub-inter-quote-text)",
        }}
      >
        „Jede Eingabe ist ein Startsignal – die Richtung bestimmst du.“
      </p>
    </div>
  </div>
</section>

                {/* ─────────────── POWERPROMPTS SECTION ─────────────── */}
         <section
  className="pt-[var(--h-space-a2-section)] pb-[var(--h-space-a2-section)]"
  aria-label="PowerPrompts section"
>
  <div
    className="page-center pp-scope"
    style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
  >
    <PowerPrompts />
  </div>
</section>


          {/* Buffer #4 – unter PowerPrompts (Design-Token) */}
          <div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />
          <div style={{ height: "var(--buffer-fluid)" }} aria-hidden="true" />
  
  {/* Interstitial #4 – Micro-Stats Strip */}
<section aria-hidden className="pt-[var(--sub-inter-gap-y)] pb-[var(--sub-inter-gap-y)]">
  <div
    className="page-center flex flex-wrap items-center"
    style={{
      maxWidth: "calc(var(--page-inner-max) * 1.31)",
      columnGap: "var(--sub-inter-meta-gap-x)",
      rowGap: "0.5rem",
    }}
  >
    {[
      "Sealed · Triketon-2048",
      "CausaTest 100 %",
      "Council13 · Audit abgeschlossen",
    ].map((label) => (
      <span
        key={label}
        className="inline-flex items-center border"
        style={{
          padding: "var(--sub-inter-pill-pad-y) var(--sub-inter-pill-pad-x)",
          borderRadius: "var(--sub-inter-pill-radius)",
          borderColor: "var(--sub-inter-pill-border)",
          background: "var(--sub-inter-pill-bg)",
          fontSize: "var(--sub-inter-meta-size)",
          letterSpacing: "var(--sub-inter-meta-letter)",
          textTransform: "var(--sub-inter-pill-transform)" as any,
          color: "var(--sub-inter-pill-text)",
          opacity: "var(--sub-inter-meta-opacity)",
        }}
      >
        {label}
      </span>
    ))}
  </div>
</section>


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


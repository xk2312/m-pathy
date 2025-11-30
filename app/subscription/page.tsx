"use client";
/*** =======================================================================
 *  INVENTUS INDEX — app/subscription/page.tsx
 *  Screening · Struktur · Sprach-Hotspots (Subscription-Seite)
 * ======================================================================= 
 *
 *  [ANCHOR:0]  IMPORTS (i18n · Provider · Module)
 *              – import { dict } from "@/lib/i18n"
 *              – import { LanguageProvider } from "@/app/providers/LanguageProvider"
 *              – import modes15 / experts13 (zusätzliche i18n-Module)
 *              → Subscription arbeitet mit EIGENEM i18n-System (dict),
 *                unabhängig vom Legacy-Chat-System (DICTS).
 *
 *  [ANCHOR:1]  DYNAMIC IMPORT (MPathyKpiBoard)
 *              – Client-only wegen Recharts
 *              – Neutral in Bezug auf Sprache
 *
 *  [ANCHOR:2]  detectLocale()
 *              – liest navigator.language → "de", "en", …
 *              – nutzt NUR dict (Subscription-i18n)
 *              – verwendet NICHT getLocale() aus lib/i18n
 *              → **Erste Sprachquelle** (Subscription-spezifisch)
 *              → **Drift-Hotspot #1**: Chat-Locale und Subscription-Locale
 *                können hier auseinanderlaufen.
 *
 *  [ANCHOR:3]  flattenI18n()
 *              – wandelt verschachtelte Subscription-i18n-Strukturen
 *                in flache Key-Maps um.
 *              – Reine Datenvorbereitung; kein Drift, aber doppelte i18n-Struktur.
 *
 *  [ANCHOR:4]  SubscriptionPage() – useEffect (enable-scroll)
 *              – Kein i18n, nur Layout.
 *
 *  [ANCHOR:5]  LOCALE (Subscription)
 *              const locale = detectLocale()
 *              – Zentrale Variable der Subscription-Seite
 *              – Hängt NICHT am LanguageSwitcher
 *              – Wird NICHT durch setLocale (lib/i18n) beeinflusst
 *              → **Drift-Hotspot #2**:
 *                Subscription zeigt nur die Sprache, die DER BROWSER liefert,
 *                NICHT die Sprache, die der User über den LanguageSwitcher wählt.
 *
 *  [ANCHOR:6]  FLATTENED DICTS (Subscription)
 *              enFlat, enModesFlat, enExpertsFlat
 *              locFlat, locModesFlat, locExpertsFlat
 *              – Flaches i18n-System ausschließlich für Subscription
 *              – Ist UNABHÄNGIG von DICTS (Chat)
 *
 *  [ANCHOR:7]  providerDict (useMemo)
 *              – Baut finale Subscription-i18n-Map:
 *                base = { en: {...}, [locale]: {...}, all others... }
 *              – Verwendet ausschließlich dict/modes15/experts13
 *              – Sprache basiert weiterhin auf detectLocale()
 *              – KEINE Kopplung zu getLocale() oder globalem Locale
 *              → **Drift-Hotspot #3**:
 *                LanguageSwitcher (setLang) ändert NUR Navigation,
 *                NICHT providerDict (da locale nicht von setLang stammt).
 *
 *  [ANCHOR:8]  LanguageProvider dict={providerDict}
 *              – Bindet Subscription an EIGENES i18n-System
 *              – Chat-Events (mpathy:i18n:change) oder setLocale()
 *                erreichen dieses System NICHT.
 *              → **Drift-Hotspot #4**:
 *                Subscription-Module (Hero, Testimonial, PowerPrompts usw.)
 *                folgen NICHT dem LanguageSwitcher.
 *
 *  [ANCHOR:9]  Navigation (oberhalb main)
 *              – Navigation selbst nutzt useLang() → LanguageProvider
 *              – Reagiert auf setLang() → funktioniert
 *              – Rest der Seite nutzt dict → Sprache bleibt die vom Browser
 *              → Erklärung, warum NUR die Navigation korrekt übersetzt.
 *
 *  [ANCHOR:10]  HERO / TESTIMONIAL / EXPERTS / MODES / POWERPROMPTS / SUBSCRIBE
 *              – All diese Komponenten ziehen ihre Texte über useLang().t()
 *                aus providerDict (Subscription-i18n)
 *              – Da providerDict → locale (detectLocale) → Browser,
 *                ändern diese Komponenten NICHT die Sprache,
 *                wenn der User im LanguageSwitcher klickt.
 *              → **Drift-Hotspot #5 (größter Fehler)**:
 *                UI bleibt EN, während Navigation übersetzt.
 *
 *  [ANCHOR:11]  FOOTER
 *              – Ebenfalls via providerDict → folgt detectLocale
 *              – Kein Einfluss durch setLocale()
 *
 * =======================================================================
 *  ERKENNBARER FEHLERZU­SAMMENHANG (Inventur, ohne Lösung)
 *
 *  1) Subscription übersetzt nur die Navigation:
 *     – Navigation nutzt setLang() → LanguageProvider
 *     – LanguageProvider nutzt NICHT detectLocale()
 *     – Rest der Seite nutzt providerDict → basiert auf detectLocale()
 *     → Zwei verschiedene Sprachquellen:
 *        (a) Navigation → setLang()
 *        (b) Subscription-UI → detectLocale()
 *
 *  2) Subscription reagiert NICHT auf globales setLocale():
 *     – global setLocale() (LanguageSwitcher) feuert mpathy:i18n:change
 *     – Subscription hört NICHT auf dieses Event
 *     – Subscription liest locale NIE aus getLocale()
 *
 *  3) providerDict hängt 100% an detectLocale()
 *     – Sprache bleibt EN, auch wenn User auf DE/FR/ES/… klickt
 *
 * ======================================================================= */

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict, getLocale } from "@/lib/i18n";
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
import Footer from "@/app/components/subscription/footer";

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

  // 1) aktive Locale – folgt dem zentralen Sprachkern
  const locale = (getLocale() as LocaleKey) || "en";

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

  // 3) Provider bekommt das korrekte Shape: alle 13 Sprachen mit EN-Master als Basis
  const providerDict = useMemo(() => {
    const base: Record<LocaleKey, Record<string, string>> = {
      en: { ...enFlat, ...enModesFlat, ...enExpertsFlat },
      [locale]: {
        ...enFlat,
        ...enModesFlat,
        ...enExpertsFlat,
        ...locFlat,
        ...locModesFlat,
        ...locExpertsFlat,
      },
    } as any;

    (Object.keys(dict) as LocaleKey[]).forEach((code) => {
      if (code === "en" || code === locale) return;

      const flat = flattenI18n(dict[code] ?? {});
      const modesFlat = flattenI18n((modes15 as any)[code] ?? {});
      const expertsFlat = flattenI18n((experts13 as any)[code] ?? {});

      base[code] = {
        ...enFlat,
        ...enModesFlat,
        ...enExpertsFlat,
        ...flat,
        ...modesFlat,
        ...expertsFlat,
      };
    });

    return base;
  }, [enFlat, enModesFlat, enExpertsFlat, locFlat, locModesFlat, locExpertsFlat, locale]);

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
    {/* SUPER BUFFER 210px */}
  <div
    aria-hidden="true"
    style={{ height: "var( --h-gap-md)" }}
  />

  {/* ─────────────── HERO ─────────────── */}
          <section className="pt-[96px] pb-[96px]">

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
        {/* ─────────────── FOOTER ─────────────── */}

        <Footer />

      </main>
    </LanguageProvider>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";
import dynamic from "next/dynamic";

import VoiaBloom from "@/app/components/VoiaBloom";
import Hero from "@/app/components/subscription/Hero";
import CouncilOrbit from "@/app/components/subscription/CouncilOrbit";

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

// ────────────────────────────────
// Page-Komponente
// ────────────────────────────────
export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => document.documentElement.classList.remove("enable-scroll");
  }, []);

  // Aktive Locale ermitteln + flatten
  const locale = detectLocale();
  const flatDict = useMemo(() => flattenI18n(dict[locale]), [locale]);

 const providerDict = useMemo(() => ({ subscription: flatDict }), [flatDict]);

  return (
    <LanguageProvider dict={providerDict}>
      <VoiaBloom />

      <main
        id="content"
        role="main"
        className="relative isolate z-10 min-h-dvh bg-transparent text-white antialiased selection:bg-white/20"
      >
        {/* Eltern steuern Außenabstände.
            Top-Abstand hart per calc(var(--ry) * 1.5) → 96px bei --ry=64px */}
        <div
          className="subscription-root
                     px-[clamp(10px,4vw,90px)]
                     pb-[clamp(20px,5vw,90px)]"
          style={{ paddingTop: "calc(var(--ry) * 1.5)" }}
        >
          {/* SECTION: HERO – zentral über page-center */}
          <section className="pt-[72px] pb-[72px]">
            <div className="page-center">
              <Hero />
            </div>
          </section>

          {/* SECTION: COUNCIL – zentral über page-center */}
          <section className="pt-[72px]">
            <div className="page-center">
              <CouncilOrbit />
            </div>
          </section>

          {/* SECTION: KPI – vertikaler Abstand 70–130px (responsive) */}
          <section className="pt-[clamp(70px,12vw,130px)]">
            <div
              className="page-center kpi-scope"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.2)" }}
            >
              <MPathyKpiBoard />
            </div>
          </section>

          {/* Weitere Sections folgen im selben Muster */}
        </div>
      </main>
    </LanguageProvider>
  );
}

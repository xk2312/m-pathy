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

// ------------------------------
// Locale-Detection & Flatten
// ------------------------------
type LocaleKey = keyof typeof dict;

/** sehr robuste Locale-Erkennung (SSR-safe) */
function detectLocale(): LocaleKey {
  try {
    // 1) <html lang="..">
    if (typeof document !== "undefined") {
      const lang = document.documentElement?.lang?.toLowerCase();
      if (lang) {
        const base = lang.split("-")[0] as LocaleKey;
        if (base in dict) return base;
      }
    }
    // 2) navigator.language
    if (typeof navigator !== "undefined") {
      const base = (navigator.language || "en").slice(0, 2).toLowerCase() as LocaleKey;
      if (base in dict) return base;
    }
  } catch { /* noop */ }
  return "en";
}

/** verschachtelte Objekte -> flache Map: "a.b.c": "…" */
function flattenI18n(obj: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  if (!obj || typeof obj !== "object") return out;
  for (const k of Object.keys(obj as Record<string, unknown>)) {
    const v = (obj as Record<string, unknown>)[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") {
      Object.assign(out, flattenI18n(v, key));
    } else {
      out[key] = String(v ?? "");
    }
  }
  return out;
}

export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => document.documentElement.classList.remove("enable-scroll");
  }, []);

  // aktive Locale + flaches Wörterbuch
  const locale = detectLocale();
  const flat = useMemo(() => {
    // EN als Basis, aktive Sprache darüber – garantiert vollständige Keys
    const base = flattenI18n(dict.en);
    const loc  = flattenI18n(dict[locale]);
    return { ...base, ...loc };
  }, [locale]);

  // Provider erwartet: Record<namespace, Record<string,string>>
  const providerDict = useMemo(() => ({ common: flat }), [flat]);

  return (
    <LanguageProvider dict={providerDict}>
      <VoiaBloom />

      <main
        id="content"
        role="main"
        className="relative isolate z-10 min-h-dvh bg-transparent text-white antialiased selection:bg-white/20"
      >
        <div
          className="mx-auto w-full max-w-[1280px]
                     px-[clamp(10px,4vw,90px)]
                     pb-[clamp(20px,5vw,90px)]"
          style={{ paddingTop: "calc(var(--ry) * 1.5)" }}
        >
          {/* SECTION: HERO */}
          <section className="pt-[72px] pb-[72px]">
            <div className="page-center">
              <Hero />
            </div>
          </section>

          {/* SECTION: COUNCIL */}
          <section className="pt-[72px]">
            <div className="page-center">
              <CouncilOrbit />
            </div>
          </section>

          {/* SECTION: KPI */}
          <section className="pt-[clamp(70px,12vw,130px)]">
            <div
              className="page-center kpi-scope"
              style={{ maxWidth: "calc(var(--page-inner-max) * 1.2)" }}
            >
              <MPathyKpiBoard />
            </div>
          </section>
        </div>
      </main>
    </LanguageProvider>
  );
}

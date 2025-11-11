"use client";

import { useEffect, useMemo } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";
import * as i18nLib from "@/lib/i18n"; // <- für t()-Shim
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

export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => document.documentElement.classList.remove("enable-scroll");
  }, []);

  // 1) aktive Locale
  const locale = detectLocale();

  // 2) EN als Fallback + Locale darüber mergen → immer vollständige Map (flat)
  const flatDict = useMemo(() => {
    const enFlat = flattenI18n(dict.en);
    const locFlat = flattenI18n(dict[locale]);
    return { ...enFlat, ...locFlat };
  }, [locale]);

  // 3) Provider: ein Namespace "common" (harmlos für KPI-Board)
  const providerDict = useMemo(() => ({ common: flatDict }), [flatDict]);

  // 4) t()-Shim: Hero ruft altes t() → wir erweitern es lokal um unsere flatDict-Lookups
  useEffect(() => {
    const lib = i18nLib as any;
    if (typeof lib.t !== "function") return;
    const originalT = lib.t;
    lib.t = (key: string) => {
      const v = flatDict[key] ?? flatDict[`common.${key}`];
      return typeof v === "string" && v ? v : originalT(key);
    };
    return () => { lib.t = originalT; };
  }, [flatDict]);

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
          <section className="pt-[72px] pb-[72px]">
            <div className="page-center">
              <Hero />
            </div>
          </section>

          <section className="pt-[72px]">
            <div className="page-center">
              <CouncilOrbit />
            </div>
          </section>

          <section className="pt-[clamp(70px,12vw,130px)]">
            <div className="page-center kpi-scope" style={{ maxWidth: "calc(var(--page-inner-max) * 1.2)" }}>
              <MPathyKpiBoard />
            </div>
          </section>
        </div>
      </main>
    </LanguageProvider>
  );
}

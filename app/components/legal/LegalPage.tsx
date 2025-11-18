// app/components/legal/LegalPage.tsx
"use client";

import { useEffect, useMemo } from "react";
import { LanguageProvider, useLang } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";
import { legalDict, LegalPageKey } from "@/lib/i18n.legal";
import Navigation from "@/app/components/navigation/navigation";
import Footer from "@/app/components/subscription/footer";

// Hilfsfunktion: verschachtelte Objekte in flache Key/Value-Maps wandeln
function flatten(obj: any, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(out, flatten(value, fullKey));
    } else if (value != null) {
      out[fullKey] = String(value);
    }
  }
  return out;
}

// Provider-Dict: Basis-UI (dict) + Legal-Texte (legalDict) pro Sprache
const legalProviderDict = (() => {
  const result: Record<string, Record<string, string>> = {};

  const languages = Object.keys(dict);
  for (const lang of languages) {
    const base = flatten((dict as any)[lang] ?? dict.en);
    const legalLocale = legalDict[lang] ?? legalDict.en;

    // Legal-Keys unter "legal.<page>.*"
    const legalFlat: Record<string, string> = {};
    for (const pageKey of Object.keys(legalLocale) as LegalPageKey[]) {
      const page = legalLocale[pageKey];
      legalFlat[`legal.${pageKey}.title`] = page.title;
      legalFlat[`legal.${pageKey}.intro`] = page.intro;
      legalFlat[`legal.${pageKey}.last_updated`] = page.last_updated;
      legalFlat[`legal.${pageKey}.disclaimer`] = page.disclaimer;
      page.sections.forEach((section) => {
        legalFlat[`legal.${pageKey}.sections.${section.id}.heading`] =
          section.heading;
        legalFlat[`legal.${pageKey}.sections.${section.id}.body`] =
          section.body;
      });
    }

    result[lang] = {
      ...base,
      ...legalFlat,
    };
  }

  return result;
})();

function LegalContent({ pageKey }: { pageKey: LegalPageKey }) {
  const { lang, t } = useLang();
  const locale = legalDict[lang] ?? legalDict.en;
  const page = locale[pageKey];

  const sections = page.sections;

  return (
    <main className="relative isolate z-10 min-h-dvh bg-transparent text-white antialiased selection:bg-white/20">
      <div className="page-center px-[clamp(10px,4vw,90px)] pb-[clamp(40px,6vw,90px)]">
        {/* SUPER BUFFER – 618px über Buffer-Magazin */}
        <div aria-hidden style={{ height: "var(--h-gap-3xl)" }} />

        {/* Titelblock */}
        <header className="max-w-3xl space-y-4 mb-[clamp(32px,4vw,48px)]">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/55">
            {t("nav.links.legal") || "Legal"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {page.title}
          </h1>
          <p className="text-sm text-white/60 max-w-2xl whitespace-pre-line">
            {page.intro}
          </p>
          <p className="text-xs text-white/45">{page.last_updated}</p>
        </header>

        {/* Inhalt */}
        <div className="max-w-4xl space-y-10 text-[15px] leading-relaxed text-white/80">
          {sections.map((section) => (
            <section key={section.id} className="space-y-2">
              <h2 className="text-base font-semibold text-white">
                {section.heading}
              </h2>
              <p className="whitespace-pre-line">{section.body}</p>
            </section>
          ))}

          <section className="mt-6 border-t border-white/10 pt-4 text-xs text-white/50">
            {page.disclaimer}
          </section>
        </div>
      </div>
    </main>
  );
}

/**
 * LegalPageShell
 * - kapselt LanguageProvider + Navigation + Footer
 * - pageKey bestimmt, welcher Legal-Content geladen wird
 * - aktiviert enable-scroll, damit die Seite scrollen kann
 */
export function LegalPageShell({ pageKey }: { pageKey: LegalPageKey }) {
  // Scroll-Lock aufheben (wie bei /subscription)
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => {
      document.documentElement.classList.remove("enable-scroll");
    };
  }, []);

  const dictForProvider = useMemo(() => legalProviderDict, []);

  return (
    <LanguageProvider dict={dictForProvider}>
      <Navigation />
      <LegalContent pageKey={pageKey} />
      <Footer />
    </LanguageProvider>
  );
}

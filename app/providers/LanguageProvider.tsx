"use client";

/*** =======================================================================
 *  INVENTUS INDEX — app/providers/LanguageProvider.tsx
 *  Screening · Struktur · Sprach-Hotspots (Subscription/Navigation)
 * ======================================================================= 
 *
 *  [ANCHOR:0]  IMPORTS & BASIS
 *              – React, createContext, useContext, useEffect, useMemo, useState
 *              – Kein direkter Import aus lib/i18n.ts
 *              → LanguageProvider bildet ein EIGENES Sprachsystem,
 *                unabhängig vom globalen Chat-i18n (DICTS/setLocale).
 *
 *  [ANCHOR:1]  Dict-Typ (Subscription-Dict)
 *              type Dict = Record<string, Record<string, string>>;
 *              – Struktur: dict[lang][key] → string
 *              – Wird von Subscription/Navigation als Datenquelle genutzt
 *              – Unterschiedlich zu Dict in lib/i18n.ts (Legacy-Chat).
 *
 *  [ANCHOR:2]  langHint(lang)
 *              – Mappt Sprachcode → Prompt-Hinweistext (z. B. 
 *                "Bitte antworte auf Deutsch.")
 *              – Nutzt base = lang.slice(0,2) (en, de, fr, …)
 *              – Liefert Hint, der z. B. im Prompt oder Systemnachrichten
 *                als Steuerstring verwendet werden kann.
 *              → Sprach-Hotspot: Hier wird KI-Antwortsprache bewusst beeinflusst.
 *
 *  [ANCHOR:3]  SUP & Lang-Typ
 *              const SUP = ["en","de","fr","es","it","pt","nl","ru","zh","ja","ko","ar","hi"]
 *              export type Lang = (typeof SUP)[number];
 *              – Kanon aller unterstützten Sprachen in diesem Provider
 *              – Muss mit Subscription-dict & Navigation & DICTS harmonieren,
 *                ist aber hier autark definiert.
 *
 *  [ANCHOR:4]  LanguageCtx (Context)
 *              – Struktur:
 *                  { lang, t, hint, setLang }
 *              – Default:
 *                  lang: "en"
 *                  t: (k) => k
 *                  hint: "[Please answer in English.]"
 *                  setLang: () => {}
 *              → Wird verwendet, wenn kein Provider im Tree ist:
 *                – Navigation/Components können dann scheinbar "EN-locked"
 *                  wirken, weil lang="en" und t(k)=k.
 *
 *  [ANCHOR:5]  LanguageProvider(props)
 *              – Props:
 *                  dict: Dict (z. B. Subscription-i18n),
 *                  children: ReactNode
 *              – Lokaler State:
 *                  const [lang, setLangState] = useState<Lang>("en");
 *              → Dieser State ist die einzige Quelle für useLang().lang
 *                in der Subscription-/Navigation-Welt.
 *
 *  [ANCHOR:6]  applyLang(next)
 *              – Zentrale Funktion:
 *                  · base = next.slice(0,2).toLowerCase()
 *                  · safe = SUP.includes(base) ? base : "en"
 *                  · setLangState(safe)
 *                  · document.documentElement.lang = safe
 *                  · document.documentElement.dir = (safe === "ar" ? "rtl" : "ltr")
 *                  · localStorage.setItem("langLast", safe)
 *                  · localStorage.setItem("langHint", langHint(safe))
 *                  · document.cookie = "lang=safe"
 *              → Sprach-Hotspots:
 *                1) Setzt <html lang> und dir unabhängig vom globalen Chat-i18n.
 *                2) Persistiert Sprache separat in localStorage ("langLast") und
 *                   Cookie ("lang"), unabhängig von "mpathy:locale".
 *                3) Kann mit lib/i18n.setLocale() kollidieren (zwei Quellen,
 *                   die <html lang> schreiben).
 *
 *  [ANCHOR:7]  setLang(next: Lang)
 *              – Thin wrapper: ruft applyLang(next)
 *              – Wird von Navigation/LanguageSwitcher benutzt,
 *                um die Subscription-/Navigation-Sprache umzustellen.
 *              → Wichtiger Knoten:
 *                – Steuert NICHT automatisch lib/i18n.setLocale()
 *                – Ohne zusätzliche Koppelung bleibt Chat-Locale unberührt.
 *
 *  [ANCHOR:8]  Initial-Boot useEffect()
 *              – Reihenfolge zur Bestimmung der Startsprache:
 *                  1) localStorage.getItem("langLast")
 *                  2) Cookie "lang"
 *                  3) navigator.language.slice(0,2)
 *                  → applyLang(initial || "en")
 *              – Setzt damit:
 *                  · lang-State
 *                  · <html lang> und dir
 *                  · localStorage/langHint/cookie
 *              → Sprach-Hotspots:
 *                – Dieser Boot-Flow ist unabhängig vom globalen
 *                  detectInitialLocale()/getLocale() in lib/i18n.ts.
 *                – Subscription-/Navigation-Welt kann nach einem Refresh
 *                  eine andere Sprache nutzen als das Chat-System.
 *
 *  [ANCHOR:9]  t-Funktion (useMemo)
 *              – t = (k) => dict[lang]?.[k] ?? dict.en?.[k] ?? k
 *              – Reiner Lookup im Provider-dict
 *              – Fallback: en, dann key selbst.
 *              → Sprach-Hotspot:
 *                – Subscription/Navigation-Texte folgen NUR diesem dict,
 *                  nicht DICTS (Legacy-Chat).
 *                – Wenn dict[lang] unvollständig ist, landen wir bei EN.
 *
 *  [ANCHOR:10]  Context-Value (useMemo)
 *              – value = { lang, t, hint: langHint(lang), setLang }
 *              – hint wird dynamisch aus aktueller Sprache generiert
 *              – Exportiert an alle useLang()-Konsumenten.
 *
 *  [ANCHOR:11]  useLang()
 *              – Einfacher Hook, der LanguageCtx liest
 *              – Quelle für Sprache/Texte in:
 *                  · Navigation
 *                  · Subscription-Hero
 *                  · KPI-Board
 *                  · Testimonials
 *                  · PowerPrompts
 *                  · weitere Subscription-Module
 *
 * =======================================================================
 *  ERKENNBARER FEHLERZU­SAMMENHANG (Inventur, keine Lösung)
 *
 *  1) Getrennte Sprachsysteme:
 *     – LanguageProvider verwaltet Sprache via "langLast"/"lang"/<html lang>.
 *     – lib/i18n.ts verwaltet Sprache via "mpathy:locale"/currentLocale/
 *       setLocale()/Events.
 *     – Es gibt KEINE direkte Kopplung zwischen setLang() und setLocale().
 *
 *  2) EN-Lock im Chat:
 *     – Wenn Chat-Seite nicht im LanguageProvider-Tree hängt, sehen
 *       useLang()-Konsumenten Default lang="en" und t(k)=k.
 *     – Navigation auf der Chat-Seite kann EN-locked wirken,
 *       obwohl globales Locale evtl. etwas anderes ist.
 *
 *  3) Subscription-seitiger Drift:
 *     – Subscription-UI (Hero/Testimonial/etc.) nutzt t() aus diesem Provider.
 *     – providerDict in Subscription-Seite basiert zusätzlich auf einem
 *       eigenen detectLocale() (navigator.language).
 *     – LanguageSwitcher (setLang) und Subscription-Initial-Locale können
 *       auseinanderdriften.
 *
 * ======================================================================= */


import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Dict = Record<string, Record<string, string>>;

export function langHint(lang: string): string {
  const base = (lang || "en").slice(0, 2).toLowerCase();
  const map: Record<string, string> = {
    en: "Please answer in English.",
    de: "Bitte antworte auf Deutsch.",
    fr: "Veuillez répondre en français.",
    es: "Por favor, responde en español.",
    it: "Per favore rispondi in italiano.",
    pt: "Por favor, responda em português.",
    nl: "Antwoord alstublieft in het Nederlands.",
    ru: "Пожалуйста, ответьте по-русски.",
    zh: "请用中文回答。",
    ja: "日本語で答えてください。",
    ko: "한국어로 대답해 주세요.",
    ar: "من فضلك أجب بالعربية.",
    hi: "कृपया हिंदी में उत्तर दें。",
  };
  return `[${map[base] ?? map.en}]`;
}

const SUP = [
  "en",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "nl",
  "ru",
  "zh",
  "ja",
  "ko",
  "ar",
  "hi",
] as const;
export type Lang = (typeof SUP)[number];

const LanguageCtx = createContext<{
  lang: Lang;
  t: (k: string) => string;
  hint: string;
  setLang: (l: Lang) => void;
}>({
  lang: "en",
  t: (k) => k,
  hint: "[Please answer in English.]",
  setLang: () => {},
});

export function LanguageProvider({
  dict,
  children,
}: {
  dict: Dict;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>("en");

  // zentrale Apply-Funktion: State + HTML + Hint + Persistenz
  const applyLang = (next: string) => {
    const base = (next || "en").slice(0, 2).toLowerCase();
    const safe = (SUP as readonly string[]).includes(base as Lang)
      ? (base as Lang)
      : "en";

    setLangState(safe);

    // HTML-Attribute (A11y + RTL)
    document.documentElement.lang = safe;
    document.documentElement.dir = safe === "ar" ? "rtl" : "ltr";

    // Persistenz: letzte Sprache + Hint + Cookie
    try {
      localStorage.setItem("langLast", safe);
      localStorage.setItem("langHint", langHint(safe));
    } catch {
      // ignore storage errors (SSR/Safari private mode etc.)
    }

    document.cookie = `lang=${safe}; path=/; max-age=31536000`;
  };

  // öffentliches setLang (nur typisiert durchreichen)
  const setLang = (next: Lang) => {
    applyLang(next);
  };

  // Initial-Boot: zuerst localStorage, dann Cookie, dann Browser-Sprache
  useEffect(() => {
    let initial: string | null = null;

    try {
      const stored = localStorage.getItem("langLast");
      if (stored) initial = stored;
    } catch {
      // ignore
    }

    if (!initial) {
      const cookie = document.cookie
        .split("; ")
        .find((s) => s.startsWith("lang="))
        ?.split("=")[1];
      if (cookie) initial = cookie;
    }

    if (!initial) {
      const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
      initial = nav;
    }

    applyLang(initial || "en");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = useMemo(() => {
    return (k: string) => dict[lang]?.[k] ?? dict.en?.[k] ?? k;
  }, [lang, dict]);

  const value = useMemo(
    () => ({ lang, t, hint: langHint(lang), setLang }),
    [lang, t]
  );

  return (
    <LanguageCtx.Provider value={value}>
      {children}
    </LanguageCtx.Provider>
  );
}

export function useLang() {
  return useContext(LanguageCtx);
}

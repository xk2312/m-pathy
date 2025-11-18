"use client";
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

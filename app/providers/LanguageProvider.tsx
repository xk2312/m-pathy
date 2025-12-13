/*** =======================================================================
 *  INVENTUS INDEX — app/components/AccountPanel.tsx
 *  Account-Overlay · Status / E-Mail / Token-Stand (Read-Only View)
 * =======================================================================
 *
 *  [ANCHOR:0] IMPORTS & BASIS
 *    – React-Client-Component mit useLang() + i18n.accountpanel.
 *    – Keine eigenen Fetches; alle Daten kommen via Props vom Parent.
 *
 *  [ANCHOR:1] PROPS (AccountPanelProps)
 *    – open: Sichtbarkeit des Overlays.
 *    – email: User-E-Mail oder null (Gast/Unknown).
 *    – balance: numerischer Token-Stand oder null (nicht geladen / Fehler).
 *    – onClose, onLogout, isMobile: reine UI-/Control-Parameter.
 *
 *  [ANCHOR:2] LANGUAGE-BINDING
 *    – useLang() + accountDict[lang] → tAccount.* Texte.
 *    – Steuert Labels für Status, Tokens, Loading, FreeGate-Hinweis.
 *
 *  [ANCHOR:3] ESC & FOKUS
 *    – ESC schließt Panel per onClose().
 *    – Fokus wird beim Öffnen auf das Panel gesetzt (A11y / UX).
 *
 *  [ANCHOR:4] LABEL-BILDUNG (TOKEN HOTSPOT)
 *    – emailLabel: E-Mail oder tAccount.email.unknown, falls leer/null.
 *    – balanceLabel:
 *        · Wenn typeof balance === "number" && Number.isFinite(balance):
 *            → balance.toLocaleString("de-DE").
 *        · Sonst: tAccount.tokens.loading (z. B. „… lädt“).
 *    – 0 Tokens sind gültig und werden als "0" angezeigt.
 *    – Jeder nicht-numerische Zustand (null/NaN/undefined) führt zu
 *      permanentem Loading-Text – sichtbar bei fehlgeschlagenem Ledger-Read.
 *
 *  [ANCHOR:5] CONTENT-BLOCKS
 *    – Status-Block: tAccount.status.label + tAccount.status.loggedIn.
 *    – Token-Block: tAccount.tokens.label + balanceLabel.
 *    – Info-Block: tAccount.info.freegate (statischer FreeGate-Hinweis).
 *    – Footer: Logout-Button (tAccount.button.logout).
 *
 *  [ANCHOR:6] LAYOUT
 *    – Backdrop (fixed, halbtransparent, zIndex 999).
 *    – Panel-Layout:
 *        · Desktop: rechts oben, feste Breite, border/shadow per CSS-Token.
 *        · Mobile: Bottom-Sheet, 75vh, scrollfähig.
 *
 *  TOKEN-RELEVANZ (SUMMARY)
 *    – AccountPanel.tsx ist reine Anzeige für den Token-Stand.
 *    – Zeigt Zahlen nur, wenn der Parent eine gültige number für balance
 *      liefert; andernfalls bleibt der UI-State im Loading-Label.
 *    – Der aktuell beobachtete „… lädt“-Effekt deutet darauf hin, dass
 *      /api/me/balance entweder null/NaN zurückliefert oder im Fehlerpfad
 *      landet, obwohl der Kauf via Stripe/Webhook korrekt durchläuft.
 *
 *  INVENTUS NOTE
 *    – Reine Inventur & Sichtbarmachung: Dieses Component verhält sich
 *      deterministisch, der Kern-Konflikt liegt im Zusammenspiel von
 *      User-Identität ↔ Ledger ↔ Balance-API, nicht im Rendering selbst.
 * ======================================================================= */

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getLocale, setLocale } from "@/lib/i18n";

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

  // zentrale Apply-Funktion: State + Spiegel (dir/Hints/Cookies)
   const applyLang = (next: string) => {
    const base = (next || "en").slice(0, 2).toLowerCase();
    const safe = (SUP as readonly string[]).includes(base as Lang)
      ? (base as Lang)
      : "en";

    setLangState(safe);

    // HTML-Attribute (A11y + RTL) – lang selbst kommt aus dem zentralen Kern
    document.documentElement.dir = safe === "ar" ? "rtl" : "ltr";

    // Persistenz: letzte Sprache + Hint + Cookie (nur Spiegel, keine Quelle)
    try {
      localStorage.setItem("langLast", safe);
      localStorage.setItem("langHint", langHint(safe));
    } catch {
      // ignore storage errors (SSR/Safari private mode etc.)
    }

document.cookie = `lang=${safe}; path=/; max-age=31536000`;
document.cookie = `NEXT_LOCALE=${safe}; path=/; max-age=31536000; SameSite=Lax`;
  };


  // öffentliches setLang – koppelt Kern + Provider + UI
  const setLang = (next: Lang) => {
    // 1) globaler Kern (mpathy:locale + <html lang> + Events)
    setLocale(next);
    // 2) lokale Spiegelung im Provider (Context + dir + Hints + Cookie)
    applyLang(next);
  };


  // Initial-Boot & Listener: Sprache aus dem zentralen Kern spiegeln
  useEffect(() => {
    // 1) Startzustand: aktuelles Kern-Locale
    const initial = getLocale();
    applyLang(initial);

    // 2) Auf Änderungen des Kern-Locale reagieren
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { locale?: string } | undefined;
      const next = detail?.locale ?? getLocale();
      applyLang(next);
    };

    window.addEventListener("mpathy:i18n:change", handler);
    return () => window.removeEventListener("mpathy:i18n:change", handler);
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

// app/components/navigation/LanguageSwitcher.tsx
"use client";


/*** =======================================================================
 *  INVENTUS INDEX — app/components/navigation/LanguageSwitcher.tsx
 *  Screening · Struktur · Sprach-Hotspots (Language Switcher)
 * ======================================================================= 
 *
 *  [ANCHOR:0]  IMPORTS
 *              – React (useEffect, useMemo, useRef, useState)
 *              – useLang, Lang aus "@/app/providers/LanguageProvider"
 *              – navDict aus "@/lib/i18n.navigation"
 *              – setLocale aus "@/lib/i18n"
 *
 *              Sprachrelevanz:
 *              – useLang/setLang  → Subscription-/Navigation-Welt
 *              – setLocale        → globales Chat-/Legacy-i18n (DICTS)
 *              – navDict          → eigenes i18n für Navigationslabels
 *
 *              → Diese Datei ist die zentrale KREUZUNG von:
 *                1) LanguageProvider
 *                2) Navigation-i18n
 *                3) globalem Chat-i18n (lib/i18n)
 *
 *  [ANCHOR:1]  LANG_ORDER & FLAGS
 *              – LANG_ORDER: feste Reihenfolge aller 13 Sprachen (en…hi)
 *              – FLAGS: Zuordnung Lang → Flaggen-Emoji
 *
 *              Sprachrelevanz:
 *              – Definiert, welche Sprachen der Switcher überhaupt anbietet.
 *              – Muss mit SUP in LanguageProvider & DICTS/dict in lib/i18n
 *                konsistent bleiben, ist aber hier autark.
 *
 *  [ANCHOR:2]  OPTION-TYP
 *              type Option = { code: Lang; flag: string; label: string }
 *
 *              – Nutzt Lang (aus LanguageProvider) als Sprachcode-Typ.
 *              – label kommt aus navDict[…].nav.language.label.
 *
 *  [ANCHOR:3]  LanguageSwitcher() – State & Context
 *              const { lang, setLang } = useLang();
 *              const [open, setOpen] = useState(false);
 *              const [openMobile, setOpenMobile] = useState(false);
 *              const [reducedMotion, setReducedMotion] = useState(false);
 *              const rootRef = useRef<HTMLDivElement | null>(null);
 *
 *              Sprachrelevanz:
 *              – lang stammt aus LanguageProvider (Subscription-/Nav-Kontext).
 *              – NICHT direkt aus lib/i18n.getLocale().
 *
 *  [ANCHOR:4]  NAV-DICT (navDict + options)
 *              const activeLocale = navDict[lang] ?? navDict.en;
 *              const ariaLabels = activeLocale.nav.language;
 *
 *              const options = useMemo(() => {
 *                return LANG_ORDER.map(code => {
 *                  const loc = navDict[code] ?? navDict.en;
 *                  return {
 *                    code,
 *                    flag: FLAGS[code],
 *                    label: loc.nav.language.label,
 *                  };
 *                });
 *              }, []);
 *
 *              const active = useMemo(
 *                () => options.find(o => o.code === lang) ?? options[0],
 *                [lang, options]
 *              );
 *
 *              Sprachrelevanz:
 *              – Anzeige (Label/Flaggen/ARIA-Texte) hängt von navDict ab.
 *              – navDict ist ein eigenes i18n-System (Navigation-spezifisch),
 *                losgelöst von DICTS (Chat) und dict (Subscription).
 *              – Wechsel der UI-Sprache in der Navi sichtbar, auch wenn
 *                der Rest der App nicht synchron mitzieht.
 *
 *  [ANCHOR:5]  REDUCED-MOTION-EFFEKT
 *              – Liest prefers-reduced-motion und setzt reducedMotion.
 *              – Nur Animationsverhalten, keine Sprachlogik.
 *
 *  [ANCHOR:6]  OUTSIDE-CLICK-HANDLER (Desktop)
 *              – Schließt Desktop-Dropdown bei Klick außerhalb.
 *              – Keine Sprachrelevanz.
 *
 *  [ANCHOR:7]  handleSelect(next: Lang)
 *              function handleSelect(next: Lang) {
 *                if (next === lang) {
 *                  setOpen(false);
 *                  setOpenMobile(false);
 *                  return;
 *                }
 *
 *                // Subscription-Welt (LanguageProvider)
 *                setLang(next);
 *
 *                // Chat-/Legacy-Welt (Säule, page2 etc.) – globales Locale synchronisieren
 *                setLocale(next);
 *
 *                // HTML lang-Attribut für A11y & Browser-Hints mitziehen
 *                if (typeof document !== "undefined") {
 *                  try {
 *                    document.documentElement.lang = next;
 *                  } catch {
 *                    // silent
 *                  }
 *                }
 *
 *                setOpen(false);
 *                setOpenMobile(false);
 *              }
 *
 *              Sprachrelevanz (zentraler Hotspot):
 *              – setLang(next): 
 *                  · ändert NUR den LanguageProvider-Context.
 *                  · beeinflusst Subscription-/Navigation-UI (useLang().t()).
 *              – setLocale(next):
 *                  · setzt currentLocale + mpathy:locale in lib/i18n.ts.
 *                  · feuert Events (mpathy:i18n:change / explicit).
 *                  · beeinflusst Chat/Säule/Legacy-t().
 *              – document.documentElement.lang = next:
 *                  · zweiter Schreiber für <html lang> neben
 *                    lib/i18n.attachLocaleWatchers() & LanguageProvider.
 *
 *              → Diese Funktion versucht aktuell, DREI Systeme gleichzeitig
 *                zu steuern (LanguageProvider, lib/i18n, DOM-lang).
 *                → Hoher Drift-Risiko, wenn andere Stellen ebenfalls Locale
 *                   setzen oder auf eigene Quellen (Browser, Cookies) hören.
 *
 *  [ANCHOR:8]  DESKTOP-Tail (md:flex)
 *              – Button zeigt:
 *                  · active.flag
 *                  · active.code
 *                  · Pfeil ▾
 *              – Dropdown listet alle Optionen (options), ruft handleSelect.
 *
 *              Sprachrelevanz:
 *              – Sichtbarer Nachweis, dass setLang(next) wirkt:
 *                · Label/Flagge ändern sich bei Klick.
 *              – Keine direkte Kopplung zum restlichen UI-i18n in dieser Datei
 *                – nur Navigationsebene.
 *
 *  [ANCHOR:9]  MOBILE-Dropdown (md:hidden)
 *              – Ähnlich wie Desktop, aber als zentriertes Overlay.
 *              – ruft ebenfalls handleSelect(opt.code) für jede Option.
 *
 *              Sprachrelevanz:
 *              – Gleiche Sprachlogik wie Desktop, andere Darstellung.
 *
 * =======================================================================
 *  ERKENNBARER FEHLERZU­SAMMENHANG (Inventur, keine Lösung)
 *
 *  1) Chat-Seite bleibt EN:
 *     – handleSelect ruft zwar setLocale(next), aber:
 *       · Wenn page2/page.tsx seine eigene Sprache aus getBrowserLang()
 *         oder einem lokalen State bezieht (statt aus getLocale()/Events),
 *         kann der Chat visuell auf EN hängen bleiben, obwohl hier
 *         setLocale(next) korrekt aufgerufen wird.
 *     – useLang() im Chat-Baum funktioniert nur, wenn dort ein
 *       LanguageProvider aktiv ist – sonst bleibt lang="en" (Default-Context).
 *
 *  2) Subscription-Seite übersetzt nur Navigation:
 *     – Navigation/LanguageSwitcher nutzen setLang(next) + navDict.
 *       → Navigation-Labels aktualisieren sich korrekt.
 *     – Subscription-Hauptinhalt (Hero, KPI, Testimonials, etc.) basiert
 *       auf providerDict + detectLocale(), nicht auf lang und nicht
 *       direkt auf setLocale().
 *       → Navigation folgt LanguageSwitcher, Rest der Seite folgt
 *         einer separaten Locale-Quelle.
 *
 *  3) Mehrfachschreiber für <html lang>:
 *     – LanguageProvider.applyLang() setzt document.documentElement.lang.
 *     – lib/i18n.attachLocaleWatchers() setzt document.documentElement.lang.
 *     – LanguageSwitcher.handleSelect() setzt document.documentElement.lang.
 *     → Drei Stellen schreiben potentiell unterschiedliche Werte,
 *       abhängig von localStorage, Cookies, Browser-Sprache oder Userklick.
 *
 * ======================================================================= */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLang, type Lang } from "@/app/providers/LanguageProvider";
import { dict as navDict } from "@/lib/i18n.navigation";
import { getLocale, setLocale } from "@/lib/i18n";



// Feste Reihenfolge der Sprachen (Desktop-Dropdown)
const LANG_ORDER: Lang[] = [
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
];

// Flaggen-Map für den Tail-Chip
const FLAGS: Record<Lang, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
  it: "🇮🇹",
  pt: "🇵🇹",
  nl: "🇳🇱",
  ru: "🇷🇺",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  ar: "🇸🇦",
  hi: "🇮🇳",
};

type Option = {
  code: Lang;
  flag: string;
  label: string;
};

export default function LanguageSwitcher() {
  // Context (Subscription / Nav)
  const { lang: ctxLang, setLang: setCtxLang } = useLang();

  // Effektive Sprache = Single Source (globales Locale)
  const [lang, setLang] = useState<Lang>((ctxLang ?? "en") as Lang);

  // Desktop Dropdown
  const [open, setOpen] = useState(false);


  // Mobile Sheet
  const [openMobile, setOpenMobile] = useState(false);

  // Reduced Motion
  const [reducedMotion, setReducedMotion] = useState(false);

    // Initial aus globalem Locale + Live-Updates via mpathy:i18n:change
  useEffect(() => {
    try {
      const initial = (getLocale() || ctxLang || "en") as Lang;
      setLang(initial);
    } catch {
      setLang("en");
    }

    const handler = (event: Event) => {
      const next = (event as CustomEvent).detail?.locale as Lang | undefined;
      if (next) {
        setLang(next);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mpathy:i18n:change", handler as EventListener);
      return () =>
        window.removeEventListener(
          "mpathy:i18n:change",
          handler as EventListener
        );
    }
  }, [ctxLang]);


  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeLocale = navDict[lang] ?? navDict.en;
  const ariaLabels = activeLocale.nav.language;

  const options: Option[] = useMemo(() => {
    return LANG_ORDER.map((code) => {
      const loc = navDict[code] ?? navDict.en;
      return {
        code,
        flag: FLAGS[code],
        label: loc.nav.language.label,
      };
    });
  }, []);

  const active = useMemo(
    () => options.find((o) => o.code === lang) ?? options[0],
    [lang, options]
  );

  // prefers-reduced-motion respektieren
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setReducedMotion(mq.matches);
    };

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Outside-Click-Handler für Desktop-Dropdown
    useEffect(() => {
    if (!open) return;
    function handleClickOutside(ev: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(ev.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleSelect(next: Lang) {
    if (next === lang) {
      setOpen(false);
      setOpenMobile(false);
      return;
    }

    // Subscription-Welt (LanguageProvider) – wenn Provider vorhanden
    try {
      setCtxLang(next);
    } catch {
      // no-op, falls kein Provider im Baum (page2)
    }

    // Chat-/Legacy-Welt (Säule, page2 etc.) – globales Locale
    setLocale(next);

    // Lokaler UI-State für Tail/Dropdown
    setLang(next);

    // HTML lang-Attribut für A11y & Browser-Hints
    if (typeof document !== "undefined") {
      try {
        document.documentElement.lang = next;
      } catch {
        // silent – kein Crash wegen lang-Update
      }
    }

    setOpen(false);
    setOpenMobile(false);
  }


  return (

    <>
      {/* ─────────────────────────────────────────────
          DESKTOP LANGUAGE TAIL (md:flex)
          ───────────────────────────────────────────── */}
      <div
        ref={rootRef}
        className="relative hidden md:flex items-center"
        aria-label={ariaLabels.dropdown_label}
      >
               <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabels.select_label}
          className="inline-flex cursor-pointer items-center justify-center rounded-full border px-3 gap-1 text-xs uppercase tracking-wide text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{

            height: "var(--nav-tail-height)",
            background: "var(--nav-tail-bg)",
            borderColor: "var(--nav-tail-border)",
            paddingInline: "var(--nav-padding-inline)",
            transition: reducedMotion
              ? "none"
              : "background-color var(--nav-motion-fast), opacity var(--nav-motion-fast), transform var(--nav-motion-fast)",
          }}
        >
          <span className="text-base leading-none">{active.flag}</span>
          <span className="leading-none">{active.code}</span>
          <span className="text-[10px] leading-none opacity-80">▾</span>
        </button>

                     {open && (
          <div
            className="absolute right-0 top-full mt-2 min-w-[10rem] rounded-2xl border bg-black/80 backdrop-blur-md shadow-lg overflow-hidden"
            style={{
              padding: "5px", // 5px Innenabstand Desktop-Dropdown
              borderColor: "var(--nav-tail-border)",
              boxShadow: "var(--nav-orbit-glow)",

              transition: reducedMotion
                ? "none"
                : "opacity var(--nav-motion-medium), transform var(--nav-motion-medium)",
            }}
            role="listbox"
          >
            <ul className="py-1">
              {options.map((opt) => (
                <li key={opt.code}>
                  <button
              type="button"
              onClick={() => handleSelect(opt.code)}
              role="option"
              aria-selected={opt.code === lang}
              className="cursor-pointer flex w-full items-center gap-2 px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/10"
            >

                    <span className="text-sm leading-none">{opt.flag}</span>
                    <span className="uppercase tracking-wide">{opt.code}</span>
                    <span className="ml-auto text-[10px] opacity-60">
                      {opt.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

         {/* ─────────────────────────────────────────────
          MOBILE LANGUAGE DROPDOWN (md:hidden)
          ───────────────────────────────────────────── */}
               <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setOpenMobile((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={openMobile}
          aria-label={ariaLabels.select_label}
          className="flex cursor-pointer items-center justify-center rounded-full border px-3 gap-1 text-xs uppercase tracking-wide text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{

            height: "var(--nav-tail-height)",
            background: "var(--nav-tail-bg)",
            borderColor: "var(--nav-tail-border)",
            paddingInline: "var(--nav-padding-inline)",
            cursor: "pointer", // ← NEU
            transition:
              "background-color var(--nav-motion-fast), opacity var(--nav-motion-fast), transform var(--nav-motion-fast)",
          }}
        >

          <span className="text-base leading-none">{active.flag}</span>
          <span className="leading-none">{active.code}</span>
        </button>

         {openMobile && (
  <div
  className="absolute z-[60] min-w-[12rem] max-w-[80vw] rounded-2xl border bg-black/90 backdrop-blur-lg shadow-lg overflow-hidden"
    style={{
      left: "calc(50% - 20px)",
      marginTop: "5px",
      padding: "5px",              // 5px Innenabstand Mobile-Dropdown
      borderColor: "var(--nav-tail-border)",
      boxShadow: "var(--nav-orbit-glow)",
      transform: "translateX(-50%)",
    }}
    role="listbox"
    aria-label={ariaLabels.dropdown_label}
  >



            <ul className="py-1">
              {options.map((opt) => (
                               <li key={opt.code}>
                                    <button
                    type="button"
                    onClick={() => handleSelect(opt.code)}
                    className="cursor-pointer flex w-full items-center gap-2 px-3 py-1.5 text-sm text-white/80 hover:text:white hover:bg-white/5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >

                    <span className="text-lg leading-none">{opt.flag}</span>

                    <span className="uppercase tracking-wide">{opt.code}</span>
                    <span className="ml-auto text-[11px] opacity-60">
                      {opt.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </>
  );
}

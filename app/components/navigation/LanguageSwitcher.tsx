// app/components/navigation/LanguageSwitcher.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLang, type Lang } from "@/app/providers/LanguageProvider";
import { dict as navDict } from "@/lib/i18n.navigation";

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
  const { lang, setLang } = useLang();

  // Desktop Dropdown
  const [open, setOpen] = useState(false);

  // Mobile Sheet
  const [openMobile, setOpenMobile] = useState(false);

  // Reduced Motion
  const [reducedMotion, setReducedMotion] = useState(false);

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
    setLang(next);
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
          className="inline-flex items-center justify-center rounded-full border px-3 gap-1 text-xs uppercase tracking-wide text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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
          className="flex items-center justify-center rounded-full border px-3 gap-1 text-xs uppercase tracking-wide text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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
      left: "calc(50% - 20px)",   // ← 20px nach links
      marginTop: "5px",
      padding: "5px",             // ← NEU: 5px Innenabstand
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
                    className="cursor-pointer flex w-full items-center gap-2 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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

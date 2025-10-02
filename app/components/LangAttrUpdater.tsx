"use client";

import { useEffect } from "react";
import { getLocale } from "@/lib/i18n";

export default function LangAttrUpdater() {
  useEffect(() => {
    function apply(lang: string) {
      try { document.documentElement.lang = lang; } catch {}
    }
    // beim Mount aktuelle Locale anwenden
    apply(getLocale());

    // auf i18n-Änderungen reagieren
    const onChange = (e: Event) => {
      const ce = e as CustomEvent;
      const next = (ce as any)?.detail?.locale;
      if (typeof next === "string") apply(next);
    };
    window.addEventListener("mpathy:i18n:change", onChange);
    return () => window.removeEventListener("mpathy:i18n:change", onChange);
  }, []);

  return null;
}

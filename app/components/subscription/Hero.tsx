// app/components/subscription/Hero.tsx
"use client";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero() {
  const { t } = useLang();

  function log(evt: string, detail?: any) {
    try { window.dispatchEvent(new CustomEvent(evt, { detail })); } catch {}
  }

  // Keine eigene Section – Abstände kommen aus page.tsx
  return (
    <div className="relative overflow-hidden w-full">
      {/* Hintergrundpuls: mittig & begrenzt, damit nichts nach links „zieht“ */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 z-0
                   x-micro-pulse w-[min(1100px,92vw)] h-[300px] sm:h-[360px]
                   bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.14),_transparent_58%)]"
      />

      {/* Inhalt */}
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
          {t("hero_title")}
        </h1>

        {/* Mikro-Abstand zwischen Titel und Subline */}
        <p className="mt-[6px] text-white/70">
          {t("hero_sub")}
        </p>

        <div className="mt-8 sm:mt-10">
          <a
            id="hero-cta"
            href="#showcases"
            aria-label={t("hero_cta")}
            onClick={() => log("hero_cta_click_oracle")}
            className="x-cta"
            role="button"
          >
            {t("hero_cta")}
          </a>
        </div>
      </div>
    </div>
  );
}

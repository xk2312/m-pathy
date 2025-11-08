// components/subscription/Hero.tsx
"use client";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero(){
  const { t } = useLang();
  return (
    <section className="relative px-4 pt-16 pb-10 sm:pt-20 sm:pb-14 overflow-hidden">
      {/* Photon-Field Platzhalter */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
      <div className="relative max-w-xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">{t("hero_title")}</h1>
        <p className="mt-3 sm:mt-4 text-white/70">{t("hero_sub")}</p>
        <div className="mt-6 sm:mt-8">
          <a href="#showcases" className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base sm:text-lg bg-white text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/60">
            {t("hero_cta")}
          </a>
        </div>
      </div>
    </section>
  );
}

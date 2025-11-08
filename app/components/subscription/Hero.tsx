// components/subscription/Hero.tsx
"use client";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero(){
  const { t } = useLang();

  // motion gate (prefers-reduced-motion aware)
  const motionOK =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: no-preference)")?.matches === true;

  // tiny analytics shim (no PII)
  function log(evt: string, detail?: any){
    try { window.dispatchEvent(new CustomEvent(evt, { detail })); } catch {}
  }

  return (
    <section className="relative px-4 pt-16 pb-10 sm:pt-20 sm:pb-14 overflow-hidden">
      {/* Background field only if motion allowed */}
      {motionOK && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 x-micro-pulse bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_60%)]"
        />
      )}
      <div className="relative max-w-xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">{t("hero_title")}</h1>
        <p className="mt-3 sm:mt-4 text-white/70">{t("hero_sub")}</p>
        <div className="mt-6 sm:mt-8">
          <a
            href="#showcases"
            aria-label={t("hero_cta")}
            onClick={() => log("hero_cta_click")}
            className="x-cta inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base sm:text-lg bg-white text-black hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            {t("hero_cta")}
          </a>
        </div>

      </div>
    </section>
  );
}

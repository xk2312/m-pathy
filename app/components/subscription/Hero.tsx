// app/components/subscription/Hero.tsx
"use client";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero(){
  const { t } = useLang();

  // tiny analytics shim (no PII)
  function log(evt: string, detail?: any){
    try { window.dispatchEvent(new CustomEvent(evt, { detail })); } catch {}
  }

  return (
    <section className="relative px-4 pt-16 pb-10 sm:pt-20 sm:pb-14 overflow-hidden">
      {/* Always render; reduced-motion disables animation via CSS. Force stacking so pulse is visible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 x-micro-pulse
                   bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.14),_transparent_58%)]"
      />

      {/* Content above pulse */}
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">{t("hero_title")}</h1>
        <p className="mt-3 sm:mt-4 text-white/70">{t("hero_sub")}</p>

        <div className="mt-6 sm:mt-8">
          <a
  href="#showcases"
  aria-label={t("hero_cta")}
  onClick={() => log("hero_cta_click_oracle")}
  className="
    x-cta inline-flex items-center justify-center rounded-[1.5rem]
    !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
    !no-underline visited:!no-underline visited:!text-black
    bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]
    shadow-xl shadow-purple-700/30
    animate-[pulse_3.5s_ease-in-out_infinite]
    focus:outline-none focus:!ring-2 focus:!ring-white/70
    hover:scale-[1.03] hover:brightness-110 transition-all duration-300
  "
  role="button"
>
  {t("hero_cta")}
</a>

        </div>
      </div>
    </section>
  );
}

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
          <>
          <a
            href="#onboarding"
            aria-label={t("mode_onboarding")}
            onClick={() => log("mode_onboarding_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_onboarding")}
          </a>
          <a
            href="#research"
            aria-label={t("mode_research")}
            onClick={() => log("mode_research_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_research")}
          </a>
          <a
            href="#m13"
            aria-label={t("mode_m13")}
            onClick={() => log("mode_m13_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_m13")}
          </a>
          <a
            href="#calm"
            aria-label={t("mode_calm")}
            onClick={() => log("mode_calm_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_calm")}
          </a>
          <a
            href="#play"
            aria-label={t("mode_play")}
            onClick={() => log("mode_play_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_play")}
          </a>
          <a
            href="#oracle"
            aria-label={t("mode_oracle")}
            onClick={() => log("mode_oracle_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_oracle")}
          </a>
          <a
            href="#joy"
            aria-label={t("mode_joy")}
            onClick={() => log("mode_joy_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_joy")}
          </a>
          <a
            href="#vision"
            aria-label={t("mode_vision")}
            onClick={() => log("mode_vision_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_vision")}
          </a>
          <a
            href="#empathy"
            aria-label={t("mode_empathy")}
            onClick={() => log("mode_empathy_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_empathy")}
          </a>
          <a
            href="#love"
            aria-label={t("mode_love")}
            onClick={() => log("mode_love_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_love")}
          </a>
          <a
            href="#wisdom"
            aria-label={t("mode_wisdom")}
            onClick={() => log("mode_wisdom_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_wisdom")}
          </a>
          <a
            href="#truth"
            aria-label={t("mode_truth")}
            onClick={() => log("mode_truth_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_truth")}
          </a>
          <a
            href="#peace"
            aria-label={t("mode_peace")}
            onClick={() => log("mode_peace_click")}
            className="
              x-cta inline-flex items-center justify-center rounded-2xl
              !px-[1.25rem] !py-[.75rem] text-base sm:text-lg
              !no-underline visited:!no-underline visited:!text-black
              shadow-sm !ring-1 !ring-white/15
              focus:outline-none focus:!ring-2 focus:!ring-white/60
              hover:translate-y-[-1px] transition-all ease-in-out duration-150
            "
            role="button"
          >
            {t("mode_peace")}
          </a>
</>

        </div>
      </div>
    </section>
  );
}

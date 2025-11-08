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
  className="group relative inline-flex items-center justify-center rounded-2xl
             px-6 py-3 text-base sm:text-lg font-medium text-black bg-white
             transition-transform duration-200 ease-in-out
             hover:-translate-y-[2px] focus-visible:outline-none"
>
  <span className="absolute -inset-px rounded-2xl bg-white opacity-5 blur-md group-hover:opacity-10 transition duration-200" />
  <span className="relative z-10">Jetzt beginnen</span>
</a>

        </div>
      </div>
    </section>
  );
}

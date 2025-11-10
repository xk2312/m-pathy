"use client";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero() {
  const { t } = useLang();

  return (
    <div className="relative w-full">
      <div className="mx-auto max-w-[820px] px-2 text-center">
        <h1
          className="text-[clamp(28px,5vw,52px)] font-semibold leading-[1.15] tracking-tight
                     bg-gradient-to-b from-white to-white/75 text-transparent bg-clip-text"
        >
          {t("hero_title")}
        </h1>

        <p className="mt-2 text-[15px] md:text-[17px] text-white/70">
          {t("hero_sub")}
        </p>

        {/* CTA: 60px Abstand oben/unten IMMER sichtbar */}
        <div className="mt-[60px] mb-[60px] flex w-full justify-center">
          <button
            type="button"
            aria-label={t("hero_cta")}
            className="
              inline-flex items-center justify-center
              h-[72px] md:h-[84px]            /* ← feste Höhe */
              px-[40px] md:px-[48px]          /* ← breite Schultern */
              text-[22px] md:text-[24px] leading-none font-semibold
              rounded-2xl text-black
              bg-[hsl(255,95%,75%)]
              shadow-[0_8px_24px_rgba(180,150,255,0.28)]
              transition-[transform,box-shadow] duration-200
              hover:-translate-y-[1px] hover:shadow-[0_10px_30px_rgba(180,150,255,0.35)]
              active:translate-y-0
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/85
              min-w-[320px]
            "
          >
            {t("hero_cta")}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero() {
  const { t } = useLang();

  return (
    <div className="relative w-full">
      <div className="mx-auto max-w-[820px] px-2 text-center">
        {/* Titel */}
        <h1
          className="text-[clamp(28px,5vw,52px)] font-semibold leading-[1.15] tracking-tight
                     bg-gradient-to-b from-white to-white/75 text-transparent bg-clip-text"
        >
          {t("hero_title")}
        </h1>

        {/* Subhead */}
        <p className="mt-2 text-[15px] md:text-[17px] text-white/70">
          {t("hero_sub")}
        </p>

        {/* CTA – margin top 20px, 60px Abstand nach unten */}
        <div className="mt-[20px] mb-[60px] flex w-full justify-center">
          <button
            type="button"
            aria-label={t("hero_cta")}
            className="
              inline-flex items-center justify-center
              h-[80px] md:h-[88px]              /* feste Höhe */
              px-[52px] md:px-[64px]            /* breite Schultern */
              text-[22px] md:text-[24px] font-semibold
              rounded-[9999px]                  /* ← voll rund */
              text-black
              bg-[hsl(255,95%,75%)]
              shadow-[0_8px_30px_rgba(180,150,255,0.28)]
              transition-[transform,box-shadow,background] duration-200
              hover:-translate-y-[1px] hover:shadow-[0_10px_35px_rgba(180,150,255,0.38)]
              hover:bg-[hsl(255,95%,80%)]
              active:translate-y-0
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/85
              min-w-[340px]
            "
          >
            {t("hero_cta")}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero() {
  const { t } = useLang();

  return (
    <div className="relative w-full">
      {/* Inhalt kompakt & mittig */}
      <div className="mx-auto max-w-[820px] px-2 text-center">
        {/* Titel */}
        <h1
          className="
            text-[clamp(28px,5vw,52px)]
            font-semibold leading-[1.15] tracking-tight
            bg-gradient-to-b from-white to-white/75 text-transparent bg-clip-text
          "
        >
          {t("hero_title")}
        </h1>

        {/* Subhead (falls nicht gewünscht: Zeile entfernen) */}
        <p className="mt-2 text-[15px] md:text-[17px] text-white/70">
          {t("hero_sub")}
        </p>

        {/* CTA – 60px Abstand oben & unten, klarer großer Button */}
        <div className="mt-[60px] mb-[60px] flex w-full justify-center">
          <button
            type="button"
            aria-label={t("hero_cta")}
            className="
              inline-flex items-center justify-center
              px-[36px] md:px-[44px]        /* Breite */
              py-[28px] md:py-[32px]        /* Höhe (deutlich größer) */
              text-[20px] md:text-[22px] font-semibold
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

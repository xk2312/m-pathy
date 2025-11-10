"use client";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero() {
  const { t } = useLang();

  return (
    <div className="text-center">
      <h1 className="text-[clamp(28px,5vw,52px)] font-semibold leading-[1.15] tracking-tight
                     bg-gradient-to-b from-white to-white/75 text-transparent bg-clip-text">
        {t("hero_title")}
      </h1>

            {/* Subhead mit exakt 30px nach oben */}
      <p className="mt-[30px] text-[16px] md:text-[18px] text-[#C7C7C7]">
        {t("hero_sub")}
      </p>

      {/* Button: oben 32px, unten 0 — Section regelt weiteren Abstand */}
      <div className="mt-[32px] flex w-full justify-center">
        <button

          type="button"
          aria-label={t("hero_cta")}
          className="
            inline-flex items-center justify-center
            h-[84px] px-[56px] text-[24px] font-semibold
            rounded-[9999px] min-w-[340px]
            text-black bg-[hsl(255,95%,75%)]
            shadow-[0_8px_30px_rgba(180,150,255,0.28)]
            transition-[transform,box-shadow] duration-200
            hover:-translate-y-[1px] hover:shadow-[0_10px_35px_rgba(180,150,255,0.38)]
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/85
          "
        >
          {t("hero_cta")}
        </button>
      </div>
    </div>
  );
}

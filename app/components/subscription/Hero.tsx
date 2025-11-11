"use client";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero() {
  const { t } = useLang();
  // Local adapter: wenn t(k) den Key zurückgibt, probiere "common.k"
  const tt = (k: string) => {
    const v = t(k);
    return v === k ? t(`common.${k}`) : v;
  };

  return (
    <div className="text-center flex flex-col items-center gap-[40px]">
      <h1
        className="text-[clamp(28px,5vw,52px)] font-semibold leading-[1.15] tracking-tight
                   bg-gradient-to-b from-white to-white/75 text-transparent bg-clip-text"
      >
        {tt("hero_title")}
      </h1>

      {/* Subhead – leicht kräftiger */}
      <p className="text-[16px] md:text-[18px] font-medium text-[#C7C7C7]">
        {tt("hero_sub")}
      </p>

      {/* CTA-Button mit zusätzlichem Abstand nach unten (40 px) */}
      <div className="mt-[32px] mb-[40px] flex w-full justify-center">
        <button
          type="button"
          aria-label={tt("hero_cta")}
          className="
            inline-flex items-center justify-center cursor-pointer
            h-[66px] px-[44px] text-[19px] font-semibold
            rounded-[9999px] min-w-[270px]
            text-black bg-[hsl(255,95%,75%)]
            shadow-[0_6px_24px_rgba(180,150,255,0.28)]
            transition-[transform,box-shadow] duration-200
            hover:-translate-y-[1px] hover:shadow-[0_10px_35px_rgba(180,150,255,0.38)]
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/85
          "
        >
          {tt("hero_cta")}
        </button>
      </div>

      {/* Hinweis unter dem Button */}
      <p className="text-center text-[16px] md:text-[18px] text-[#C7C7C7]">
        {tt("council_hint")}
      </p>
    </div>
  );
}

"use client";

import { useLang } from "@/app/providers/LanguageProvider";
import dynamic from "next/dynamic";

const ZenithButton = dynamic(
  () => import("@/app/components/ZenithButton"),
  { ssr: false }
);



export default function Hero() {
  const { t } = useLang();

  return (
    <div className="text-center flex flex-col items-center gap-[40px]">
      <h1
        className="text-[clamp(28px,5vw,52px)] font-semibold leading-[1.15] tracking-tight
                   bg-gradient-to-b from-white to-white/75 text-transparent bg-clip-text"
      >
        {t("hero_title")}
      </h1>

      {/* Subhead – leicht kräftiger */}
            <p className="text-[16px] md:text-[18px] font-medium text-[#C7C7C7]">
        {t("hero_sub")}
      </p>

      {/* CTA – inline Zenith */}
      <div className="mt-[32px] mb-[40px] flex w-full justify-center">
        <ZenithButton position="inline" aria-label={t("hero_cta")}>
          {t("hero_cta")}
        </ZenithButton>
      </div>

      {/* Hinweis unter dem Button */}
      <p className="text-center text-[16px] md:text-[18px] text-[#C7C7C7]">
        {t("council_hint")}
      </p>

    </div>
  );
}

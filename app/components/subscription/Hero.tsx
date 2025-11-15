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
    <div
      className="
        text-center
        flex flex-col items-center
        mx-auto
        max-w-[var(--h-a0-max-width)]
      "
    >
      <h1
        className="
          font-semibold
          tracking-tight
          bg-gradient-to-b from-white to-white/75
          text-transparent bg-clip-text
        "
        style={{
          fontSize: "var(--h-a0-size)",
          lineHeight: "var(--h-a0-line)",
        }}
      >
        {t("hero_title")}
      </h1>

      {/* Subhead – jetzt über A0-Subtitle-Tokens */}
      <p
        className="mt-[var(--h-a0-gap-title-sub)] font-medium text-[#C7C7C7]"
        style={{
          fontSize: "var(--h-a0-sub-size)",
          lineHeight: "var(--h-a0-sub-line)",
          opacity: "var(--h-a0-sub-opacity)",
        }}
      >
        {t("hero_sub")}
      </p>

      {/* CTA – Abstand über globalen Subtitle→Content-Gap */}
            <div className="mt-[var(--h-gap-sub-content)] mb-[40px] flex w-full justify-center">
        <ZenithButton position="inline" aria-label={t("hero_cta")}>
          {t("hero_cta")}
        </ZenithButton>
      </div>

      {/* Hinweis unter dem Button – mit zusätzlichem Abstand */}
      <p className="mt-[32px] text-center text-[16px] md:text-[18px] text-[#C7C7C7]">
        {t("council_hint")}
      </p>

    </div>
  );
}

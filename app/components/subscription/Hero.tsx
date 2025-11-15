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
        pt-[var(--h-space-a0-section)]
        pb-[var(--h-space-a0-section)]
      "
    >
      {/* A0 Headline */}
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
          letterSpacing: "var(--h-a0-letter)",
          fontWeight: "var(--h-a0-weight)",
        }}
      >
        {t("hero_title")}
      </h1>

      {/* A0 Subline */}
      <p
        className="font-medium text-[#C7C7C7]"
        style={{
          marginTop: "var(--h-a0-gap-title-sub)",
          fontSize: "var(--h-a0-sub-size)",
          lineHeight: "var(--h-a0-sub-line)",
          opacity: "var(--h-a0-sub-opacity)",
        }}
      >
        {t("hero_sub")}
      </p>

      {/* CTA */}
      <div
        className="
          flex w-full justify-center
        "
        style={{
          marginTop: "var(--h-gap-sub-content)",
          marginBottom: "var(--h-gap-sub-content)",
        }}
      >
        <ZenithButton position="inline" aria-label={t("hero_cta")}>
          {t("hero_cta")}
        </ZenithButton>
      </div>

      {/* Hinweis */}
      <p
        className="text-center text-[#C7C7C7]"
        style={{
          marginTop: "var(--h-gap-sub-content)",
          fontSize: "var(--h-a1-sub-size)",
          lineHeight: "var(--h-a1-sub-line)",
          opacity: "var(--h-a1-sub-opacity)",
        }}
      >
        {t("council_hint")}
      </p>
    </div>
  );
}

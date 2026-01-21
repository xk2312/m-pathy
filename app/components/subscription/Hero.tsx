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
        flex flex-col items-center justify-center
        mx-auto
        max-w-[var(--h-a0-max-width)]
        min-h-[calc(100vh-var(--header-height))]
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
          marginTop: "36px",
          fontSize: "var(--h-a0-sub-size)",
          lineHeight: "var(--h-a0-sub-line)",
          opacity: "var(--h-a0-sub-opacity)",
          maxWidth: "720px",
        }}
      >
        {t("hero_sub")}
      </p>

      {/* Proof bullets */}
      <ul
        className="text-sm text-[#AFAFAF] space-y-2"
        style={{ marginTop: "28px" }}
      >
        <li>{t("hero_proof_1")}</li>
        <li>{t("hero_proof_2")}</li>
        <li>{t("hero_proof_3")}</li>
        <li>{t("hero_proof_4")}</li>
        <li>{t("hero_proof_5")}</li>
      </ul>

           {/* Pricing */}
      <div
        className="text-center"
        style={{ marginTop: "40px" }}
      >
        <div className="text-2xl font-semibold text-white">
          {t("hero_price_monthly")}
        </div>
      </div>


      {/* CTA */}
      <div
        className="flex w-full justify-center"
        style={{
          marginTop: "36px",
          marginBottom: "46px",
        }}
      >
        <ZenithButton
          position="inline"
          aria-label={t("hero_cta")}
          onNavigate="/page2"
        >
          {t("hero_cta")}
        </ZenithButton>
      </div>



      {/* Hinweis wurde entfernt */}
    </div>
  );
}

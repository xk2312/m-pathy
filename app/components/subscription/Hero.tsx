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
  className="font-normal text-[#B5B5B5]"
  style={{
    marginTop: "36px",
    fontSize: "15px",
    lineHeight: "1.55",
    maxWidth: "720px",
  }}
>

        {t("hero_sub")}
      </p>

      {/* Proof block */}
      <p
        className="text-[#B5B5B5]"
        style={{
          marginTop: "24px",
          fontSize: "15px",
          lineHeight: "1.55",
          maxWidth: "720px",
        }}
      >
        {t("hero_proof_1")}.{" "}
        {t("hero_proof_2")}.{" "}
        {t("hero_proof_3")}.{" "}
        {t("hero_proof_4")}.{" "}
        {t("hero_proof_5")}.
      </p>


           {/* Pricing */}
      <div
        className="text-center"
        style={{ marginTop: "40px" }}
      >
      <div className="text-xl font-semibold text-white">
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
      {/* Entry reassurance */}
               <p
     
        className="text-[#9A9A9A]"
        style={{
          marginTop: "8px",
          fontSize: "13px",
          lineHeight: "1.45",
          letterSpacing: "0.01em",
          maxWidth: "520px",
        }}
      >

        {t("hero_entry_note_prefix")}{" "}
        <strong>{t("hero_entry_note_highlight")}</strong>
        {t("hero_entry_note_suffix")}
      </p>




      {/* Hinweis wurde entfernt */}
    </div>
  );
}

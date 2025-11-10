// components/subscription/CouncilOrbit.tsx
"use client";
import Image from "next/image";
import { useLang } from "@/app/providers/LanguageProvider";

export default function CouncilOrbit() {
  const { t } = useLang();

  return (
    <div className="w-full pt-[60px]">
      {/* Hint-Zeile zentriert, schmaler Textblock */}
      <p className="mx-auto mb-6 max-w-[820px] text-center text-white/70">
        {t("council_hint")}
      </p>

      {/* Bordered Panel zentriert */}
      <div className="mx-auto w-full max-w-[920px] rounded-2xl border border-white/10 p-4">
        {/* Quadratischer Frame, Bild skaliert contain */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src="/pictures/m-x.svg"
            alt="Council of 13"
            fill
            sizes="(max-width: 1024px) 100vw, 920px"
            className="object-contain opacity-90"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}

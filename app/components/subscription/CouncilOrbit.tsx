// components/subscription/CouncilOrbit.tsx
"use client";
import Image from "next/image";
import { useLang } from "@/app/providers/LanguageProvider";

export default function CouncilOrbit() {
  const { t } = useLang();

  return (
    <div className="max-w-xl mx-auto text-center">
      <p className="text-white/70 mb-4">{t("council_hint")}</p>

      {/* Responsive, overflow-sicherer Frame für das SVG */}
      <div className="rounded-2xl border border-white/10 p-4">
        <div className="relative mx-auto w-full max-w-[900px] aspect-square overflow-hidden">
          <Image
            src="/pictures/m-x.svg"
            alt="Council of 13"
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-contain opacity-90"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}

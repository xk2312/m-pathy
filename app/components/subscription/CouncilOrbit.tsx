// components/subscription/CouncilOrbit.tsx
"use client";
import Image from "next/image";
import { useLang } from "@/app/providers/LanguageProvider";

export default function CouncilOrbit(){
  const { t } = useLang();
  return (
    <div className="max-w-xl mx-auto text-center">
      <p className="text-white/70 mb-4">{t("council_hint")}</p>
        <div className="rounded-2xl border border-white/10 p-4">
    {/* Platzhalter: eingebettete SVG-Grafik */}
    <Image src="/pictures/m-x.svg" alt="Council of 13" width={800} height={800} className="w-full h-auto opacity-90" />
  </div>

    </div>
  );
}

"use client";
import Image from "next/image";
import { useLang } from "@/app/providers/LanguageProvider";

export default function CouncilOrbit() {
  const { t } = useLang();

  return (
    <div className="w-full">
      {/* Panel ohne Border */}
      <div className="mx-auto w-full max-w-[900px] rounded-2xl p-4">
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src="/pictures/m-x.svg"
            alt="Council of 13"
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-contain opacity-90"
          />
        </div>
      </div>
    </div>
  );
}

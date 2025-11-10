"use client";
import Image from "next/image";
import { useLang } from "@/app/providers/LanguageProvider";

export default function CouncilOrbit() {
  const { t } = useLang();

  return (
    <div className="w-full">
      {/* Stack: Hinweis + Panel mit garantierten 40px Abstand */}
      <div className="mx-auto w-full max-w-[900px] flex flex-col items-stretch gap-[40px]">
        <p className="text-center text-[16px] md:text-[18px] font-medium text-[#C7C7C7]">
          {t("council_hint")}
        </p>

        <div className="rounded-2xl border border-white/10 p-4">
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
    </div>
  );
}

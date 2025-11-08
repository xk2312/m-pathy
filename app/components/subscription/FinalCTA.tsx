// components/subscription/FinalCTA.tsx
"use client";
import { useLang } from "@/app/providers/LanguageProvider";

export default function FinalCTA(){
  const { t } = useLang();
  return (
    <section className="px-4 py-14 sm:py-16">
      <div className="max-w-xl mx-auto text-center rounded-2xl border border-white/10 p-6">
        <h3 className="text-2xl font-semibold">{t("cta_title")}</h3>
        <p className="text-white/70 mt-2">{t("cta_sub")}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/builder" className="rounded-2xl px-5 py-3 bg-white text-black">{t("cta_btn_primary")}</a>
          <a href="/pricing" className="rounded-2xl px-5 py-3 border border-white/20">{t("cta_btn_secondary")}</a>
        </div>
      </div>
    </section>
  );
}

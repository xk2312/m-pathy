"use client";

import { useLang } from "@/app/providers/LanguageProvider";

export default function PowerPrompts() {
  const { t } = useLang();

  // Platzhalter – minimal, damit Build grün ist.
  // (Wir füllen die echte UI im nächsten Schritt.)
  return (
    <div
      className="w-full text-center"
      style={{ minHeight: 120 }}
      aria-label="PowerPrompts"
    >
      <h3 className="text-[clamp(18px,2.4vw,24px)] font-semibold mb-[16px]">
        {t("pp_title") ?? "PowerPrompts"}
      </h3>

      <p className="text-white/70 text-[clamp(14px,1.8vw,16px)]">
        {t("pp_hint") ?? "Choose a prompt to begin…"}
      </p>
    </div>
  );
}

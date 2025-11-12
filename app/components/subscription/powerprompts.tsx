"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/app/providers/LanguageProvider";
import { motion } from "framer-motion";

/**
 * PowerPrompts — 6 sections with icons
 * - Default active: Parents (cyan glow)
 * - Buttons: subtle, classy effect
 * - Click => navigates to Page2 with ?prefill=... (and optional &auto=1 later)
 * - Uses i18n keys: pp.* (already added)
 */

type CatId = "parents" | "students" | "couples" | "doctors" | "marketing" | "universal";

const ICONS: Record<CatId, JSX.Element> = {
  parents: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path d="M12 6a3 3 0 1 1 0 6M5 11a2.5 2.5 0 1 1 .01-5.01M19 11a2.5 2.5 0 1 0-.01-5.01" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M3 21c0-3 3.5-5 6.5-5s6.5 2 6.5 5" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path d="M3 7l9-4 9 4-9 4-9-4z" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M6 10v4a6 6 0 0 0 12 0v-4" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  couples: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path d="M12 7a3 3 0 1 1 0 6M6.5 8.5a2.5 2.5 0 1 1 0 5M17.5 8.5a2.5 2.5 0 1 0 0 5" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M5 20c0-2.6 2.8-4.5 7-4.5S19 17.4 19 20" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  doctors: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <rect x="4" y="5" width="16" height="14" rx="2" strokeWidth="1.6"/>
      <path d="M12 8v8M9 12h6" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path d="M4 11V6l12-3v16l-12-3v-5" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="18.5" cy="18.5" r="2" strokeWidth="1.6"/>
    </svg>
  ),
  universal: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <circle cx="12" cy="12" r="6" strokeWidth="1.6"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
};

export default function PowerPrompts() {
  const { t } = useLang();
  const router = useRouter();

  const CATS = useMemo(
    () => ([
      { id: "parents",   label: t("pp.groups.parents")   },
      { id: "students",  label: t("pp.groups.students")  },
      { id: "couples",   label: t("pp.groups.couples")   },
      { id: "doctors",   label: t("pp.groups.doctors")   },
      { id: "marketing", label: t("pp.groups.marketing") },
      { id: "universal", label: t("pp.groups.universal") },
    ] as {id: CatId; label: string}[]),
    [t]
  );

  const QUESTIONS: Record<CatId, string[]> = useMemo(() => ({
    parents:   [t("pp.e1"), t("pp.e2")],
    students:  [t("pp.s1"), t("pp.s2")],
    couples:   [t("pp.p1"), t("pp.p2")],
    doctors:   [t("pp.a3"), t("pp.a4")],
    marketing: [t("pp.m1"), t("pp.m2")],
    universal: [t("pp.u1"), t("pp.u2"), t("pp.u3")],
  }), [t]);

  const [active, setActive] = useState<CatId>("parents");

  const onAsk = (text: string) => {
    const q = encodeURIComponent(text);
    router.push(`/subscription/page2?prefill=${q}`); // auto-send option below
  };

  return (
    <section aria-label="Power Prompts" className="relative">
      {/* Title + hint */}
      <div className="text-center mb-6">
        <h2 className="text-[clamp(20px,3vw,30px)] font-semibold tracking-wide">
          {t("pp.title")}
        </h2>
        <p className="text-white/60 mt-2">{t("pp.hint")}</p>
      </div>

      {/* Tabs with icons */}
      <div className="page-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CATS.map(({ id, label }) => {
            const activeNow = id === active;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={[
                  "group relative flex items-center gap-2 px-4 py-2 rounded-2xl",
                  "bg-white/5 hover:bg-white/10 transition-colors",
                  "ring-1 ring-white/10",
                  activeNow ? "shadow-[0_0_0_2px_rgba(0,255,255,0.15)]" : ""
                ].join(" ")}
                aria-pressed={activeNow}
              >
                <span className={activeNow ? "text-cyan-300" : "text-white/80"}>
                  {ICONS[id]}
                </span>
                <span className="text-sm">{label}</span>
                {/* cyan glow ring */}
                {activeNow && (
                  <motion.span
                    layoutId="pp-glow"
                    className="absolute inset-0 rounded-2xl"
                    style={{ boxShadow: "0 0 24px 6px rgba(0,255,255,0.15)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Questions list */}
        <div className="mt-8 mx-auto max-w-[min(100%,900px)] space-y-3">
          {QUESTIONS[active].map((q, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-white/4 ring-1 ring-white/10 px-4 py-3"
            >
              <div className="text-[15px] leading-snug">{q}</div>

              <motion.button
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAsk(q)}
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium
                           bg-white/8 hover:bg-white/12 active:bg-white/16
                           ring-1 ring-white/15 backdrop-blur
                           transition"
              >
                {t("pp.ask")}
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

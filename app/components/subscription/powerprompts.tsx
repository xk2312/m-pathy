"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/app/providers/LanguageProvider";
import { motion } from "framer-motion";

// Zielpfad für Page 2 (per ENV überschreibbar)
const PAGE2_PATH = process.env.NEXT_PUBLIC_PAGE2_PATH ?? "/page2";

type CatId = "parents" | "students" | "couples" | "doctors" | "marketing" | "universal";

const ICONS: Record<CatId, JSX.Element> = {
  parents: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path d="M12 6a3 3 0 1 1 0 6M5 10.5a2.5 2.5 0 1 1 0-5M19 10.5a2.5 2.5 0 1 1 0-5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 21c0-3 3.5-5 6.5-5s6.5 2 6.5 5" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path d="M3 7l9-4 9 4-9 4-9-4z" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 10v4a6 6 0 0 0 12 0v-4" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  couples: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" strokeWidth="1.6" />
      <path d="M4.5 20c0-2.5 3-4.5 7.5-4.5S19.5 17.5 19.5 20" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  doctors: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <rect x="4" y="5" width="16" height="14" rx="2" strokeWidth="1.6" />
      <path d="M12 8v8M9 12h6" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path d="M4 11V6l12-3v16l-12-3v-5" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="18.5" cy="18.5" r="2" strokeWidth="1.6" />
    </svg>
  ),
  universal: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <circle cx="12" cy="12" r="6" strokeWidth="1.6" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

// Englische Baselines (Fallbacks, falls i18n-Keys fehlen)
const BASE = {
  title: "Power Prompts",
  hint: "Pick a category and start with a magical question.",
  groups: {
    parents: "Parents",
    students: "Students",
    couples: "Couples",
    doctors: "Doctors",
    marketing: "Marketing",
    universal: "Universal",
  },
  e1: 'Explain God to my 4-year-old daughter with love, clarity and wonder.',
  e2: 'Explain “false narrative” to my 5-year-old son in a gentle, simple way.',
  s1: "Explain Pythagoras simply.",
  s2: "Explain quantum physics simply.",
  p1: "Explain why I’m jealous when my boyfriend meets female friends.",
  p2: "Teach us how to resolve conflict with empathy and fairness.",
  a3: "Show the best cannabis treatment for chronic back pain.",
  a4: "I need three cannabis flowers suitable for ADHD.",
  m1: "I have no budget — create a guerrilla marketing plan for my handmade kids’ toys site.",
  m2: "I need a guerrilla tactic to drive heavy sales for my new Chrome plugin.",
  u1: "I need a business concept. Start Capsula13.",
  u2: "I need a NEM. Start ChemoMaster.",
  u3: "I need a cherry-sized drone. Start GalaxyBuilder.",
  ask: "Ask directly",
};

export default function PowerPrompts() {
  const router = useRouter();
  const { t } = useLang();

  // i18n: sicherer Getter mit Fallback
  const safeT = (key: string): string => {
    const v = t(key);
    return v && v !== key ? v : (BASE as any)[key.split(".").slice(-1)[0]] ?? key;
  };

  const title = (() => {
    const v = t("pp.title");
    return v === "pp.title" ? BASE.title : v;
  })();

  const hint = (() => {
    const v = t("pp.hint");
    return v === "pp.hint" ? BASE.hint : v;
  })();

  const GROUP_LABEL = (id: CatId) => {
    const v = t(`pp.groups.${id}`);
    return v === `pp.groups.${id}` ? BASE.groups[id] : v;
  };

  const CATS: Array<{ id: CatId; label: string }> = useMemo(
    () => [
      { id: "parents", label: GROUP_LABEL("parents") },
      { id: "students", label: GROUP_LABEL("students") },
      { id: "couples", label: GROUP_LABEL("couples") },
      { id: "doctors", label: GROUP_LABEL("doctors") },
      { id: "marketing", label: GROUP_LABEL("marketing") },
      { id: "universal", label: GROUP_LABEL("universal") },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t] // re-eval bei Locale-Wechsel
  );

  const QUESTIONS: Record<CatId, string[]> = useMemo(
    () => ({
      parents: [safeT("pp.e1") || BASE.e1, safeT("pp.e2") || BASE.e2],
      students: [safeT("pp.s1") || BASE.s1, safeT("pp.s2") || BASE.s2],
      couples: [safeT("pp.p1") || BASE.p1, safeT("pp.p2") || BASE.p2],
      doctors: [safeT("pp.a3") || BASE.a3, safeT("pp.a4") || BASE.a4],
      marketing: [safeT("pp.m1") || BASE.m1, safeT("pp.m2") || BASE.m2],
      universal: [safeT("pp.u1") || BASE.u1, safeT("pp.u2") || BASE.u2, safeT("pp.u3") || BASE.u3],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  const [active, setActive] = useState<CatId>("parents");

  const onAsk = (text: string) => {
    const q = encodeURIComponent(text);
    router.push(`${PAGE2_PATH}?prefill=${q}`);
  };

  return (
    <section
      aria-label="Power Prompts"
      className="relative py-16 md:py-28"
      style={
        {
          // Buffer-Parameter
          // Subheadline → Buttons
          "--pp-gap-top": "130px",
          // Buttons → erste Promptzeile
          "--pp-gap-bottom": "30px",
        } as React.CSSProperties
      }
    >
      {/* Title + hint */}
      <div className="text-center mb-[var(--pp-gap-top)]">
        <h2 className="text-[clamp(34px,6vw,72px)] leading-[1.05] font-semibold text-white tracking-tight">
          {title}
        </h2>
        <p
          className="mt-5 md:mt-6 mx-auto text-center max-w-3xl
                     text-[clamp(15px,2vw,18px)] leading-relaxed text-white/80
                     px-4"
        >
          {hint}
        </p>
            </div>

      {/* Buffer between subheadline and pills */}
      <div className="w-full h-[130px]" aria-hidden="true" />

      {/* Category pills */}
      <div className="mx-auto max-w-[min(100%,1120px)]">
        <div
          className="flex flex-wrap items-center justify-center gap-3.5 md:gap-5
                     px-2 md:px-0"
        >


          {CATS.map(({ id, label }) => {
            const activeNow = id === active;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                aria-pressed={activeNow}
                className={[
                  // Größe + Haptik (Padding via inline style, um 5×7 exakt zu garantieren)
                  "group relative flex items-center gap-3 md:gap-3.5 rounded-[22px]",
                  // Materialität
                  "bg-white/6 hover:bg-white/10 transition-colors backdrop-blur-md",
                  // Kontur + Tiefe
                  "ring-1 ring-white/12 shadow-[0_10px_36px_rgba(0,0,0,0.38)]",
                  // Aktiver Glow-Ring
                  activeNow ? "shadow-[0_0_0_2px_rgba(0,255,255,0.20)]" : "",
                  // Fokus-Sichtbarkeit
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
                ].join(" ")}
                style={
                  {
                    // Präzises Innenpadding je Pill
                    "--pp-pill-px": "7px",
                    "--pp-pill-py": "5px",
                    padding: "var(--pp-pill-py) var(--pp-pill-px)",
                  } as React.CSSProperties
                }
              >
                <span
                  className={
                    (activeNow ? "text-cyan-300" : "text-white/80") +
                    " [&>svg]:w-7 [&>svg]:h-7 md:[&>svg]:w-8 md:[&>svg]:h-8"
                  }
                >
                  {ICONS[id]}
                </span>
                <span className="text-[15px] md:text-[16px] font-medium tracking-[0.1px]">
                  {label}
                </span>

                {activeNow && (
                  <motion.span
                    layoutId="pp-glow"
                    className="pointer-events-none absolute inset-0 rounded-[22px]"
                    style={{ boxShadow: "0 0 46px 12px rgba(0,255,255,0.18)" }}
                  />
                )}
              </button>
            );
          })}
               </div>

        {/* Buffer between pills and question list */}
        <div className="w-full h-[30px]" aria-hidden="true" />

        {/* Questions list */}
        <div className="mx-auto max-w-[min(100%,1040px)] space-y-5 md:space-y-6">

          {QUESTIONS[active].map((q, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-6
                         rounded-3xl bg-white/6 ring-1 ring-white/12 px-6 md:px-7 py-5 md:py-6 backdrop-blur-md
                         shadow-[0_14px_42px_rgba(0,0,0,0.38)]"
            >
              <div className="text-[17px] md:text-[18px] leading-[1.45] text-white/95">
                {q}
              </div>

              <motion.button
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onAsk(q)}
                className="inline-flex items-center justify-center rounded-2xl px-5 md:px-6 py-3 md:py-3.5
                           text-[15px] md:text-[16px] font-semibold tracking-[-0.005em]
                           bg-white/12 hover:bg-white/16 active:bg-white/18
                           ring-1 ring-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.4)]
                           transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
              >
                {t("pp.ask") !== "pp.ask" ? t("pp.ask") : BASE.ask}
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
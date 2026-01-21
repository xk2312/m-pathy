"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/app/providers/LanguageProvider";
import { motion } from "framer-motion";


/** Zielpfad für Page 2 (per ENV überschreibbar) */
const PAGE2_PATH = process.env.NEXT_PUBLIC_PAGE2_PATH ?? "/page2";

type CatId = "parents" | "students" | "couples" | "doctors" | "marketing" | "universal";

const ICONS: Record<CatId, JSX.Element> = {
  parents: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path
        d="M12 6a3 3 0 1 1 0 6M5 10.5a2.5 2.5 0 1 1 0-5M19 10.5a2.5 2.5 0 1 1 0-5"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 21c0-3 3.5-5 6.5-5s6.5 2 6.5 5"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path d="M3 7l9-4 9 4-9 4-9-4z" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M6 10v4a6 6 0 0 0 12 0v-4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  couples: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path
        d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        strokeWidth="1.6"
      />
      <path
        d="M4.5 20c0-2.5 3-4.5 7.5-4.5S19.5 17.5 19.5 20"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  doctors: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <rect x="4" y="5" width="16" height="14" rx="2" strokeWidth="1.6" />
      <path
        d="M12 8v8M9 12h6"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <path
        d="M4 11V6l12-3v16l-12-3v-5"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="18.5" cy="18.5" r="2" strokeWidth="1.6" />
    </svg>
  ),
  universal: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current">
      <circle cx="12" cy="12" r="6" strokeWidth="1.6" />
      <path
        d="M12 2v4M12 18v4M2 12h4M18 12h4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/** Englische Baselines (Fallbacks, falls i18n-Keys fehlen) */
const BASE = {
  kicker: "Action Prompts",
  title: "Intention in Motion",
  hint: "Say what you want - and let form follow intention.",
  groups: {
    parents: "Parents",
    students: "Students",

    couples: "Couples",
    doctors: "Doctors",
    marketing: "Marketing",
    universal: "Universal",
  },
  e1: "Explain God to my 4-year-old daughter with love, clarity and wonder.",
  e2: "Explain “false narrative” to my 5-year-old son in a gentle, simple way.",
  s1: "Explain Pythagoras simply.",
  s2: "Explain quantum physics simply.",
  p1: "Explain why I’m jealous when my boyfriend meets female friends.",
  p2: "Teach us how to resolve conflict with empathy and fairness.",
  a3: "Show the best cannabis treatment for chronic back pain.",
  a4: "I need three cannabis flowers suitable for ADHD.",
  m1: "I have no budget - create a guerrilla marketing plan for my handmade kids’ toys site.",
  m2: "I need a guerrilla tactic to drive heavy sales for my new Chrome plugin.",
  u1: "I need a business concept. Start Capsula13.",
  u2: "I need a NEM. Start ChemoMaster.",
  u3: "I need a cherry-sized drone. Start GalaxyBuilder.",
  ask: "Ask directly",
};

export default function PowerPrompts() {
  const router = useRouter();
  const { t } = useLang();

  const safeT = (key: string): string => {
    const v = t(key);
    return v && v !== key ? v : (BASE as any)[key.split(".").slice(-1)[0]] ?? key;
  };

  const kicker = (() => {
    const v = t("pp.kicker");
    return v === "pp.kicker" ? BASE.kicker : v;
  })();

  const title = (() => {
    const v = t("pp.title");
    return v === "pp.title" ? BASE.title : v;
  })();

  const hint = (() => {
    const v = t("pp.hint");
    return v === "pp.hint" ? BASE.hint : v;
  })();

  const CATS = useMemo(

    () =>
      ([
        {
          id: "parents",
          label:
            t("pp.groups.parents") !== "pp.groups.parents"
              ? t("pp.groups.parents")
              : BASE.groups.parents,
        },
        {
          id: "students",
          label:
            t("pp.groups.students") !== "pp.groups.students"
              ? t("pp.groups.students")
              : BASE.groups.students,
        },
        {
          id: "couples",
          label:
            t("pp.groups.couples") !== "pp.groups.couples"
              ? t("pp.groups.couples")
              : BASE.groups.couples,
        },
        {
          id: "doctors",
          label:
            t("pp.groups.doctors") !== "pp.groups.doctors"
              ? t("pp.groups.doctors")
              : BASE.groups.doctors,
        },
        {
          id: "marketing",
          label:
            t("pp.groups.marketing") !== "pp.groups.marketing"
              ? t("pp.groups.marketing")
              : BASE.groups.marketing,
        },
        {
          id: "universal",
          label:
            t("pp.groups.universal") !== "pp.groups.universal"
              ? t("pp.groups.universal")
              : BASE.groups.universal,
        },
      ] as Array<{ id: CatId; label: string }>),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  const QUESTIONS: Record<CatId, string[]> = useMemo(
    () => ({
      parents: [safeT("pp.e1") || BASE.e1, safeT("pp.e2") || BASE.e2],
      students: [safeT("pp.s1") || BASE.s1, safeT("pp.s2") || BASE.s2],
      couples: [safeT("pp.p1") || BASE.p1, safeT("pp.p2") || BASE.p2],
      doctors: [safeT("pp.a3") || BASE.a3, safeT("pp.a4") || BASE.a4],
      marketing: [safeT("pp.m1") || BASE.m1, safeT("pp.m2") || BASE.m2],
      universal: [
        safeT("pp.u1") || BASE.u1,
        safeT("pp.u2") || BASE.u2,
        safeT("pp.u3") || BASE.u3,
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  const [active, setActive] = useState<CatId>("parents");

  const onAsk = (text: string) => {
    const q = encodeURIComponent(text);
    router.push(`${PAGE2_PATH}?prefill=${q}`);
  };

  /** Ion Beam – Button (Skin-Komponente) */
  const IonBeamButton: React.FC<{ label: string; onClick: () => void }> = ({
    label,
    onClick,
  }) => {
    return (
      <motion.button
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.985 }}
        onClick={onClick}
        className={[
          "group relative inline-flex items-center justify-center rounded-2xl select-none",
          "ring-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
        ].join(" ")}
        style={{
          padding: "var(--pp-row-pad-y) var(--pp-row-pad-x)",
          background: "var(--pp-ion-base-bg)",
          borderColor: "var(--pp-cyan-line)",
          boxShadow: `0 0 36px var(--pp-cyan-soft)`,
          transition: "background 120ms ease, box-shadow 180ms ease",
        }}
      >
        {/* Sweep-Licht – läuft bei Hover quer über den Button */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-full w-[160%] blur-[var(--pp-ion-sweep-blur)]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.35) 40%, rgba(34,211,238,0.9) 50%, rgba(34,211,238,0.35) 60%, transparent 100%)",
            opacity: 0.0,
          }}
          initial={{ x: "-20%", opacity: 0 }}
          whileHover={{ x: "20%", opacity: 1 }}
          transition={{ duration: 0.22 }}
        />

        {/* Textinhalt */}
       <span
  className="relative z-10 text-[15px] md:text-[16px] font-semibold tracking-[-0.005em] text-white"
  style={{ whiteSpace: "nowrap" }}
>
  {label}
</span>

      </motion.button>
    );
  };


return (
  <section aria-label="Power Prompts" className="relative">
    {/* Headline + Subheadline – A2 Headingsystem */}
    <div className="mx-auto flex flex-col items-start text-left">
      <p
        className="text-white/80"
        style={{
          margin: 0,
          fontSize: "var(--h-kicker-size)",
          fontWeight: "var(--h-kicker-weight)",
          letterSpacing: "var(--h-kicker-letter)",
          textTransform: "var(--h-kicker-transform)" as any,
          opacity: "var(--h-kicker-opacity)",
          marginBottom: "var(--h-gap-kicker-title)",
        }}
      >
        {kicker}
      </p>
      <h2
        className="font-semibold tracking-tight text-white"
        style={{
          margin: 0,
          fontSize: "var(--h-a2-size)",
          lineHeight: "var(--h-a2-line)",
          letterSpacing: "var(--h-a2-letter)",
        }}
      >
        {title}
      </h2>
      <p
        className="text-white"
        style={{
          margin: 0,
          marginTop: "var(--h-a2-gap-title-sub)",
          fontSize: "var(--h-a2-sub-size)",
          lineHeight: "var(--h-a2-sub-line)",
          opacity: "var(--h-a2-sub-opacity)",
        }}
      >
        {hint}
      </p>
    </div>
    {/* … Tabs & Liste … */}



      {/* Buffer: Subheadline → Tabs (Token-gesteuert) */}
      <div
        aria-hidden
        className="w-full"
        style={{ height: "var(--pp-sub-to-tabs)" }}
      />

            {/* Kategorie-Pills */}
      <div
        className="mx-auto w-full"
        style={{ maxWidth: "calc(var(--page-inner-max) * 1.6)" }}
      >
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3.5 md:gap-4 px-2 md:px-0">
          {CATS.map(({ id, label }) => {

            const activeNow = id === active;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id as typeof active)}
                aria-pressed={activeNow}
                className={[
                  "group relative flex items-center gap-3 md:gap-3.5 rounded-[22px] cursor-pointer",
                  "bg-white/6 hover:bg-white/10 transition-colors backdrop-blur-md",
                  "ring-1 ring-white/12 shadow-[0_10px_36px_rgba(0,0,0,0.38)]",
                  activeNow
                    ? "shadow-[0_0_0_2px_rgba(0,255,255,0.20)]"
                    : "",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
                ].join(" ")}
                style={{ padding: "5px 7px" }}
              >
                <span
                  className={
                    (activeNow ? "text-cyan-300" : "text-white/80") +
                    " [&>svg]:w-7 [&>svg]:h-7 md:[&>svg]:w-8 md:[&>svg]:h-8"
                  }
                >
                  {ICONS[id as keyof typeof ICONS]}
                </span>
                <span className="text-[15px] md:text-[16px] font-medium tracking-[0.1px]">
                  {label}
                </span>

                {activeNow && (
                  <motion.span
                    layoutId="pp-glow"
                    className="pointer-events-none absolute inset-0 rounded-[22px]"
                    style={{
                      boxShadow: "0 0 46px 12px rgba(0,255,255,0.18)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Buffer: Tabs → Liste */}
      <div
        aria-hidden
        className="w-full"
        style={{ height: "var(--pp-tabs-to-list)" }}
      />

        {/* Fragenliste – Textkarte links, Ion-Beam-CTA rechts */}
      <div
        className="mx-auto w-full"
        style={{ maxWidth: "calc(var(--page-inner-max) * 1.6)" }}
      >
        {QUESTIONS[active].map((q, i) => (

          <div key={i}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-6">
              {/* Textkarte */}
              <div
                className="rounded-3xl bg-white/6 ring-1 ring-white/12 backdrop-blur-md shadow-[0_14px_42px_rgba(0,0,0,0.38)]"
                style={{
                  paddingTop: "var(--pp-row-pad-y)",
                  paddingBottom: "var(--pp-row-pad-y)",
                  paddingLeft: "var(--pp-row-pad-x)",
                  paddingRight: "var(--pp-row-pad-x)",
                }}
              >
                <div className="text-[17px] md:text-[18px] leading-[1.45] text-white/95">
                  {q}
                </div>
              </div>

              {/* CTA – Ion Beam */}
              <IonBeamButton
                label={
                  t("pp.ask") !== "pp.ask" ? t("pp.ask") : BASE.ask
                }
                onClick={() => onAsk(q)}
              />
            </div>

            {/* echter Buffer unter jeder Zeile */}
            {i < QUESTIONS[active].length - 1 && (
              <div
                aria-hidden
                className="w-full"
                style={{ height: "var(--pp-row-buffer)" }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

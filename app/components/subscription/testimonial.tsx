"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

/**
 * Testimonials – Cold Sublimation + Color Light + Breath Sync
 * - Keine Worttrennung (Wörter als nowrap-Container, Letters animieren darin).
 * - Farb-Licht: Cyan-Frost an der Schrift, Gold-Bloom beim Wechsel.
 * - Breath Sync: 8s Sinus-Loop (Scale/Opacity ganz sanft).
 * - Nebel: High (mehr Wisps, leicht größere Felder, stärkere Opacity).
 * - Manifest-konform: transform / opacity / filter only.
 */

export default function Testimonial() {
  const { t } = useLang();

  const items = useMemo(
    () => [
      { id: "gemini", quote: t("testimonials.gemini"), author: "— Gemini Apex —" },
      { id: "grok",   quote: t("testimonials.grok"),   author: "— Grok —" },
      { id: "gpt5",   quote: t("testimonials.gpt5"),   author: "— GPT-5 —" },
    ],
    [t]
  );

  const [idx, setIdx] = useState(0);

  // Auto-Cycle alle 8 s
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 8000);
    return () => clearInterval(id);
  }, [items.length]);

  const cur = items[idx];
  const tokens = useMemo(() => tokenizeQuote(String(cur.quote ?? "")), [cur.quote]);

  return (
    <section
      aria-label="Testimonials (Cold Sublimation)"
      className="relative w-full text-center flex flex-col items-center justify-center min-h-[300px] overflow-hidden"
    >
      {/* Subtiler Hintergrund-Schimmer */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.03, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(60% 40% at 50% 60%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 30%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Nebel – High */}
      <VaporField intensity="high" />

      {/* Gold-Bloom beim Slide-Wechsel */}
      <GoldBloom key={`gold-${cur.id}`} />

      <AnimatePresence mode="wait">
        <BreathSync key={`breath-${cur.id}`}>
          <motion.figure
            key={cur.id}
            initial={{ opacity: 0, filter: "blur(10px)", y: 10, scale: 0.985 }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              scale: 1,
              transition: { duration: 0.85, ease: [0.23, 1, 0.32, 1] },
            }}
            exit={{
              opacity: 0,
              filter: "blur(8px)",
              y: -8,
              scale: 1.01,
              transition: { duration: 0.65, ease: "easeInOut" },
            }}
            className="relative mx-auto max-w-[min(90%,900px)] px-[clamp(20px,6vw,180px)]"
          >
            {/* Quote */}
            <p
              className="text-[clamp(20px,3vw,34px)] leading-snug font-light text-white/92 frost-bloom frost-cyan"
              style={{ whiteSpace: "normal", wordBreak: "keep-all", overflowWrap: "normal" }}
            >
              {tokens.map((tok, i) => {
                if (tok.type === "br") return <br key={`br-${i}`} />;
                if (tok.type === "space") return <span key={`sp-${i}`}>{" "}</span>;

                return (
                  <span
                    key={`w-${i}`}
                    className="inline-block whitespace-nowrap"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {Array.from(tok.word).map((ch, j) => (
                      <Letter key={`c-${i}-${j}`} delay={(i * 0.018 + j * 0.02) * 1.25}>
                        {ch}
                      </Letter>
                    ))}
                  </span>
                );
              })}
            </p>

            {/* Author */}
            <motion.figcaption
              className="mt-[28px] text-[15px] text-white/65 tracking-wide"
              initial={{ opacity: 0, y: 6 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.55, duration: 0.5, ease: "easeOut" },
              }}
            >
              {cur.author}
            </motion.figcaption>
          </motion.figure>
        </BreathSync>
      </AnimatePresence>

      {/* Local Styles */}
      <style jsx>{`
        /* Baseline Frost */
        .frost-bloom {
          text-shadow:
            0 0 0.6px rgba(255,255,255,0.92),
            0 0 8px rgba(255,255,255,0.18),
            0 0 18px rgba(255,255,255,0.10);
        }
        /* Cyan-Ton im Glow (Farb-Licht Frost) */
        .frost-cyan {
          text-shadow:
            0 0 0.6px rgba(255,255,255,0.92),
            0 0 8px rgba(160,230,255,0.32),
            0 0 20px rgba(130,210,255,0.20),
            0 0 36px rgba(120,200,255,0.12);
        }
        @media (prefers-reduced-motion: no-preference) {
          .frost-bloom,
          .frost-cyan {
            filter: drop-shadow(0 0 0.35rem rgba(150,220,255,0.14));
          }
        }
      `}</style>
    </section>
  );
}

/* Breath Sync Wrapper – 8s Sinus-Loop */
function BreathSync({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      aria-hidden="false"
      animate={{
        scale: [1.0, 1.006, 1.0, 0.996, 1.0],
        opacity: [1.0, 0.98, 1.0, 0.98, 1.0],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

/* Gold-Bloom beim Slide-Wechsel (kurz, weich) */
function GoldBloom() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
      animate={{ opacity: [0.0, 0.12, 0.0], scale: [0.98, 1.02, 1.0], filter: "blur(26px)" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(45% 35% at 50% 58%, rgba(255,210,120,0.18) 0%, rgba(255,190,90,0.10) 35%, transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}

/* Zerlegt Zitat in Wörter / Spaces / Zeilenumbrüche (keine Worttrennung) */
function tokenizeQuote(
  q: string
): Array<{ type: "word"; word: string } | { type: "space" } | { type: "br" }> {
  const result: Array<{ type: "word"; word: string } | { type: "space" } | { type: "br" }> = [];
  const parts = q.split(/(\s+)/);
  for (const p of parts) {
    if (p === "") continue;
    if (p.includes("\n")) {
      const sub = p.split("\n");
      sub.forEach((s, idx) => {
        if (s.trim() !== "") result.push({ type: "word", word: s });
        if (idx < sub.length - 1) result.push({ type: "br" });
      });
    } else if (p.trim() === "") {
      result.push({ type: "space" });
    } else {
      result.push({ type: "word", word: p });
    }
  }
  return result;
}

/* Einzelner Buchstabe mit "Cold Rise" Animation */
function Letter({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}): JSX.Element {
  if (children === " ") return <span>{" "}</span>;
  return (
    <motion.span
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={{ opacity: 0 }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.span>
  );
}

/* Nebelfelder – intensity: "low" | "med" | "high" (hier high als Default genutzt) */
function VaporField({ intensity = "high" as "low" | "med" | "high" }) {
  const cfg = {
    low:  { count: 3, baseO: 0.14, blur: 10, w: 150, h: 190 },
    med:  { count: 4, baseO: 0.18, blur: 12, w: 170, h: 210 },
    high: { count: 6, baseO: 0.26, blur: 14, w: 190, h: 240 },
  }[intensity];

  return (
    <>
      {Array.from({ length: cfg.count }).map((_, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            left: `${16 + i * (70 / cfg.count)}%`,
            bottom: `${7 + (i % 2) * 2}%`,
            width: `${cfg.w + i * 6}px`,
            height: `${cfg.h + i * 8}px`,
            background:
              "radial-gradient(40% 30% at 50% 90%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 35%, transparent 70%)",
            filter: `blur(${cfg.blur}px)`,
            mixBlendMode: "screen",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.0, cfg.baseO + 0.06, 0.0],
            y: [-12, -75 - i * 10, -130 - i * 14],
            scale: [1, 1.07, 1],
          }}
          transition={{
            duration: 6.5 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.55,
          }}
        />
      ))}
    </>
  );
}

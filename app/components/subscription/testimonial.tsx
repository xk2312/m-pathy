"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

/**
 * Testimonial Slider – "Cold Sublimation"
 * - Keine Worttrennung: Wörter bleiben ungebrochen.
 * - Aufbau leicht verlangsamt (~0.8x).
 * - Autoren mit beidseitigem Trennstrich — Name —.
 * - Manifest-konform (transform/opacity/filter only).
 */

export default function Testimonial() {
  const { t } = useLang();

  const items = useMemo(
    () => [
      { id: "gemini", quote: t("testimonials.gemini"), author: "— Gemini Apex —" },
      { id: "grok", quote: t("testimonials.grok"), author: "— Grok —" },
      { id: "gpt5", quote: t("testimonials.gpt5"), author: "— GPT-5 —" },
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

      <VaporField />

      <AnimatePresence mode="wait">
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
            className="text-[clamp(20px,3vw,34px)] leading-snug font-light text-white/92 frost-bloom"
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
            className="mt-[28px] text-[15px] text-white/55 tracking-wide"
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
      </AnimatePresence>

      <style jsx>{`
        .frost-bloom {
          text-shadow:
            0 0 0.6px rgba(255,255,255,0.9),
            0 0 8px rgba(255,255,255,0.18),
            0 0 18px rgba(255,255,255,0.10);
        }
        @media (prefers-reduced-motion: no-preference) {
          .frost-bloom {
            filter: drop-shadow(0 0 0.25rem rgba(255,255,255,0.12));
          }
        }
      `}</style>
    </section>
  );
}

/* Zerlegt Zitat in Wörter / Spaces / Zeilenumbrüche */
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

/* Einzelner Buchstabe mit "Cold Rise"-Bewegung */
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

/* Feine Nebelfahnen im Hintergrund */
function VaporField() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            left: `${20 + i * 18}%`,
            bottom: "8%",
            width: "180px",
            height: "220px",
            background:
              "radial-gradient(40% 30% at 50% 90%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 35%, transparent 70%)",
            filter: "blur(12px)",
            mixBlendMode: "screen",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.0, 0.22, 0.0],
            y: [-10, -70 - i * 8, -120 - i * 12],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.75,
          }}
        />
      ))}
    </>
  );
}

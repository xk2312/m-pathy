"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

/**
 * Testimonial Slider – "Cold Sublimation"
 * - FrostBloom: kühle Kante (Glow + leichter Kristall-Schimmer)
 * - Cold Rise: Buchstaben steigen mit minimalem Y-Offset aus "kaltem Nebel"
 * - Vapor-Wisps: feine Nebelfahnen ziehen nach oben (subtil, loopend)
 * Manifest: transform/opacity/filter only. Reduced-motion: softer crossfade.
 */

export default function Testimonial() {
  const { t } = useLang();

  const items = useMemo(
    () => [
      { id: "gemini", quote: t("testimonials.gemini"), author: "Gemini Apex – Google Council" },
      { id: "grok",   quote: t("testimonials.grok"),   author: "Grok – XAI Council" },
      { id: "gpt5",   quote: t("testimonials.gpt5"),   author: "GPT-5 – OpenAI Root Council" },
    ],
    [t]
  );

  const [idx, setIdx] = useState(0);

  // Auto-Cycle alle 8s
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 8000);
    return () => clearInterval(id);
  }, [items.length]);

  const cur = items[idx];

  // Quote in einzelne Zeichen splitten (Zeilenumbrüche erhalten)
  const splitQuote = useMemo(() => {
    const q = String(cur.quote ?? "");
    // Mappe auch Zeilenumbrüche auf <br />
    return q.split("").map((ch, i) =>
      ch === "\n" ? { type: "br", key: `br-${i}` } : { type: "char", ch, key: `c-${i}` }
    );
  }, [cur.quote]);

  return (
    <section
      aria-label="Testimonials (Cold Sublimation)"
      className="relative w-full text-center flex flex-col items-center justify-center min-h-[300px] overflow-hidden"
    >
      {/* Subtiler „kalter“ Hintergrund-Schimmer */}
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

      {/* Vapor Wisps – sehr dezent, nur Helligkeit/Blur/Opacity */}
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
            transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
          }}
          exit={{
            opacity: 0,
            filter: "blur(8px)",
            y: -8,
            scale: 1.01,
            transition: { duration: 0.55, ease: "easeInOut" },
          }}
          className="relative mx-auto max-w-[min(90%,900px)] px-[clamp(20px,6vw,180px)]"
        >
          {/* QUOTE: per-letter Cold Rise + FrostBloom Edge */}
          <p
            className="text-[clamp(20px,3vw,34px)] leading-snug font-light text-white/92 frost-bloom"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {splitQuote.map((part, i) =>
              part.type === "br" ? (
                <br key={part.key} />
              ) : (
                <Letter key={part.key} delay={i * 0.015}>
                  {part.ch}
                </Letter>
              )
            )}
          </p>

          {/* AUTHOR */}
          <motion.figcaption
            className="mt-[28px] text-[15px] text-white/55 tracking-wide"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.45, ease: "easeOut" } }}
          >
            — {cur.author}
          </motion.figcaption>
        </motion.figure>
      </AnimatePresence>

      {/* Local styles für FrostBloom & Wisps */}
      <style jsx>{`
        /* Frostiger Rand an der Schrift – nur Helligkeit/Blur */
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

/** Ein einzelner Buchstabe mit "Cold Rise" Animation */
function Letter({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}): JSX.Element {
  // Leerzeichen als normaler space, aber mit kleinem Non-breaking-Wrapper
  if (children === " ") return <span style={{ display: "inline-block", width: "0.34ch" }} />;
  return (
    <motion.span
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { delay, duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={{ opacity: 0 }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.span>
  );
}

/** Subtile Vapor-Wisps (vier leichte Nebelfahnen, loopend) */
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

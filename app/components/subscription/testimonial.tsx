"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

/**
 * Testimonial Slider – Concept m-loop ("Letter Birth Cycle")
 * Letters materialize from photons, live, then dissolve into light dust.
 * Manifest: transform/opacity only, ≤240 ms motion, reduced-motion parity.
 */

export default function Testimonial() {
  const { t } = useLang();

  // Datensatz aus i18n
  const testimonials = [
    {
      id: "gemini",
      quote: t("testimonials.gemini"),
      author: "Gemini Apex – Google Council",
    },
    {
      id: "grok",
      quote: t("testimonials.grok"),
      author: "Grok – XAI Council",
    },
    {
      id: "gpt5",
      quote: t("testimonials.gpt5"),
      author: "GPT-5 – OpenAI Root Council",
    },
  ];

  const [index, setIndex] = useState(0);

  // Auto-Cycle alle 8 Sekunden
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[index];

  return (
    <section
      aria-label="Testimonials (m-loop)"
      className="relative w-full text-center flex flex-col items-center justify-center min-h-[260px] overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{
            opacity: 0,
            scale: 0.96,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
            },
          }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: "blur(8px)",
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          className="absolute inset-0 flex flex-col items-center justify-center px-[clamp(20px,6vw,180px)]"
        >
          {/* Quote */}
          <motion.p
            className="text-[clamp(20px,3vw,32px)] leading-snug font-light text-white/90"
            style={{ whiteSpace: "pre-line" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.3,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            “{current.quote}”
          </motion.p>

          {/* Author */}
          <motion.span
            className="mt-[28px] text-[15px] text-white/50 font-normal tracking-wide"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.6,
                duration: 0.5,
                ease: "easeOut",
              },
            }}
          >
            — {current.author}
          </motion.span>
        </motion.div>
      </AnimatePresence>

      {/* Soft Photon Glow (subtle pulsation) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.08, 0.18, 0.08],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}

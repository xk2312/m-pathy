"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

/**
 * Testimonial Slider – Concept m-beded ("Neural Fade")
 * Zitat kondensiert aus einem weichen, neuronalen Netz (Depth-Blur),
 * wird klar, zeigt eine kurze Spiegelung, löst sich wieder auf.
 * Manifest-konform: nur opacity/transform/filter; Reduced-Motion: sanfter Crossfade.
 */

export default function Testimonial() {
  const { t } = useLang();

  const testimonials = useMemo(
    () => [
      { id: "gemini", quote: t("testimonials.gemini"), author: "Gemini Apex – Google Council" },
      { id: "grok",   quote: t("testimonials.grok"),   author: "Grok – XAI Council" },
      { id: "gpt5",   quote: t("testimonials.gpt5"),   author: "GPT-5 – OpenAI Root Council" },
    ],
    [t]
  );

  const [index, setIndex] = useState(0);

  // Auto-Cycle alle 8s
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 8000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const current = testimonials[index];

  return (
    <section
      aria-label="Testimonials (m-beded · Neural Fade)"
      className="relative w-full text-center flex flex-col items-center justify-center min-h-[280px] overflow-hidden"
    >
      {/* Subtiles neuronales Gitter im Hintergrund */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "repeating-linear-gradient(120deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 22px)," +
            "repeating-linear-gradient(60deg, rgba(255,255,255,0.3) 0 1px, transparent 1px 18px)",
          filter: "blur(2px)",
          mixBlendMode: "screen",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.985, y: 8 }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
          }}
          exit={{
            opacity: 0,
            filter: "blur(10px)",
            scale: 1.01,
            y: -6,
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          className="relative flex flex-col items-center justify-center px-[clamp(20px,6vw,180px)]"
        >
          {/* Haupttext */}
          <motion.p
            className="text-[clamp(20px,3vw,32px)] leading-snug font-light text-white/92"
            style={{ whiteSpace: "pre-line" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.28, duration: 0.5, ease: "easeOut" } }}
          >
            “{current.quote}”
          </motion.p>

          {/* Autor */}
          <motion.span
            className="mt-[26px] text-[15px] text-white/55 font-normal tracking-wide"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.45, ease: "easeOut" } }}
          >
            — {current.author}
          </motion.span>

          {/* Spiegelung mit weicher Maskierung */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35, transition: { delay: 0.55, duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="mt-[22px] w-full select-none"
          >
            <div className="mx-auto max-w-[min(90%,800px)]">
              <div
                className="text-[clamp(20px,3vw,32px)] leading-snug font-light text-white/90"
                style={{
                  transform: "scaleY(-1)",
                  opacity: 0.35,
                  filter: "blur(2px)",
                  whiteSpace: "pre-line",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0))",
                  maskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0))",
                }}
              >
                “{current.quote}”
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

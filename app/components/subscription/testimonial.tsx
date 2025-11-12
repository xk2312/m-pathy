"use client";

import { motion } from "framer-motion";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Testimonial() {
  const { t } = useLang();

  // Datenstruktur aus i18n-Dict
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

  return (
    <section
      aria-label="Testimonials"
      className="w-full text-center flex flex-col items-center gap-[clamp(40px,8vw,80px)]"
    >
      {testimonials.map(({ id, quote, author }) => (
        <motion.figure
          key={id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16 }}
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-[min(90%,800px)] mx-auto"
        >
          <blockquote className="text-[clamp(18px,2vw,26px)] leading-relaxed text-white/90 font-light">
            “{quote}”
          </blockquote>
          <figcaption className="mt-[clamp(16px,3vw,28px)] text-right text-white/60 text-[clamp(14px,1.4vw,18px)]">
            — {author}
          </figcaption>
        </motion.figure>
      ))}
    </section>
  );
}

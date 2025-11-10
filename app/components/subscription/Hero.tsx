"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Hero() {
  const { t } = useLang();
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Sanfte Parallaxe – respektiert prefers-reduced-motion
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      if (layer1.current) layer1.current.style.transform = `translate(${x}px, ${y}px) scale(1.01)`;
      if (layer2.current) layer2.current.style.transform = `translate(${-x}px, ${-y}px) scale(1.02)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Click-Ripple im CTA
  const ripple = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const btn = btnRef.current;
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const span = document.createElement("span");
    span.className = "hero-ripple";
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    btn.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  };

  return (
    <div
      className="
        relative w-full overflow-hidden
        pb-4 md:pb-6               /* kleiner Eigenabstand */
      "
    >
      {/* schlankere Glows, weniger Blur/Opacity */}
      <div
        ref={layer1}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-[90px] opacity-25 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle at 30% 40%, rgba(139,92,246,0.28), transparent 70%)" }}
      />
      <div
        ref={layer2}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 blur-[120px] opacity-22 motion-safe:animate-[pulse_12s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle at 70% 60%, rgba(34,211,238,0.18), transparent 65%)" }}
      />

      {/* Inhalt – kompakt, strikt zentriert */}
      <div className="relative z-10 mx-auto max-w-[900px] min-w-0 text-center">
        <h1
          className="
            text-[clamp(28px,5vw,56px)]          /* kleiner als vorher */
            font-semibold leading-[1.15] tracking-tight
            bg-gradient-to-b from-white to-white/70 text-transparent bg-clip-text
            transition-all duration-500
          "
        >
          {t("hero_title")}
        </h1>

        {/* Unterzeile bewusst klein & knapp (falls du sie gar nicht willst: entfernen) */}
        <p className="mt-2 md:mt-3 text-[15px] md:text-[17px] text-white/70">
          {t("hero_sub")}
        </p>

        {/* CTA – kompakter Wrapper + ausreichend Innenpadding */}
        <div className="mt-[36px] mb-[36px] md:mt-[48px] md:mb-[48px] flex w-full justify-center">
          <button
            ref={btnRef}
            type="button"
            aria-label={t("hero_cta")}
            onClick={ripple}
            onMouseUp={() => btnRef.current?.blur()}
            className="
              relative inline-flex items-center justify-center
              px-8 py-4 md:px-10 md:py-5        /* kompaktes Padding */
              text-[16px] md:text-[18px] font-semibold
              rounded-2xl text-black
              bg-[hsl(255,95%,75%)]
              shadow-[0_0_18px_rgba(180,150,255,0.30)]
              transition-transform duration-300
              motion-safe:hover:scale-[1.04]
              motion-safe:active:scale-[0.98]
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/80
            "
          >
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <span className="hero-shine" />
            </span>
            {t("hero_cta")}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.03); opacity: 0.4; }
        }
        .hero-shine {
          position: absolute;
          inset: -180%;
          background: linear-gradient(
            120deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.35) 50%,
            rgba(255,255,255,0) 100%
          );
          transform: translateX(-50%);
          animation: shine 3.2s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes shine {
          0% { transform: translateX(-60%) rotate(0.001deg); }
          50% { transform: translateX(60%) rotate(0.001deg); }
          100% { transform: translateX(-60%) rotate(0.001deg); }
        }
        .hero-ripple {
          position: absolute;
          width: 12px; height: 12px; border-radius: 9999px;
          transform: translate(-50%, -50%);
          background: rgba(255,255,255,0.8);
          animation: ripple 600ms ease-out forwards;
          pointer-events: none; mix-blend-mode: screen;
        }
        @keyframes ripple {
          0% { opacity: .5; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(16); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-shine { animation: none; }
        }
      `}</style>
    </div>
  );
}

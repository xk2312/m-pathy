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
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      if (layer1.current) layer1.current.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
      if (layer2.current) layer2.current.style.transform = `translate(${-x}px, ${-y}px) scale(1.03)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Click-Ripple auf dem CTA
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
        pb-[30px]   /* eigener Anstand nach unten */
      "
    >
      {/* Soft glows – werden geclippt, stören das Layout nicht */}
      <div
        ref={layer1}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-[120px] opacity-40 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(139,92,246,0.35), transparent 70%)",
        }}
      />
      <div
        ref={layer2}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 blur-[150px] opacity-35 motion-safe:animate-[pulse_12s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, rgba(34,211,238,0.25), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 blur-[180px] opacity-25 motion-safe:animate-[pulse_14s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 50% 80%, rgba(251,191,36,0.25), transparent 75%)",
        }}
      />

      {/* Inhalt – strikt zentriert, overflow-sicher */}
      <div className="relative z-10 mx-auto max-w-[1100px] min-w-0 text-center">
        <h1
          className="
            text-4xl sm:text-6xl font-semibold leading-tight tracking-tight
            bg-gradient-to-b from-white to-white/70 text-transparent bg-clip-text
            drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]
            transition-all duration-700
          "
        >
          {t("hero_title")}
        </h1>

        <p
          className="
            mt-3 sm:mt-5 text-base sm:text-lg text-white/70
            transition-opacity duration-700
          "
        >
          {t("hero_sub")}
        </p>

        {/* CTA – groß, atmend, brillant; Mobile first */}
        <div className="mt-8 sm:mt-10 flex w-full justify-center">
          <button
            ref={btnRef}
            type="button"
            aria-label={t("hero_cta")}
            onClick={ripple}
            onMouseUp={() => btnRef.current?.blur()}
            className="
              relative inline-flex items-center justify-center
              px-6 py-3 sm:px-8 sm:py-4
              text-base sm:text-lg font-semibold
              rounded-2xl
              text-black
              bg-[hsl(255,95%,75%)]
              shadow-[0_0_25px_rgba(180,150,255,0.35)]
              transition-transform duration-300
              motion-safe:hover:scale-[1.04]
              motion-safe:active:scale-[0.98]
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/80
            "
          >
            {/* Shine-Sweep */}
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <span className="hero-shine" />
            </span>
            {t("hero_cta")}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.5;
          }
        }
        /* Glänzender Sweep über dem Button */
        .hero-shine {
          position: absolute;
          inset: -200%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-50%);
          animation: shine 3.2s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes shine {
          0% {
            transform: translateX(-60%) rotate(0.001deg);
          }
          50% {
            transform: translateX(60%) rotate(0.001deg);
          }
          100% {
            transform: translateX(-60%) rotate(0.001deg);
          }
        }
        /* Click-Ripple innerhalb des Buttons */
        .hero-ripple {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.8);
          animation: ripple 600ms ease-out forwards;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        @keyframes ripple {
          0% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(18);
          }
        }
        /* Motion-Guard */
        @media (prefers-reduced-motion: reduce) {
          .hero-shine {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

"use client";
import { useLang } from "@/app/providers/LanguageProvider";
import { useEffect, useRef } from "react";

export default function Hero() {
  const { t } = useLang();
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);

  function log(evt: string, detail?: any) {
    try { window.dispatchEvent(new CustomEvent(evt, { detail })); } catch {}
  }

  // Sanfte Parallax-Reaktion
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      if (layer1.current) layer1.current.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
      if (layer2.current) layer2.current.style.transform = `translate(${-x}px, ${-y}px) scale(1.03)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Galactic Glow */}
      <div
        ref={layer1}
        aria-hidden
        className="absolute inset-0 -z-10 blur-[120px] opacity-40 animate-[pulse_10s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(139,92,246,0.35), transparent 70%)",
        }}
      />
      <div
        ref={layer2}
        aria-hidden
        className="absolute inset-0 -z-20 blur-[150px] opacity-35 animate-[pulse_12s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, rgba(34,211,238,0.25), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-30 blur-[180px] opacity-25 animate-[pulse_14s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 50% 80%, rgba(251,191,36,0.25), transparent 75%)",
        }}
      />

      {/* Inhalt */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h1
          id="top-title"
          className="text-4xl sm:text-6xl font-semibold leading-tight tracking-tight
                     bg-gradient-to-b from-white to-white/70 text-transparent bg-clip-text
                     drop-shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all duration-700"
        >
          {t("hero_title")}
        </h1>

        <p
          className="mt-3 sm:mt-5 text-base sm:text-lg text-white/70 
                     backdrop-blur-[1px] transition-opacity duration-700"
        >
          {t("hero_sub")}
        </p>

        <div className="mt-8 sm:mt-10">
          <a
            id="hero-cta"
            href="#showcases"
            aria-label={t("hero_cta")}
            onClick={() => log("hero_cta_click_oracle")}
            className="inline-flex items-center justify-center
                       px-7 py-3 sm:px-10 sm:py-4 text-base font-medium italic
                       rounded-2xl bg-[hsl(255,95%,75%)] text-black
                       shadow-[0_0_25px_rgba(180,150,255,0.35)]
                       transition-all duration-300 hover:scale-[1.03]
                       hover:shadow-[0_0_40px_rgba(180,150,255,0.55)]
                       active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
          >
            {t("hero_cta")}
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

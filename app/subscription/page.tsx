// app/(site)/subscription/page.tsx
"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";

// absolute, eindeutig auf app/components/**
import Hero from "@/app/components/subscription/Hero";
import ShowcaseCarousel from "@/app/components/subscription/ShowcaseCarousel";
import CouncilOrbit from "@/app/components/subscription/CouncilOrbit";
import ModesAuto from "@/app/components/subscription/ModesAuto";
import TrustPanel from "@/app/components/subscription/TrustPanel";
import FinalCTA from "@/app/components/subscription/FinalCTA";

export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => {
      document.documentElement.classList.remove("enable-scroll");
    };
  }, []);

  return (
    <LanguageProvider dict={dict}>
      {/* Grundgerüst: volle Breite für den Hintergrund, Inhalte immer zentriert */}
      <main className="min-h-dvh bg-black text-white selection:bg-white/20 antialiased">
        {/* ───────── Hero ─────────
            Top-Luft zentral hier; Hero selbst hat keine äußere Section */}
        <section
          id="top"
          className="pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-20 sm:pb-24 lg:pb-28"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
            <Hero />
          </div>
        </section>

        {/* ───────── Showcase (Tabs / Start Agency) ───────── */}
        <section
          id="showcases"
          className="relative py-16 sm:py-18 lg:py-20 overflow-visible motion-safe"
        >
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* 🌌 dekorative Galaxy, in der Breite begrenzt & mittig */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-12 sm:-top-16 z-0 w-[min(1100px,96vw)] h-[380px] sm:h-[480px] opacity-65"
            >
              <span
                className="absolute inset-0 mix-blend-screen blur-3xl"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgba(139,92,246,0.40) 0%, rgba(139,92,246,0.00) 62%)",
                }}
              />
              <span
                className="absolute inset-x-8 top-6 mix-blend-screen blur-3xl"
                style={{
                  background:
                    "radial-gradient(45% 45% at 60% 40%, rgba(34,211,238,0.28) 0%, rgba(34,211,238,0.00) 60%)",
                }}
              />
              <span
                className="absolute inset-x-16 top-10 mix-blend-screen blur-2xl"
                style={{
                  background:
                    "radial-gradient(40% 40% at 40% 55%, rgba(251,191,36,0.22) 0%, rgba(251,191,36,0.00) 60%)",
                }}
              />
            </div>

            {/* Inhalt sicher über der Galaxy und immer zentriert */}
            <div className="relative z-10 flex justify-center">
              <ShowcaseCarousel />
            </div>
          </div>
        </section>

        {/* ───────── Council ───────── */}
        <section id="council" className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
            <CouncilOrbit />
          </div>
        </section>

        {/* ───────── Modes ───────── */}
        <section id="modes" className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
            <ModesAuto />
          </div>
        </section>

        {/* ───────── Trust ───────── */}
        <section id="trust" className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
            <TrustPanel />
          </div>
        </section>

        {/* ───────── Final CTA ───────── */}
        <section id="cta" className="py-20 sm:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
            <FinalCTA />
          </div>
        </section>
      </main>
    </LanguageProvider>
  );
}

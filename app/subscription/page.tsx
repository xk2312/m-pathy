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
// import VariantsPreview from "@/app/components/cta/VariantsPreview"; // aktuell nicht sichtbar benötigt

export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => {
      document.documentElement.classList.remove("enable-scroll");
    };
  }, []);

  return (
    <LanguageProvider dict={dict}>
      <main className="min-h-dvh bg-black text-white selection:bg-white/20 antialiased">
        {/* ───────────────── Hero ───────────────── */}
        <section id="top" className="py-16 sm:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Hero />
          </div>
        </section>

        {/* ───────────────── Showcase (Tabs/Start Agency) ───────────────── */}
        <section
          id="showcases"
          className="relative py-12 sm:py-16 lg:py-20 overflow-visible motion-safe"
        >
          {/* zentrierter Container */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            {/* 🌌 Breathing Galaxy – dekorativ, hinter dem Content */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-10 sm:-top-14 z-0 w-[min(1100px,96vw)] h-[380px] sm:h-[480px] opacity-70"
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

            {/* Inhalt liegt sicher über der Galaxy */}
            <div className="relative z-10">
              <ShowcaseCarousel />
            </div>
          </div>
        </section>

        {/* ───────────────── Council ───────────────── */}
        <section id="council" className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <CouncilOrbit />
          </div>
        </section>

        {/* ───────────────── Modes ───────────────── */}
        <section id="modes" className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <ModesAuto />
          </div>
        </section>

        {/* ───────────────── Trust ───────────────── */}
        <section id="trust" className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <TrustPanel />
          </div>
        </section>

        {/* ───────────────── Final CTA ───────────────── */}
        <section id="cta" className="py-20 sm:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <FinalCTA />
          </div>
        </section>
      </main>
    </LanguageProvider>
  );
}

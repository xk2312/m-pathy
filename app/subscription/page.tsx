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
import VariantsPreview from "@/app/components/cta/VariantsPreview";


export default function SubscriptionPage(){
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => {
      document.documentElement.classList.remove("enable-scroll");
    };
  }, []);

  return (
    <LanguageProvider dict={dict}>
      <main className="min-h-dvh bg-black text-white selection:bg-white/20">
        {/* Anker für CSS :target und Hero-CTA */}

<section id="top" className="px-4 pt-20 sm:pt-28 pb-8 sm:pb-10">
  <Hero />
</section>

<section
  id="showcases"
  className="relative px-4 pt-12 sm:pt-16 pb-10 sm:pb-14"
>
  {/* 🌌 Breathing Galaxy (dekorativ, a11y-hidden) */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -inset-x-24 -top-20 h-[420px] sm:h-[520px] z-[-1] opacity-50"
  >
    {/* Violet core */}
    <span
      className="absolute inset-0 mix-blend-screen blur-3xl animate-pulse"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 50%, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.00) 60%)",
        animationDuration: "2600ms",
      }}
    />
    {/* Cyan halo */}
    <span
      className="absolute inset-x-10 top-10 mix-blend-screen blur-3xl animate-pulse"
      style={{
        background:
          "radial-gradient(45% 45% at 60% 40%, rgba(34,211,238,0.22) 0%, rgba(34,211,238,0.00) 60%)",
        animationDuration: "3200ms",
        animationDelay: "160ms",
      }}
    />
    {/* Warm accent */}
    <span
      className="absolute inset-x-24 top-16 mix-blend-screen blur-2xl animate-pulse"
      style={{
        background:
          "radial-gradient(40% 40% at 40% 55%, rgba(251,191,36,0.16) 0%, rgba(251,191,36,0.00) 60%)",
        animationDuration: "3400ms",
        animationDelay: "320ms",
      }}
    />
  </div>

  <ShowcaseCarousel />
</section>


        <section id="council" className="px-4 py-10 sm:py-14">
          <CouncilOrbit />
        </section>

        <section id="modes" className="px-4 py-10 sm:py-14">
          <ModesAuto />
        </section>

        <section id="trust" className="px-4 py-10 sm:py-14">
          <TrustPanel />
        </section>

        <section id="cta" className="px-4 py-10 sm:py-14">
          <FinalCTA />
        </section>
      </main>
    </LanguageProvider>
  );
}

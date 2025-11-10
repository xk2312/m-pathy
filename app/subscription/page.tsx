// app/subscription/page.tsx
"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";

// Komponenten (regeln ihr eigenes Layout & Motion)
import Hero from "@/app/components/subscription/Hero";
import ShowcaseCarousel from "@/app/components/subscription/ShowcaseCarousel";
import CouncilOrbit from "@/app/components/subscription/CouncilOrbit";
import ModesAuto from "@/app/components/subscription/ModesAuto";
import TrustPanel from "@/app/components/subscription/TrustPanel";
import FinalCTA from "@/app/components/subscription/FinalCTA";

export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => document.documentElement.classList.remove("enable-scroll");
  }, []);

  return (
    <LanguageProvider dict={dict}>
      {/* Rohes Schaufenster – alle Abstände/Container kommen aus app/subscription/layout.tsx */}
      <main>
        <section id="top">
          <Hero />
        </section>

        <section id="showcases">
          <ShowcaseCarousel />
        </section>

        <section id="council">
          <CouncilOrbit />
        </section>

        <section id="modes">
          <ModesAuto />
        </section>

        <section id="trust">
          <TrustPanel />
        </section>

        <section id="cta">
          <FinalCTA />
        </section>
      </main>
    </LanguageProvider>
  );
}

// app/(site)/subscription/page.tsx
"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";

// Komponenten (rendern ihr eigenes Layout & Motion)
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
      {/* Nur Grundgerüst + Container-Padding + Section-Gap */}
      <main className="min-h-dvh bg-black text-white selection:bg-white/20 antialiased">
        <div className="w-full px-[10px] py-[20px] lg:px-[90px] lg:py-[90px]">
          {/* Einheitlicher vertikaler Abstand zwischen den Sektionen */}
          <div className="space-y-[70px]">
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
          </div>
        </div>
      </main>
    </LanguageProvider>
  );
}

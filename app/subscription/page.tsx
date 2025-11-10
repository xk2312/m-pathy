"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";

// Komponenten
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
      {/* A11y-Skiplink erscheint nur bei Tastaturfokus */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:rounded-md focus:px-3 focus:py-2 focus:bg-white/10"
      >
        Skip to content
      </a>

      <main
        id="content"
        role="main"
        aria-label="Subscription"
        className="relative isolate min-h-dvh bg-black text-white selection:bg-white/20 antialiased"
      >
        {/* Flex-Wrapper erzwingt echte horizontale Zentrierung */}
        <div className="w-full flex justify-center">
          {/* Eltern-Container */}
          <div
            className="
              w-full max-w-[1280px]
              px-[clamp(10px,4vw,90px)] py-[clamp(20px,5vw,90px)]
              space-y-[clamp(48px,6vw,70px)]
              [&>section]:m-0
            "
          >
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

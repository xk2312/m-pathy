"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";

// Hintergrund
import VoiaBloom from "@/app/components/VoiaBloom";

// Aktive Kinder
import Hero from "@/app/components/subscription/Hero";
import CouncilOrbit from "@/app/components/subscription/CouncilOrbit";

// Inaktiv (kannst du später wieder einschalten)
// import ShowcaseCarousel from "@/app/components/subscription/ShowcaseCarousel";
// import ModesAuto from "@/app/components/subscription/ModesAuto";
// import TrustPanel from "@/app/components/subscription/TrustPanel";
// import FinalCTA from "@/app/components/subscription/FinalCTA";

export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => document.documentElement.classList.remove("enable-scroll");
  }, []);

  return (
    <LanguageProvider dict={dict}>
      <VoiaBloom />

      {/* A11y: Skiplink */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999]
                   focus:rounded-md focus:px-3 focus:py-2 focus:bg-white/10"
      >
        Skip to content
      </a>

      <main
        id="content"
        role="main"
        aria-label="Subscription"
        className="relative isolate z-10 min-h-dvh bg-transparent text-white selection:bg-white/20 antialiased"
      >
        {/* ===== Eltern-Container (Spacing-Board) ============================
             - gemeinsame Mittelachse (Sections & ihre Inhalte)
             - globaler vertikaler Rhythmus via space-y
             - gezielte Section-Guards (#top, #council)
           ================================================================= */}
        <div
          className="
            w-full max-w-[1280px] mx-auto
            px-[clamp(10px,4vw,90px)]
            py-[clamp(20px,5vw,90px)]
            space-y-[clamp(48px,6vw,70px)]
            [&>section]:m-0

            /* gemeinsame Mittelachse für alle Sections */
            [&>section]:flex [&>section]:justify-center
            [&>section>*]:w-full [&>section>*]:max-w-[900px]

            /* gezielte Section-Paddings */
            [&>section#top]:pb-[30px]         /* Hero unten 30px */
            [&>section#council]:pt-[60px]     /* Council oben 60px */
          "
        >
          {/* === Hero ====================================================== */}
          <section id="top">
            <Hero />
          </section>

          {/* === Council Orbit ============================================ */}
          <section id="council">
            <CouncilOrbit />
          </section>

          {/*
          <section id="showcases">
            <ShowcaseCarousel />
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
          */}
        </div>
      </main>
    </LanguageProvider>
  );
}

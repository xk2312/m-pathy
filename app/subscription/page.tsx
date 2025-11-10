"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";

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
        className="relative isolate min-h-dvh bg-black text-white selection:bg-white/20 antialiased overflow-x-hidden"
      >
        {/* PAGE FRAME */}
        <div className="w-full flex justify-center">
          {/* PAGE CONTAINER */}
          <div
            className="
              min-w-0 w-full max-w-[1280px]
              px-[clamp(10px,4vw,90px)] py-[clamp(20px,5vw,90px)]
              space-y-[clamp(48px,6vw,70px)]
              [&>section]:m-0
            "
          >
            {/* ===== Section 1: Hero ===== */}
            <section id="top" className="w-full flex justify-center overflow-x-hidden">
              <div className="min-w-0 w-full max-w-[1100px]">
                <Hero />
              </div>
            </section>

            {/* ===== Section 2: Carousel ===== */}
            <section id="showcases" className="w-full flex justify-center overflow-x-hidden">
              <div className="min-w-0 w-full max-w-[900px]">
                <ShowcaseCarousel />
              </div>
            </section>

            {/* ===== Section 3: CouncilOrbit (oft der Übeltäter) ===== */}
            <section id="council" className="w-full flex justify-center overflow-x-hidden">
              <div className="min-w-0 w-full max-w-[1100px]">
                <CouncilOrbit />
              </div>
            </section>

            {/* ===== Section 4: Modes ===== */}
            <section id="modes" className="w-full flex justify-center overflow-x-hidden">
              <div className="min-w-0 w-full max-w-[1100px]">
                <ModesAuto />
              </div>
            </section>

            {/* ===== Section 5: Trust ===== */}
            <section id="trust" className="w-full flex justify-center overflow-x-hidden">
              <div className="min-w-0 w-full max-w-[1100px]">
                <TrustPanel />
              </div>
            </section>

            {/* ===== Section 6: CTA ===== */}
            <section id="cta" className="w-full flex justify-center overflow-x-hidden">
              <div className="min-w-0 w-full max-w-[1100px]">
                <FinalCTA />
              </div>
            </section>
          </div>
        </div>
      </main>
    </LanguageProvider>
  );
}

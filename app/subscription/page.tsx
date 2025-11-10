"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";

import VoiaBloom from "@/app/components/VoiaBloom";

import Hero from "@/app/components/subscription/Hero";
import CouncilOrbit from "@/app/components/subscription/CouncilOrbit";

export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => document.documentElement.classList.remove("enable-scroll");
  }, []);

  return (
    <LanguageProvider dict={dict}>
      <VoiaBloom />

      <main
        id="content"
        role="main"
        className="relative isolate z-10 min-h-dvh bg-transparent text-white antialiased selection:bg-white/20"
      >
               {/* ELTERN: nur Container. Kein :where, keine Attribute, kein space-y.
            Alles pro Section EXPLIZIT. */}
        <div className="mx-auto w-full max-w-[1280px]
                        px-[clamp(10px,4vw,90px)]
                        pt-[64px] md:pt-[96px] pb-[clamp(20px,5vw,90px)]">
          
          {/* SECTION: HERO — Mitte, Breite via --page-max, unten 32px */}
          <section className="flex justify-center pb-[32px]">

            <div className="w-full" style={{ maxWidth: "var(--page-max)" }}>
              <Hero />
            </div>
          </section>

          {/* SECTION: COUNCIL — oben 32px, Mitte, Breite via --page-max */}
          <section className="flex justify-center pt-[32px]">
            <div className="w-full" style={{ maxWidth: "var(--page-max)" }}>
              <CouncilOrbit />
            </div>
          </section>


          {/* weitere Sections später hier explizit, gleiches Muster */}
        </div>
      </main>
    </LanguageProvider>
  );
}

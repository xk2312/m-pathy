// app/(site)/subscription/page.tsx
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

export const metadata = { title: "m-pathy.ai — Subscription" };

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
        <section id="top" className="px-4 py-10 sm:py-14">
          <Hero />
        </section>

        <section id="showcases" className="px-4 py-10 sm:py-14">
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

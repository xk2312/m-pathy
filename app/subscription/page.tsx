// app/(site)/subscription/page.tsx
"use client";

import { useEffect, PropsWithChildren } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";

// Inhalte
import Hero from "@/app/components/subscription/Hero";
import ShowcaseCarousel from "@/app/components/subscription/ShowcaseCarousel";
import CouncilOrbit from "@/app/components/subscription/CouncilOrbit";
import ModesAuto from "@/app/components/subscription/ModesAuto";
import TrustPanel from "@/app/components/subscription/TrustPanel";
import FinalCTA from "@/app/components/subscription/FinalCTA";

/* ──────────────────────────────────────────────────────────
   Layout-Primitives (einmal definieren, dann nicht anfassen)
   - Container: zentrale Breite + horizontale Paddings
   - Section: vertikale Luft (size-Varianten), liefert id/ARIA
   ────────────────────────────────────────────────────────── */

function Container({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
      {/* 1120px ≈ angenehm lesbar, nicht gequetscht, nicht zu breit */}
      {children}
    </div>
  );
}

function Section({
  id,
  size = "default",
  children,
}: PropsWithChildren<{ id: string; size?: "hero" | "default" | "loose" }>) {
  const pad =
    size === "hero"
      ? "pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-16 sm:pb-24 lg:pb-28"
      : size === "loose"
      ? "py-20 sm:py-24 lg:py-28"
      : "py-16 sm:py-20 lg:py-24";
  return (
    <section id={id} className={pad} aria-labelledby={`${id}-title`}>
      <Container>{children}</Container>
    </section>
  );
}

export default function SubscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");
    return () => {
      document.documentElement.classList.remove("enable-scroll");
    };
  }, []);

  return (
    <LanguageProvider dict={dict}>
      {/* Grundgerüst: bleibt stabil */}
      <main className="min-h-dvh bg-black text-white selection:bg-white/20 antialiased">
        {/* Hero: große Bühne */}
        <Section id="top" size="hero">
          {/* Komponenten liefern ihren Inhalt + Feintuning selbst */}
          <div className="flex justify-center">
            <Hero />
          </div>
        </Section>

        {/* Showcase: Tabs / Start Agency – Galaxy/Deko wird in der Komponente selbst gehandhabt */}
        <Section id="showcases">
          <div className="flex justify-center">
            <ShowcaseCarousel />
          </div>
        </Section>

        {/* Council */}
        <Section id="council">
          <div className="flex justify-center">
            <CouncilOrbit />
          </div>
        </Section>

        {/* Modes */}
        <Section id="modes">
          <div className="flex justify-center">
            <ModesAuto />
          </div>
        </Section>

        {/* Trust */}
        <Section id="trust">
          <div className="flex justify-center">
            <TrustPanel />
          </div>
        </Section>

        {/* Final CTA */}
        <Section id="cta" size="loose">
          <div className="flex justify-center">
            <FinalCTA />
          </div>
        </Section>
      </main>
    </LanguageProvider>
  );
}

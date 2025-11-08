// app/(site)/subscription/page.tsx
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { dict } from "@/lib/i18n";

// relative zu app/subscription → app/components/…
import Hero from "../components/subscription/Hero";
import ShowcaseCarousel from "../components/subscription/ShowcaseCarousel";
import CouncilOrbit from "../components/subscription/CouncilOrbit";
import ModesAuto from "../components/subscription/ModesAuto";
import TrustPanel from "../components/subscription/TrustPanel";
import FinalCTA from "../components/subscription/FinalCTA";

export const metadata = { title: "m-pathy.ai — Subscription" };

export default function SubscriptionPage(){
  return (
    <LanguageProvider dict={dict}>
      <main className="min-h-dvh bg-black text-white selection:bg-white/20">
        <Hero />
        <section className="px-4 py-10 sm:py-14">
          <ShowcaseCarousel />
        </section>
        <section className="px-4 py-10 sm:py-14">
          <CouncilOrbit />
        </section>
        <section className="px-4 py-10 sm:py-14">
          <ModesAuto />
        </section>
        <section className="px-4 py-10 sm:py-14">
          <TrustPanel />
        </section>
        <FinalCTA />
      </main>
    </LanguageProvider>
  );
}

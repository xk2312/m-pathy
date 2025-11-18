"use client";

import Navigation from "@/app/components/navigation/navigation";
import { LegalPageShell } from "@/app/components/legal/LegalPage";
import Footer from "@/app/components/subscription/footer";

export default function TermsPage() {
  return (
    <>
      <Navigation />

      {/* SUPER BUFFER – 382px */}
      <div aria-hidden="true" style={{ height: "var(--h-gap-xl)" }} />

      <LegalPageShell pageKey="terms" />

      <Footer />
    </>
  );
}

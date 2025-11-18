"use client";

import Navigation from "@/app/components/navigation/navigation";
import { LegalPageShell } from "@/app/components/legal/LegalPage";

export default function PrivacyPage() {
  return (
    <>
      <Navigation />

      <LegalPageShell pageKey="privacy" />

    </>
  );
}

"use client";

import Navigation from "@/app/components/navigation/navigation";
import { LegalPageShell } from "@/app/components/legal/LegalPage";

export default function LegalInfoPage() {
  return (
    <>
      <Navigation />


      <LegalPageShell pageKey="legal" />

    </>
  );
}

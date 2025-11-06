// components/LedgerStatusBadge.tsx
"use client";

import { useEffect, useState } from "react";

/**
 * LedgerStatusBadge – visualisiert den Zustand von /api/ledger/probe
 * - Grün = Ledger erreichbar & Tabellen vorhanden
 * - Gelb = Prüfen / Laden
 * - Rot  = Fehler oder nicht bereit
 */
export default function LedgerStatusBadge() {
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    let active = true;

    async function probe() {
      try {
        const res = await fetch("/api/ledger/probe", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        setStatus(data.ok ? "ok" : "error");
      } catch {
        if (active) setStatus("error");
      }
    }

    probe();
    const t = setInterval(probe, 30000); // alle 30 s neu prüfen
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);

  const color =
    status === "ok"
      ? "bg-green-500"
      : status === "error"
      ? "bg-red-500"
      : "bg-yellow-400";

  const text =
    status === "ok"
      ? "Ledger OK"
      : status === "error"
      ? "Ledger Warnung"
      : "Prüfe Ledger…";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-white text-sm font-medium shadow ${color}`}
    >
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      {text}
    </div>
  );
}

/*// Beispiel: app/page.tsx (oder page2)
import LedgerStatusBadge from "@/components/LedgerStatusBadge";

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Systemstatus</h1>
      <LedgerStatusBadge />
    </main>
  );
}*/

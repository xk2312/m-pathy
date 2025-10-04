"use client";

import React from "react";
import { t } from "@/lib/i18n";
import { logEvent } from "../../lib/auditLogger";

type Props = {
  /** Zusätzliche Klassen für Styling im Säulen-Layout */
  className?: string;
  /** Optional: Variantenschalter, falls du später anders stylen willst */
  variant?: "primary" | "ghost";
  /** Optionaler zusätzlicher Click-Handler */
  onClick?: () => void;
};

/** 
 * CTA-Button ohne fixed Overlay.
 * Für die Säule gedacht – Parent kümmert sich um Position/Styling.
 */
export default function TopCTA({ className = "", variant = "primary", onClick }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white hover:opacity-90 focus:ring-slate-400"
      : "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-300";

  const handleClick = () => {
    const text = t("startBuildingMsg");

    // System-Bubble auslösen
    try {
      window.dispatchEvent(
        new CustomEvent("mpathy:system-message", {
          detail: { kind: "mode", text, ts: new Date().toISOString() },
        })
      );
    } catch {
      /* silent */
    }

    // Audit-Log
    try {
      logEvent("cta_start_building_clicked", {});
    } catch {
      /* silent */
    }

    onClick?.();
  };

  return (
    <button
      type="button"
      aria-label={t("startBuilding")}
      onClick={handleClick}
      className={`${base} ${styles} ${className}`}
    >
      {t("startBuilding")}
    </button>
  );
}

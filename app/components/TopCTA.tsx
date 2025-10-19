"use client";

import React, { useEffect, useRef } from "react";
import { t } from "@/lib/i18n";
import { logEvent } from "../../lib/auditLogger";

type Props = {
  className?: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
};

/**
 * CTA-Button für die Säule – visuell akzentuiert mit sanftem Glow.
 */
export default function TopCTA({ className = "", variant = "primary", onClick }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

  // Breathing Glow Effekt (sanftes Pulsieren)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let glow = 0;
    let dir = 1;
    const loop = () => {
      glow += dir * 0.02;
      if (glow > 1 || glow < 0) dir *= -1;
      el.style.boxShadow = `0 0 ${8 + glow * 8}px rgba(0,255,255,${0.25 + glow * 0.35})`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => { el.style.boxShadow = "none"; };
  }, []);

  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(.2,.6,.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";
  const styles =
    variant === "primary"
      ? "bg-[rgba(0,255,255,0.10)] text-cyan-200 border border-[rgba(0,255,255,0.25)] hover:bg-[rgba(0,255,255,0.18)] hover:border-[rgba(0,255,255,0.35)]"
      : "bg-transparent border border-[rgba(255,255,255,0.15)] text-[rgba(230,240,243,0.95)] hover:bg-[rgba(255,255,255,0.08)]";

  const handleClick = () => {
    const text = t("startBuildingMsg");
    try {
      window.dispatchEvent(
        new CustomEvent("mpathy:system-message", {
          detail: { kind: "mode", text, ts: new Date().toISOString() },
        })
      );
    } catch {/* silent */}

    try { logEvent("cta_start_building_clicked", {}); } catch {/* silent */}
    onClick?.();
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-label={t("startBuilding")}
      onClick={handleClick}
      className={`${base} ${styles} ${className}`}
      style={{
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 0 12px rgba(0,255,255,0.25)",
      }}
    >
      {t("startBuilding")}
    </button>
  );
}

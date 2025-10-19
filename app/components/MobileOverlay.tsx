"use client";

import { useEffect, useRef, useCallback } from "react";
import Saeule from "./Saeule";
import { t } from "@/lib/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  /** optional: id eines Elements, das beim Öffnen fokussiert werden soll */
  initialFocusId?: string;
  /** optional: Systemmeldung nach außen reichen (passt zu onSystemMessage in deinem Layout) */
  onSystemMessage?: (content: string) => void;
};

export default function MobileOverlay({
  open,
  onClose,
  initialFocusId,
  onSystemMessage, // ← wird genutzt
}: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Systemmeldung aus Säule → Bubble senden + Overlay schließen (Desktop-Verhalten spiegeln)
  const closingRef = useRef(false);

const forwardSystemMessage = useCallback(
  (content: string) => {
    if (content && content.trim()) {
      onSystemMessage?.(content);
    }
    closingRef.current = true; // ← weitere Events ignorieren
    onClose();
  },
  [onSystemMessage, onClose]
);

// Reset beim Öffnen
useEffect(() => {
  if (open) closingRef.current = false;
}, [open]);

// ❌ Kein window.addEventListener mehr hier.
// Der Flow läuft ausschließlich über forwardSystemMessage → onSystemMessage (Prop).


  // Body-Scroll-Lock
  useEffect(() => {
    if (!open) return;
    const { overflow, position } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.position = "relative";
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.position = position;
    };
  }, [open]);

  // ESC schließt + rudimentäre Focus-Trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && drawerRef.current) {
        const f = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && active === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Initialer Fokus
  useEffect(() => {
    if (!open) return;
    const target =
      (initialFocusId && document.getElementById(initialFocusId)) ||
      drawerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    target?.focus();
  }, [open, initialFocusId]);

  if (!open) return null;

  return (
    <div
  aria-label={t("mobileOverlayLabel")}
  role="dialog"
  aria-modal="true"
  aria-describedby="mobile-overlay-desc"
  style={{ position: "fixed", inset: 0, zIndex: 120 }}
>
      {/* Scrim */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(2,6,23,0.6)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100dvh",
          width: "min(92vw, 420px)",
          background: "rgba(255,255,255,0.06)",
          borderRight: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          transform: "translateX(0)",
          transition: "transform 180ms ease",
          display: "flex",
          flexDirection: "column",
          padding: 12,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Kopfzeile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div id="mobile-overlay-desc" style={{ fontSize: 12, color: "#9fb3c8" }}>
            {t("mobileNav")}
          </div>
          <button
            onClick={onClose}
            aria-label="Overlay schließen"
            style={{
              minHeight: 44,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #314156",
              background: "#0b1220",
              color: "#e6f0f3",
              fontWeight: 700,
            }}
            >
            {t("close")}
          </button>
        </div>

        {/* Inhalt: identische Säulen-Struktur */}
<div
  data-overlay="true"
  style={{
    overflow: "auto",
    paddingBottom: "calc(12px + var(--safe-bottom))",
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
  }}
>
  {/* WICHTIG: Prop durchreichen → Bubble + Close bei Auswahl */}
  <Saeule onSystemMessage={forwardSystemMessage} />
</div>

      </div>
    </div>
    
  );
  
}

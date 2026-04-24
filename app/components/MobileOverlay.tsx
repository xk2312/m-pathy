"use client";

import { useEffect, useRef } from "react";
import Saeule from "./Saeule";

type Props = {
  open: boolean;
  onClose: () => void;
  onClearChat?: () => void;
  messages: any[];
};


export default function MobileOverlay({
  open,
  onClose,
  onClearChat,
  messages,                          // ← NEU
}: Props) {


  const drawerRef = useRef<HTMLDivElement>(null);

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

  if (!open) return null;

   return (
    <div
      aria-label="Mobile Overlay"
      role="dialog"
      aria-modal="true"
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
          width: "100dvw",
          // gleicher Raum wie Chat/Navi
          background: "#0c0c0c",
          // flach: keine harte Kante, kein Card-Schatten
          borderRight: "none",

          boxShadow: "none",
          transform: "translateX(0)",
          transition: "transform 180ms ease",
          display: "flex",
          flexDirection: "column",
          padding: 12,
          backdropFilter: "none",
        }}
      >

             {/* Kopfzeile – vorerst nur Close */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
            background: "#0c0c0c",          
          }}
        >
                   <button
          onClick={onClose}
          aria-label="Overlay schließen"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.6)",
            background: "transparent",
            color: "#e6f0f3",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",           // 👈 NEU
          }}
        >
          Close
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

    display: "flex",
    justifyContent: "center",
    paddingInline: 16,
  }}
>
  {/* WICHTIG: Prop durchreichen → Bubble + Close bei Auswahl */}
  <div
    style={{
      maxWidth: 320,
      width: "100%",
      margin: "0 auto",
    }}
  >
  <Saeule
  onClearChat={onClearChat}
  messages={messages}
/>

    </div>
  </div>
      </div>
    </div>
  );
}
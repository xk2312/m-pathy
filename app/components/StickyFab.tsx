"use client";

import { useEffect } from "react";

type Props = {
  onClick: () => void;
  /** Position des FAB auf dem Screen (default: "right") */
  position?: "left" | "right";
  /** Tooltip/Aria-Label (default: "Menü öffnen") */
  label?: string;
  /** Tastaturkürzel zum Öffnen (default: "Alt+M") */
  hotkey?: "Alt+M" | "None";
};

/**
 * Sticky Floating Action Button für Mobile
 * - Öffnet das Säulen-Overlay
 * - Respektiert Safe-Area (iOS)
 * - A11y-Fokus sichtbar, Screenreader-Label
 * - Hotkey: Alt+M (abschaltbar)
 */
export default function StickyFab({
  onClick,
  position = "right",
  label = "Menü öffnen",
  hotkey = "Alt+M",
}: Props) {
  useEffect(() => {
    if (hotkey !== "Alt+M") return;
    const onKey = (e: KeyboardEvent) => {
      // Hotkey nur auslösen, wenn nicht im Eingabefeld
      const tag = (e.target as HTMLElement | null)?.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement | null)?.isContentEditable;
      if (isTyping) return;

      if (e.altKey && (e.key.toLowerCase?.() === "m" || e.code === "KeyM")) {
        e.preventDefault();
        onClick();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClick, hotkey]);

  const sideStyle =
    position === "left"
      ? { left: "calc(env(safe-area-inset-left, 0px) + 16px)" }
      : { right: "calc(env(safe-area-inset-right, 0px) + 16px)" };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={hotkey === "Alt+M" ? `${label} (Alt+M)` : label}
      style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        ...sideStyle,
        zIndex: 70,
        width: 56,
        height: 56,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.22)",
        background: "linear-gradient(135deg,#60a5fa,#a78bfa)",
        color: "#0b1220",
        boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 160ms ease, filter 160ms ease, box-shadow 160ms ease",
      }}
      onMouseDown={(e) => e.currentTarget.classList.add("pressed")}
      onMouseUp={(e) => e.currentTarget.classList.remove("pressed")}
      onMouseLeave={(e) => e.currentTarget.classList.remove("pressed")}
      onTouchStart={(e) => e.currentTarget.classList.add("pressed")}
      onTouchEnd={(e) => e.currentTarget.classList.remove("pressed")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.currentTarget.classList.add("pressed");
        }
      }}
      onKeyUp={(e) => e.currentTarget.classList.remove("pressed")}
      // Fokusring (inline, damit ohne CSS-Dependencys)
      onFocus={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 0 2px #93c5fd, 0 0 0 6px rgba(147,197,253,.3), 0 10px 24px rgba(0,0,0,0.35)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.35)";
      }}
    >
      {/* Icon: „Menü / Säule“ */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        style={{ display: "block" }}
      >
        <path
          d="M4 6h16M4 12h16M4 18h10"
          stroke="#0b1220"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <style>
        {`
          button.pressed { transform: translateY(0.5px); filter: brightness(0.98); }
          @media (prefers-reduced-motion: reduce) {
            button { transition: none !important; }
          }
        `}
      </style>
    </button>
  );
}

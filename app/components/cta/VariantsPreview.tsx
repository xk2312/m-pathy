// app/components/subscription/VariantsPreview.tsx
"use client";

import { useEffect } from "react";

const buttons = [
  { id: "mode_onboarding", color: "#3B82F6", text: "mode_onboarding" },
  { id: "mode_research", color: "#10B981", text: "mode_research" },
  { id: "mode_m13", color: "#8B5CF6", text: "mode_m13" },
  { id: "mode_calm", color: "#60A5FA", text: "mode_calm" },
  { id: "mode_play", color: "#F59E0B", text: "mode_play" },
  { id: "mode_oracle", color: "#EC4899", text: "mode_oracle" },
  { id: "mode_joy", color: "#F87171", text: "mode_joy" },
  { id: "mode_vision", color: "#0EA5E9", text: "mode_vision" },
  { id: "mode_empathy", color: "#22C55E", text: "mode_empathy" },
  { id: "mode_love", color: "#E879F9", text: "mode_love" },
  { id: "mode_wisdom", color: "#A78BFA", text: "mode_wisdom", italic: true },
  { id: "mode_truth", color: "#1E293B", text: "mode_truth" },
  { id: "mode_peace", color: "#CBD5E1", text: "mode_peace" },
];

export default function VariantsPreview() {
  useEffect(() => {
    document.title = "Cta Variants Preview";
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "0.75rem",
        padding: "2rem",
      }}
    >
      {buttons.map(({ id, color, text, italic }) => (
        <a
          key={id}
          href="#"
          aria-label={text}
          onClick={(e) => e.preventDefault()}
          style={{
            backgroundColor: color,
            color: "#000",
            borderRadius: "1rem",
            padding: "0.75rem 1.25rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontStyle: italic ? "italic" : "normal",
            fontWeight: 500,
            fontFamily: "inherit",
            transition: "all 0.2s ease-in-out",
            transform: "translateY(0)",
            boxShadow: "0 1px 2px rgba(255, 255, 255, 0.15)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          {text}
        </a>
      ))}
    </div>
  );
}

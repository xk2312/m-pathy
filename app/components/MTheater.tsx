// components/MTheater.tsx
"use client";
import React from "react";
import { M_THEATER } from "@/config/mLogoConfig";

type Props = { children: React.ReactNode };

export default function MTheater({ children }: Props) {
  // mobile-first, dann per media query leicht größer
  return (
    <div
      aria-label="M Theater"
      style={{
        width: M_THEATER.mobile.width,
        height: M_THEATER.mobile.height,
        margin: "0 auto",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        padding: "1px 0",       // M hat oben/unten 30px Luft (vor Scaling)
        position: "relative",
        transform: "scale(0.7)", // gesamte Bühne auf 70 %
        transformOrigin: "center",
        willChange: "transform",
        isolation: "isolate",
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div[aria-label="M Theater"] {
            width: ${M_THEATER.tablet.width}px;
            height: ${M_THEATER.tablet.height}px;
          }
        }
        @media (min-width: 1024px) {
          div[aria-label="M Theater"] {
            width: ${M_THEATER.desktop.width}px;
            height: ${M_THEATER.desktop.height}px;
          }
        }
      `}</style>
      {children}
    </div>
  );
}

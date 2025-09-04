import "./global.css";
import "../styles/chat-prose.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../styles/input-bar.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "GalaxyEducation – TECH Beginner",
  description: "Learn tech basics with M",
};

// Mobile-Safe-Areas & Keyboard-Verhalten (iOS/Safari)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual", // vermeidet Layoutsprünge beim Keyboard
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-dvh bg-gradient-to-b from-blue-50 via-white to-blue-100 text-slate-900 antialiased`}
        style={{
          // ruhiger Scroll auf Mobile, verhindert Gummiband-Effekt
          overscrollBehaviorY: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {children}

        {/* Portal-Container für Overlays/Toasts (optional nutzbar) */}
        <div id="overlay-root" />

        {/* Safe-area Spacer (nur falls benötigt) */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            insetInline: 0,
            bottom: 0,
            height: "env(safe-area-inset-bottom, 0px)",
            pointerEvents: "none",
          }}
        />
      </body>
    </html>
  );
}

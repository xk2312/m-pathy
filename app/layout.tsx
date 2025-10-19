import "./global.css";
import "../styles/chat-prose.css";
// import "../styles/input-bar.css";

import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import LangAttrUpdater from "./components/LangAttrUpdater";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "GalaxyEducation – TECH Beginner",
  description: "Learn tech basics with M",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
      className={`${inter.className} min-h-dvh bg-gradient-to-b from-blue-50 via-white to-blue-100 text-slate-900 antialiased`}
      style={{ overscrollBehaviorY: "auto", WebkitTapHighlightColor: "transparent" }}
    >

        <LangAttrUpdater />
        <Providers>{children}</Providers>

        {/* Portal-Container für Overlays/Toasts */}
        <div id="overlay-root" />

        {/* Safe-area Spacer */}
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

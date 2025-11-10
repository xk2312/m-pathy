// app/layout.tsx  — neutral, ohne Theme/Prose
import "./global.css";
// ❌ keine globalen Prose-Styles hier importieren

import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import LangAttrUpdater from "./components/LangAttrUpdater";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "m-pathy – resonant creation",
  description: "Create your reality with M",
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
        className={`${inter.className} min-h-dvh antialiased`}
        style={{
          overscrollBehaviorY: "auto",
          WebkitTapHighlightColor: "transparent",
          margin: 0,
          padding: 0,
        }}
      >
        <LangAttrUpdater />
        <Providers>{children}</Providers>

        <div id="overlay-root" />

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

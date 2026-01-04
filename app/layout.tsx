"use client"

// app/layout.tsx — neutral, ohne Theme/Prose
import "./global.css"

import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"

import Providers from "./providers"
import LangAttrUpdater from "./components/LangAttrUpdater"
import ArchiveInit from "./components/system/ArchiveInit"
import ArchiveTrigger from "@/components/archive/ArchiveTrigger"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "m-pathy – resonant creation",
  description: "Create your reality with M",
  icons: {
    icon: "/favicon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
}

const ORB_THEME = "nexus-pearl"

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const isArchive = pathname.startsWith("/archive")

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-orb-theme={ORB_THEME}
    >
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
        <ArchiveInit />
        <ArchiveTrigger />

        {/* 🧠 App-Kontext — im Archiv AUS */}
        {!isArchive && (
          <Providers>{children}</Providers>
        )}

        {/* 🪟 Overlays (Archiv lebt hier weiter) */}
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
  )
}

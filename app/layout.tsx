/* ======================================================================
   FILE INDEX - app/layout.tsx
   ======================================================================

   ROLLE DER DATEI
   ----------------------------------------------------------------------
   Globale Root-Layout-Datei (Next.js App Router).
   Definiert:
   - HTML- und BODY-Struktur
   - globale Styles & Fonts
   - globale System-Initialisierung
   - Mount-Punkte für Overlays
   - App-weite Provider & Gates

   Diese Datei ist:
   - serverseitig gerendert (Server Component)
   - der erste Einstiegspunkt für alle Seiten
   - KEIN Teil der Feature-Logik (Archive/Reports)
   - aber ein zentraler Orchestrator für Initialisierung

   ----------------------------------------------------------------------
   GLOBALE IMPORTS
   ----------------------------------------------------------------------
   - global.css
   - design.tokens.css
   - next/font/google (Inter)
   - Providers (Context Layer)
   - LangAttrUpdater (HTML lang-Attribut)
   - ArchiveInit (System Bootstrap)
   - ArchiveTrigger (UI Trigger für Archive)
   - AppGate (Client-seitige Zugriffslogik)

   ----------------------------------------------------------------------
   METADATA / VIEWPORT
   ----------------------------------------------------------------------
   metadata:
     - title
     - description
     - favicon

   viewport:
     - device-width
     - initialScale
     - viewportFit = cover
     - interactiveWidget = resizes-visual

   ----------------------------------------------------------------------
   HTML / BODY KONFIGURATION
   ----------------------------------------------------------------------
   <html>
     - lang="en"
     - suppressHydrationWarning
     - data-orb-theme="nexus-pearl"

   <body>
     - Inter Font (className)
     - min-h-dvh
     - antialiased
     - Overscroll- und Touch-Defaults
     - Kein Margin / Padding

   ----------------------------------------------------------------------
   SYSTEM-KOMPONENTEN (GLOBAL)
   ----------------------------------------------------------------------
   <LangAttrUpdater />
     - synchronisiert Sprache zwischen App-State und <html>

   <ArchiveInit />
     - initialisiert Archive-Subsystem global
     - typischer Ort für:
         • Event-Registration
         • Storage-Checks
         • One-time Bootstraps

   <ArchiveTrigger />
     - stellt UI-Trigger bereit, um ArchiveOverlay zu öffnen
     - KEIN Rendering von Archive selbst

   ----------------------------------------------------------------------
   APP-GATE / PROVIDERS
   ----------------------------------------------------------------------
   <Providers>
     - stellt globale React-Contexts bereit
       (Theme, Language, etc.)

   <AppGate>
     - clientseitige Entscheidungslogik:
         • Auth
         • Access
         • Gating
     - umschließt alle Page-Children

   ----------------------------------------------------------------------
   OVERLAY-INFRASTRUKTUR
   ----------------------------------------------------------------------
   <div id="overlay-root" />
     - zentraler Mount-Punkt für Overlays
     - ArchiveOverlay wird hier typischerweise eingehängt
     - KEINE Logik, nur DOM-Knoten

   Safe-Area-Div (aria-hidden)
     - iOS / Mobile Safe-Area Ausgleich
     - rein visuell

   ----------------------------------------------------------------------
   RELEVANZ FÜR REPORTS-PROBLEM
   ----------------------------------------------------------------------
   - Diese Datei:
       ❌ liest KEINE Reports
       ❌ schreibt KEINE Reports
       ❌ rendert KEINE ReportList
   - Sie beeinflusst Reports NUR indirekt über:
       • ArchiveInit (Initialisierung)
       • overlay-root (Mount-Ort)
       • AppGate (Client-Zugriff)

   - Fehler hier würden sich äußern als:
       • Overlay erscheint gar nicht
       • Archive öffnet nicht
       • Hydration-Probleme
     NICHT als „No reports“.

   ----------------------------------------------------------------------
   AUSSCHLUSS
   ----------------------------------------------------------------------
   ❌ Keine Feature-Logik
   ❌ Kein Zugriff auf verificationStorage
   ❌ Kein Mode-Switch
   ❌ Keine Datenfilterung

   ====================================================================== */

// app/layout.tsx - SERVER COMPONENT (FIXED)
import "./global.css"
import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Providers from "./providers"
import LangAttrUpdater from "./components/LangAttrUpdater"
import ArchiveInit from "./components/system/ArchiveInit"
import ArchiveTrigger from "@/components/archive/ArchiveTrigger"
import AppGate from "./components/system/AppGate" // 👈 NEU
import "../styles/design.tokens.css"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "m-pathy",
  description: "Professional AI workspace and governance infrastructure.",
  icons: { icon: "/favicon.ico" },
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

        {/* 🧠 App-Gate entscheidet clientseitig */}
        <Providers>
          <AppGate>{children}</AppGate>
        </Providers>

        {/* 🪟 Overlays */}
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

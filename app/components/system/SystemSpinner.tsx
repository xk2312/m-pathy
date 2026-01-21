/* ======================================================================
   FILE INDEX - SystemSpinner.tsx
   MODE: GranularFileIndexDeveloper · CodeForensik
   SCOPE: UI-LOCK · LOADING INDICATOR · MOTION-SAFE
   STATUS: IST-ZUSTAND (KANONISCH, OHNE INTERPRETATION)
   ======================================================================

   1. ROLLE DER DATEI
   ----------------------------------------------------------------------
   Diese Datei implementiert den globalen visuellen System-Spinner.

   Sie ist:
   - rein präsentational
   - zustandslos
   - deterministisch
   - unabhängig von Business-Logik

   → Der Spinner selbst ist NICHT fehlerhaft.
     Er wird lediglich nicht korrekt beendet.


   2. KOMPONENTEN-SIGNATUR
   ----------------------------------------------------------------------
   type Props = {
     size?: number
   }

   export default function SystemSpinner({ size = 32 })

   Bedeutung:
   - Größe optional
   - Default: 32px

   TODO-RELEVANZ:
   - Keine
   - Größe & API sind stabil


   3. SVG-STRUKTUR
   ----------------------------------------------------------------------
   <svg
     width={size}
     height={size}
     viewBox="0 0 50 50"
     role="status"
     aria-label="System working"
     className="system-spinner"
   >

   Bedeutung:
   - ARIA-konform
   - geeignet für Screenreader
   - semantisch korrekt als Statusindikator

   TODO-RELEVANZ:
   - Keine funktionale Relevanz
   - Accessibility ist korrekt umgesetzt


   4. ANIMATION
   ----------------------------------------------------------------------
   CSS:
   - animation: spin 1.4s linear infinite

   @keyframes spin:
   - 360° Rotation

   Motion Safety:
   - prefers-reduced-motion: reduce → animation: none

   TODO-RELEVANZ:
   - Spinner respektiert Systempräferenzen
   - Keine Abhängigkeit vom Flow


   5. STYLING
   ----------------------------------------------------------------------
   Farbe:
   - var(--color-cyan, #53e9fd)

   Einbettung:
   - Scoped via styled-jsx

   TODO-RELEVANZ:
   - Keine
   - Spinner ist visuell korrekt


   6. BEZIEHUNG ZUM FEHLER
   ----------------------------------------------------------------------
   WICHTIG:
   - Diese Komponente kennt KEINEN State
   - Sie weiß NICHT, wann sie beendet werden soll
   - Sie wird ausschließlich über
     `isPreparing` in ArchiveOverlay.tsx gesteuert

   Fehlerursache:
   - Spinner bleibt sichtbar,
     weil `setIsPreparing(false)` nie aufgerufen wird
   - NICHT wegen eines Fehlers in dieser Datei


   7. ZUSAMMENFASSUNG (KANONISCH)
   ----------------------------------------------------------------------
   - SystemSpinner.tsx ist korrekt
   - Kein Umbau erforderlich
   - Keine ToDo-Stellen im Code selbst

   → Alle ToDos liegen AUSSERHALB dieser Datei
     (State- & Flow-Steuerung)

   ====================================================================== */

'use client'

import React from 'react'

type Props = {
  size?: number
}

export default function SystemSpinner({ size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      role="status"
      aria-label="System working"
      className="system-spinner"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 150"
      />
      <style jsx>{`
        .system-spinner {
          color: var(--color-cyan, #53e9fd);
          animation: spin 1.4s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .system-spinner {
            animation: none;
          }
        }
      `}</style>
    </svg>
  )
}

/* ======================================================================
FILE INDEX — MobileOverlay.tsx
Zweck: Mobiles Drawer-Overlay für Saeule (Modes, Experts, Actions)
Kontext: Mobile Navigation / Archiv-Zugriff / Overlay-Schließlogik

RELEVANT FÜR AKTUELLEN FIX (Fix 2):
- Beim Klick auf „Archiv“ soll sich das Mobile Overlay automatisch schließen
- Aktuell ist ein manuelles Schließen (X / Scrim) nötig

----------------------------------------------------------------------
I. ÖFFNUNGS- & SCHLIESSSTEUERUNG
----------------------------------------------------------------------

[Prop: open]
- Bedeutung:
  Steuert, ob das MobileOverlay gerendert wird.
- Verwendung:
  if (!open) return null;
- Relevanz:
  Overlay kann ausschließlich über onClose geschlossen werden.

[Prop: onClose]
- Bedeutung:
  Zentrale Schließfunktion des Overlays (State liegt außerhalb).
- Verwendung:
  - Scrim-Klick
  - Close-Button
  - ESC-Key
  - forwardSystemMessage()

----------------------------------------------------------------------
II. ZENTRALE SCHLIESSBRÜCKE (SÄULE → OVERLAY)
----------------------------------------------------------------------

[Function: forwardSystemMessage]
- Signatur:
  const forwardSystemMessage = useCallback((content: string) => { ... })

- Verhalten:
  1) Optionales Weiterleiten einer Systemmeldung
  2) Setzt closingRef.current = true
  3) Ruft onClose() → Overlay schließt sofort

- Relevanz:
  Dies ist der EINZIGE vorgesehene Pfad,
  über den Saeule das MobileOverlay programmgesteuert schließen kann.

----------------------------------------------------------------------
III. SCHUTZMECHANISMUS GEGEN MEHRFACH-CLOSE
----------------------------------------------------------------------

[Ref: closingRef]
- Bedeutung:
  Verhindert Mehrfach-Events / Race Conditions beim Schließen
- Reset:
  useEffect(() => { if (open) closingRef.current = false; }, [open])

----------------------------------------------------------------------
IV. OVERLAY-KONTEXT-MARKER
----------------------------------------------------------------------

[data-overlay="true"]
- Stelle:
  <div data-overlay="true"> … </div>

- Bedeutung:
  Dient Saeule.tsx zur Erkennung:
  „Ich befinde mich gerade in einem Mobile Overlay“

- Relevanz:
  Saeule prüft aktiv:
    document.querySelector('[data-overlay="true"]')

----------------------------------------------------------------------
V. EINBINDUNG DER SÄULE
----------------------------------------------------------------------

[Saeule-Integration]
- Stelle:
  <Saeule onSystemMessage={forwardSystemMessage} … />

- Bedeutung:
  Jede Aktion in der Saeule, die onSystemMessage("") auslöst,
  führt im Mobile-Kontext zu:
    → forwardSystemMessage
    → onClose()
    → Overlay schließt

- Relevanz für Fix 2:
  Archiv-Navigation schließt das Overlay nur,
  wenn sie diesen Kanal nutzt.

----------------------------------------------------------------------
VI. WAS HIER NICHT PASSIERT
----------------------------------------------------------------------

- Kein Listener auf Router-Events
- Kein Listener auf Archiv-State
- Kein window.addEventListener für Navigation
- Kein automatisches Close bei View-Wechseln außerhalb der Saeule

----------------------------------------------------------------------
VII. FAZIT (NEUTRAL)
----------------------------------------------------------------------

MobileOverlay.tsx bietet eine saubere,
explizite Close-Schnittstelle über onSystemMessage.

Damit sich das Overlay beim Öffnen des Archivs schließt,
muss der Archiv-Trigger diesen Kanal erreichen
oder onClose direkt auslösen.

====================================================================== */

"use client";

import { useEffect, useRef, useCallback } from "react";
import Saeule from "./Saeule";
import { t } from "@/lib/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  initialFocusId?: string;
  onSystemMessage?: (content: string) => void;
  onClearChat?: () => void;
  messages: any[];                    // ← NEU (required)
};


export default function MobileOverlay({
  open,
  onClose,
  initialFocusId,
  onSystemMessage,
  onClearChat,
  messages,                           // ← NEU
}: Props) {


  const drawerRef = useRef<HTMLDivElement>(null);

  // Systemmeldung aus Säule → Bubble senden + Overlay schließen (Desktop-Verhalten spiegeln)
  const closingRef = useRef(false);

const forwardSystemMessage = useCallback(
  (content: string) => {
    if (content && content.trim()) {
      onSystemMessage?.(content);
    }
    closingRef.current = true; // ← weitere Events ignorieren
    onClose();
  },
  [onSystemMessage, onClose]
);

// Reset beim Öffnen
useEffect(() => {
  if (open) closingRef.current = false;
}, [open]);

// ✅ FIX 2: Overlay schließen bei Navigation weg vom Chat (z. B. ins Archiv)
useEffect(() => {
  if (!open) return;

  const onLocationChange = () => {
    try {
      if (!window.location.pathname.includes("/chat")) {
        onClose();
      }
    } catch {}
  };

  window.addEventListener("popstate", onLocationChange);
  window.addEventListener("pushstate", onLocationChange as EventListener);
  window.addEventListener("replacestate", onLocationChange as EventListener);

  return () => {
    window.removeEventListener("popstate", onLocationChange);
    window.removeEventListener("pushstate", onLocationChange as EventListener);
    window.removeEventListener("replacestate", onLocationChange as EventListener);
  };
}, [open, onClose]);


// ▼ Overlay-Open → i18n auf Browser-Sprache synchronisieren (nur wenn abweichend)
useEffect(() => {
  if (!open) return;
  try {
    const nav = (navigator.language || (navigator as any).userLanguage || "en")
      .split("-")[0].toLowerCase();
    const root = document.documentElement;
    const prev = (root.getAttribute("lang") || "").toLowerCase();
    if (nav && prev !== nav) {
      root.setAttribute("lang", nav);
      window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: nav } }));
    }
  } catch { /* silent */ }
}, [open]);


// ❌ Kein window.addEventListener mehr hier.
// Der Flow läuft ausschließlich über forwardSystemMessage → onSystemMessage (Prop).


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

  // Initialer Fokus
  useEffect(() => {
    if (!open) return;
    const target =
      (initialFocusId && document.getElementById(initialFocusId)) ||
      drawerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    target?.focus();
  }, [open, initialFocusId]);

  if (!open) return null;

   return (
    <div
      aria-label={t("mobileOverlayLabel")}
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
          background: "#1E2024",
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
            background: "#1E2024",
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
          {t("close")}
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
  onSystemMessage={forwardSystemMessage}
  onClearChat={onClearChat}
  messages={messages}                 // ← FIX
/>

  </div>
</div>

      </div>
    </div>
    
  );
  
}


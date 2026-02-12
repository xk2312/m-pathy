"use client";

import { useEffect, useState } from "react";
import Saeule from "./Saeule";

/* ======================================================================
   Props & Hook
   ====================================================================== */
type Props = {
  onSystemMessage?: (content: string) => void;
  onClearChat?: () => void;
  canClear?: boolean;
  messages: any[]; // ⬅︎ NEU: wird nur durchgereicht
  setInput: (value: string) => void;
};


/** Reagiert auf Desktop/Mobile - reagiert sanft mit MatchMedia */
function useIsDesktop(minWidth = 1024) {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") return true; // SSR-Fallback: Desktop
    return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const onChange = () => setIsDesktop(mq.matches);

    mq.addEventListener?.("change", onChange);
    // Safari-Fallback
    // @ts-ignore
    mq.addListener?.(onChange);

    return () => {
      mq.removeEventListener?.("change", onChange);
      // @ts-ignore
      mq.removeListener?.(onChange);
    };
  }, [minWidth]);

  return isDesktop;
}

/* ======================================================================
   Component
   ====================================================================== */

export default function SidebarContainer({
  onSystemMessage,
  onClearChat,
  canClear,
  messages,
  setInput,
}: Props)
 {

  // Breakpoint an page2/useBreakpoint angleichen:
  // Desktop = alles, was NICHT isMobile (>= 769px) ist
  const isDesktop = useIsDesktop(768);

    return (
    <aside
      aria-label="Sidebar Container"

      data-test="sidebar-container"
      /* KEIN display: contents – Containing-Block bleibt stabil */
      style={{
        cursor: "pointer",
        pointerEvents: "auto",
        height: "100%",              // ← Säule darf volle Rail-Höhe einnehmen
        display: "flex",
        flexDirection: "column",
      }}
    >

       {isDesktop ? (
                /* Desktop: Sticky kommt vom Parent in page.tsx */
        <div
          style={{
            position: "static",
            alignSelf: "stretch",
            zIndex: "var(--z-base, 1)",
            height: "100%",            // ← Wrapper füllt die sticky-Rail
            display: "flex",
            flexDirection: "column",
          }}
        >
         <Saeule
  onSystemMessage={onSystemMessage}
  onClearChat={onClearChat}
  canClear={canClear}
  messages={messages}
  setInput={setInput}
/>



        </div>
      ) : (

        /* Mobile: Platzhalter */

        <div
          aria-hidden="true"
          data-test="sidebar-mobile-placeholder"
          style={{
            minHeight: 0,
            opacity: 0.5,
            cursor: "default",
          }}
        />
      )}
    </aside>
  );
}

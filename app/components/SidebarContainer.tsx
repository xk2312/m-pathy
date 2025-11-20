"use client";

import { useEffect, useState } from "react";
import Saeule from "./Saeule";

/* ======================================================================
   Props & Hook
   ====================================================================== */
type Props = {
  onSystemMessage?: (content: string) => void;
  onClearChat?: () => void;   // ⬅︎ neu – wird an Saeule weitergereicht
  canClear?: boolean;         // ⬅︎ optional – falls benötigt
};

/** Reagiert auf Desktop/Mobile — reagiert sanft mit MatchMedia */
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
}: Props) {
  const isDesktop = useIsDesktop(1024);

  return (
    <aside
      aria-label="Sidebar Container"
      data-test="sidebar-container"
      /* KEIN display: contents – Containing-Block bleibt stabil */
      style={{
        cursor: "pointer",
        pointerEvents: "auto",
      }}
    >
      {isDesktop ? (
                /* Desktop: Sticky kommt vom Parent in page.tsx */
        <div
          style={{
            position: "static",
            alignSelf: "start",
            zIndex: "var(--z-base, 1)",
          }}
        >
          <Saeule
            onSystemMessage={onSystemMessage}
            onClearChat={onClearChat}   // ⬅︎ Leitung zum Clear-Handler
            canClear={canClear}         // ⬅︎ optional
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

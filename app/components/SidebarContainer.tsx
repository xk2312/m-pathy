"use client";

import { useEffect, useState } from "react";
import Saeule from "./Saeule";

/* ======================================================================
   Props & Hook
   ====================================================================== */
type Props = {
  onSystemMessage?: (content: string) => void;
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

export default function SidebarContainer({ onSystemMessage }: Props) {
  const isDesktop = useIsDesktop(1024);

  return (
    <aside
      aria-label="Sidebar Container"
      data-test="sidebar-container"
      style={{
        display: "contents",
        cursor: "pointer",              // 🔹 Pointer über vererbbare Ebene
        pointerEvents: "auto",          // 🔹 erlaubt Interaktion überall
      }}
    >
            {isDesktop ? (
        /* Desktop: Säule wird vom Parent gestickt */
        <div
          style={{
            position: "static",
            alignSelf: "start",
            zIndex: "var(--z-base, 1)",
          }}
        >
          <Saeule onSystemMessage={onSystemMessage} />
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

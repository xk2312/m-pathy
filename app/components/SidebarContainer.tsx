"use client";

import { useEffect, useState } from "react";
import Saeule from "./Saeule";

type Props = {
  onSystemMessage?: (content: string) => void;
};

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
    // Safari/Legacy fallback
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

export default function SidebarContainer({ onSystemMessage }: Props) {
  const isDesktop = useIsDesktop(1024);

  return (
    <aside
      aria-label="Sidebar Container"
      data-test="sidebar-container"
      style={{ display: "contents" }} // übernimmt Layout vom Parent
    >
      {isDesktop ? (
        // Desktop: Säule statisch anzeigen
        <Saeule onSystemMessage={onSystemMessage} />
      ) : (
        // Mobile: Overlay/StickyFab folgen in Schritt 4/5
        <div aria-hidden="true" data-test="sidebar-mobile-placeholder" />
      )}
    </aside>
  );
}

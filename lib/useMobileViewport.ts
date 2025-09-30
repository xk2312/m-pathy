import { useEffect } from "react";

export function useMobileViewport(target: HTMLElement | null) {
  useEffect(() => {
    const docEl = document.documentElement as HTMLElement;

    function apply() {
      const vv = (window as any).visualViewport;
      if (vv) {
        const vh = vv.height * 0.01;
        docEl.style.setProperty("--vh", `${vh}px`);
        // iOS notches etc.
        const safeBottom = getComputedStyle(docEl).getPropertyValue("env(safe-area-inset-bottom)") || "0px";
        docEl.style.setProperty("--safe-bottom", safeBottom.trim() || "0px");
        // Portrait/Landscape Cap
        const isLandscape = vv.width > vv.height;
        docEl.style.setProperty("--dock-cap", isLandscape ? "22vh" : "30vh");
      }
    }

    apply();

    const vv = (window as any).visualViewport;
    vv?.addEventListener("resize", apply);
    vv?.addEventListener("scroll", apply); // iOS keyboard pans

    return () => {
      vv?.removeEventListener("resize", apply);
      vv?.removeEventListener("scroll", apply);
    };
  }, [target]);
}

"use client";

import { useEffect, useRef } from "react";

type TurnstileProps = {
  siteKey?: string;
  onSuccess: (token: string) => void;
};

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function Turnstile({ siteKey, onSuccess }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!siteKey || typeof siteKey !== "string") return;

    const render = () => {
      if (!window.turnstile) return;
      if (!siteKey || typeof siteKey !== "string") return;

      window.turnstile.render(ref.current!, {
        sitekey: siteKey,
        callback: onSuccess,
      });
    };

    if (window.turnstile) {
      render();
      return;
    }

    const existing = document.getElementById("cf-turnstile-api");
    if (existing) {
      existing.addEventListener("load", render, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "cf-turnstile-api";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = render;
    document.body.appendChild(script);
  }, [siteKey, onSuccess]);

  return <div ref={ref} />;
}

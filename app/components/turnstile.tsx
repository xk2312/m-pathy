"use client";

import { useEffect, useRef } from "react";

type TurnstileProps = {
  siteKey: string;
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

    const render = () => {
      if (!window.turnstile) return;

      window.turnstile.render(ref.current!, {
        sitekey: siteKey,
        callback: onSuccess,
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = render;
      document.body.appendChild(script);
    }
  }, [siteKey, onSuccess]);

  return <div ref={ref} />;
}

"use client";

import { useEffect } from "react";

type Props = {
  onHiddenPrompt: (prompt: string) => void | Promise<void>;
};

export default function HiddenPromptBridge({ onHiddenPrompt }: Props) {
  useEffect(() => {
    const handleHiddenPrompt = async (
      e: Event
    ) => {
      const detail = (e as CustomEvent<{ prompt?: string }>).detail;
      const prompt = String(detail?.prompt ?? "").trim();

      if (!prompt) return;

      try {
        await onHiddenPrompt(prompt);
      } catch (err) {
        console.error("[HiddenPromptBridge] failed", err);
      }
    };

    window.addEventListener("mpathy:hidden-prompt", handleHiddenPrompt);

    return () => {
      window.removeEventListener("mpathy:hidden-prompt", handleHiddenPrompt);
    };
  }, [onHiddenPrompt]);

  return null;
}
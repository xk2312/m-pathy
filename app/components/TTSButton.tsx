"use client";

import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { speak, stop, supported } from "@/lib/tts";

type Props = { text: string; className?: string };

export default function TTSButton({ text, className }: Props) {
  const [busy, setBusy] = useState(false);
  const labelRead = t("readAloud") || "Read aloud";
  const labelStop = t("stop") || "Stop";

  useEffect(() => () => stop(), []);

  if (!text || !text.trim()) return null;
  if (!supported()) {
    // Kein UI-Lärm: nur nix anzeigen, falls nicht unterstützt
    return null;
  }

  return (
    <button
      type="button"
      aria-pressed={busy}
      aria-label={busy ? labelStop : labelRead}
      onClick={() => {
        if (busy) { stop(); setBusy(false); return; }
        speak(text, {}, () => setBusy(false));
        setBusy(true);
      }}
      className={className}
      style={{
        marginTop: 8,
        alignSelf: "flex-start",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.16)",
        background: busy ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
        color: "#e6f0f3",
        padding: "6px 10px",
        fontWeight: 700,
        fontSize: 12,
        cursor: "pointer"
      }}
    >
      {busy ? "⏹ " + labelStop : "🔊 " + labelRead}
    </button>
  );
}
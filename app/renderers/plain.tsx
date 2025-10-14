// components/renderers/plain.tsx
"use client";
import React from "react";

export default function renderPlain(input: {
  role: "user" | "assistant" | "system";
  content: string;
  format?: "plain";
  meta?: Record<string, unknown>;
}): React.ReactNode {
  return (
    <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {input.content}
    </span>
  );
}

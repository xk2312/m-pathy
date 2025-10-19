import React from 'react';

// Kleiner, sicherer Plain-Text-Renderer.
// Zeigt Inhalte 1:1 an, erhält Zeilenumbrüche und bricht lange Wörter um.
// Keine Hooks, keine Side-Effects – Server/Client-kompatibel.

export type RenderInput = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  meta?: Record<string, unknown>;
};

export function renderPlain({ content }: RenderInput): React.ReactNode {
  return (
    <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{content}</span>
  );
}

export default renderPlain; 
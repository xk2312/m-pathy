'use client';

import React, { type ReactNode } from 'react';
// NOTE: Diese Datei ist der Orchestrator (Controller) für die Nachrichten-Inhaltsdarstellung.
// Sie entscheidet pro Nachricht, WIE gerendert wird (plain/markdown/html),
// ruft die Renderer-Registry auf und kapselt einen sicheren Fallback.

// ⚠️ Diese Imports werden in den nächsten Schritten angelegt:
// - ../renderers/registry (Schritt 4)
// - ../config/features (Schritt 8)
import { renderMessage } from '../renderers/registry';
import { defaultRenderer } from '../config/features';

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageFormat = 'plain' | 'markdown' | 'html';

export type ChatMessage = {
  role: MessageRole;
  content: string;
  /** Optionales Format: Wenn nicht gesetzt, wird der Default aus features.ts verwendet */
  format?: MessageFormat;
  /** Optionale Metadaten (z. B. für zukünftige Inline-Widgets) */
  meta?: Record<string, unknown>;
};

export type MessageBodyProps = {
  msg: ChatMessage;
  /** Optional: zusätzliche Klassen für Wrapper (z. B. thematische Anpassungen) */
  className?: string;
};

export default function MessageBody({ msg, className }: MessageBodyProps) {
  // Bevorzugte Reihenfolge: explizites msg.format → Feature-Default → 'plain'
  const fmt: MessageFormat = (msg.format ?? (defaultRenderer as MessageFormat) ?? 'plain');

  let node: ReactNode;
  try {
    node = renderMessage({
      role: msg.role,
      content: msg.content,
      format: fmt,
      meta: msg.meta,
    });
  } catch (err) {
    // Harte Sicherheitsleine: Immer anzeigbar, niemals Crash
    node = (
      <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</span>
    );
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[MessageBody] renderMessage failed → fallback to plain', err);
    }
  }

  // Typografie-Scope: Wird in chat-prose.css gezielt angesprochen (Schritt 5)
  const scopeClass = fmt === 'markdown' ? 'md-prose' : undefined;

  return (
    <div
      className={[scopeClass, className].filter(Boolean).join(' ')}
      data-format={fmt}
      data-role={msg.role}
    >
      {node}
    </div>
  );
}

'use client';

import React, { type ReactNode } from 'react';
// NOTE: Diese Datei ist der Orchestrator (Controller) für die Nachrichten-Inhaltsdarstellung.
// Sie entscheidet pro Nachricht, WIE gerendert wird (plain/markdown/html),
// ruft die Renderer-Registry auf und kapselt einen sicheren Fallback.

import { renderMessage } from '../renderers/registry';
import { defaultRenderer } from '../config/features';

/* ============================================================
   Typdefinitionen
   ============================================================ */
export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageFormat = 'plain' | 'markdown' | 'html';

export type ChatMessage = {
  role: MessageRole;
  content: string;
  format?: MessageFormat;
  meta?: Record<string, unknown>;
};

export type MessageBodyProps = {
  msg: ChatMessage;
  className?: string;
};

/* ============================================================
   Komponente
   ============================================================ */
export default function MessageBody({ msg, className }: MessageBodyProps) {
  // Format bestimmen
  const fmt: MessageFormat =
    msg.format ?? (defaultRenderer as MessageFormat) ?? 'plain';

  // Flags
  const isMarkdown = fmt === 'markdown';
  const isUser = msg.role === 'user';
  const isAssistant = msg.role === 'assistant';

  // Versuch → renderMessage(), Fallback → Plaintext
  let node: ReactNode;
  try {
    node = renderMessage({
      role: msg.role,
      content: msg.content,
      format: fmt,
      meta: msg.meta,
    });
  } catch (err) {
    node = (
      <span
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {msg.content}
      </span>
    );
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[MessageBody] renderMessage failed → fallback to plain', err);
    }
  }

  // Typo-Klassen nach Format & Rolle
  const scopeClass = [
    isMarkdown ? 'md-prose' : undefined,
    'm-typo',
    isUser ? 'm-typo-user' : undefined,
    isAssistant ? 'm-typo-assistant' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Basisstil für göttliche Lesbarkeit
  const baseStyle: React.CSSProperties = {
    lineHeight: 1.65,
    fontSize: '1.02rem',
    letterSpacing: '0.003em',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
  };

  // Rollenfeinheiten
  const roleStyle: React.CSSProperties = isUser
    ? { fontWeight: 500 }
    : isAssistant
    ? { fontWeight: 400 }
    : {};

  return (
    <div
      className={scopeClass}
      data-format={fmt}
      data-role={msg.role}
      style={{ ...baseStyle, ...roleStyle }}
    >
      {node}
    </div>
  );
}

'use client';

import React from 'react';
import renderPlain, { type RenderInput as PlainInput } from './plain';
import renderMarkdown, { type RenderInput as MarkdownInput } from './markdown';

/* ============================================================
   Typdefinitionen
   ============================================================ */

export type MessageFormat = 'plain' | 'markdown' | 'html';

export type RenderMessageInput = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  format: MessageFormat;
  meta?: Record<string, unknown>;
};

/* ============================================================
   Registry – zentrale Routerfunktion für Renderer
   ============================================================ */
/**
 * Wählt den passenden Renderer anhand des Formats aus.
 * Sicherheitsprinzip:
 *  - unbekannte oder fehlerhafte Formate → Fallback auf plain
 *  - kein Absturz, niemals „undefined“ zurückgeben
 */
export function renderMessage(input: RenderMessageInput): React.ReactNode {
  try {
    switch (input.format) {
      case 'markdown':
        return renderMarkdown(input as MarkdownInput);
      case 'plain':
        return renderPlain(input as PlainInput);
      case 'html':
        // Noch nicht implementiert → sicherer Fallback
        return renderPlain(input as PlainInput);
      default:
        return renderPlain(input as PlainInput);
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[registry] Renderer error → fallback to plain', err);
    }
    return renderPlain(input as PlainInput);
  }
}

export default renderMessage;

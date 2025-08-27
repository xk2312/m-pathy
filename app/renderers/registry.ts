import React from 'react';
import renderPlain, { type RenderInput as PlainInput } from './plain';
import renderMarkdown, { type RenderInput as MarkdownInput } from './markdown';

export type MessageFormat = 'plain' | 'markdown' | 'html';

export type RenderMessageInput = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  format: MessageFormat;
  meta?: Record<string, unknown>;
};

// Zentrale Registry: wählt den passenden Renderer aus.
// Sicherheitsprinzip: Unbekannte/noch nicht implementierte Formate → Fallback auf plain.
export function renderMessage(input: RenderMessageInput): React.ReactNode {
  const fmt = input.format;
  try {
    switch (fmt) {
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
      console.warn('[registry] Renderer error, falling back to plain', err);
    }
    return renderPlain(input as PlainInput);
  }
}

export default renderMessage;
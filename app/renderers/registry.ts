'use client';

import React from 'react';
import renderPlain from './plain';          // ⬅️ keine Typ-Imports mehr
import renderMarkdown from './markdown';    // ⬅️ default export vorhanden

/* Zentrale Router-Signatur – lokal & stabil */
export type MessageFormat = 'plain' | 'markdown' | 'html';

export type RenderMessageInput = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  format: MessageFormat;
  meta?: Record<string, unknown>;
};

export function renderMessage(input: RenderMessageInput): React.ReactNode {
  try {
    switch (input.format) {
      case 'markdown':
        return renderMarkdown({
          role: input.role,
          content: input.content,
          format: 'markdown',
          meta: input.meta,
        });

      case 'plain':
        return renderPlain({
          role: input.role,
          content: input.content,
          format: 'plain',
          meta: input.meta,
        });

      case 'html':
      default:
        // (später eigener HTML-Renderer; bis dahin safe fallback)
        return renderPlain({
          role: input.role,
          content: input.content,
          format: 'plain',
          meta: input.meta,
        });
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[registry] Renderer error → fallback to plain', err);
    }
    return renderPlain({
      role: input.role,
      content: input.content,
      format: 'plain',
      meta: input.meta,
    });
  }
}

export default renderMessage;

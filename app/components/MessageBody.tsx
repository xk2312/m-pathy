'use client';

import React, { type ReactNode, useCallback } from 'react';
import ColdReveal from './ColdReveal';
// NOTE: Diese Datei ist der Orchestrator (Controller) für die Nachrichten-Inhaltsdarstellung.
// Sie entscheidet pro Nachricht, WIE gerendert wird (plain/markdown/html),
// ruft die Renderer-Registry auf und kapselt einen sicheren Fallback.

import { renderMessage } from '../renderers/registry';
import { defaultRenderer } from '../config/features';
import hljs from 'highlight.js';

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
    if (isAssistant && (fmt === 'plain' || fmt === 'auto')) {
      node = (
        <span
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          <ColdReveal
            key={msg.content.length}
            text={msg.content}
          />
        </span>
      );
    } else {
      node = renderMessage({
        role: msg.role,
        content: msg.content,
        format: fmt,
        meta: msg.meta,
      });
    }
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

  const onRootClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    const btn = target?.closest?.('[data-copy-code="true"]') as HTMLElement | null;
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const block =
      (btn.closest?.('.md-code-block') as HTMLElement | null) ??
      (btn.closest?.('.md-code') as HTMLElement | null);

    const codeEl = block?.querySelector?.('pre code') as HTMLElement | null;
    const text = (codeEl?.textContent ?? '').trimEnd();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      btn.setAttribute('data-copied', 'true');
      window.setTimeout(() => {
        try { btn.removeAttribute('data-copied'); } catch {}
      }, 900);
    } catch {
      // fallback (older browsers / permission edge)
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);

      btn.setAttribute('data-copied', 'true');
      window.setTimeout(() => {
        try { btn.removeAttribute('data-copied'); } catch {}
      }, 900);
    }
  }, []);

  // Highlight.js nach Render anwenden (nur wenn markdown)
  React.useEffect(() => {
    if (!isMarkdown) return;
    try {
      const root = document.querySelectorAll('.md-prose pre code');
        root.forEach((el) => {
        const codeEl = el as HTMLElement;
        if (codeEl.dataset.hljs) return;
        document.body.dataset.hljs = "active"; // Council13: enable syntax scope


        const cls = codeEl.className || '';
        const m = cls.match(/\blanguage-([a-z0-9_-]+)\b/i);
        const lang = m ? m[1].toLowerCase() : '';
        const raw = codeEl.textContent ?? '';

        try {
          if (lang && hljs?.getLanguage(lang)) {
            codeEl.innerHTML = hljs.highlight(raw, { language: lang }).value;
          } else {
            codeEl.innerHTML = hljs.highlightAuto(raw).value;
          }
          codeEl.classList.add('hljs');
          codeEl.dataset.hljs = '1';
        } catch {}
      });
    } catch {}
  }, [fmt, msg.content]);

  return (
    <div
      className={scopeClass}
      data-format={fmt}
      data-role={msg.role}
      style={{ ...baseStyle, ...roleStyle }}
      onClick={onRootClick}
    >
      {node}
    </div>
  );
}

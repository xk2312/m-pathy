import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Markdown-Renderer: wandelt GitHub‑flavored Markdown in semantische HTML‑Tags um.
// Sicherheitsprinzip: KEIN raw HTML (kein rehypeRaw) → dadurch XSS‑sicherer Standard.
// Styling passiert außerhalb über den Scope‑Wrapper (.md-prose), nicht hier.

export type RenderInput = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  meta?: Record<string, unknown>;
};

export function renderMarkdown({ content }: RenderInput): React.ReactNode {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />
      }}      
      // Hinweis: Keine HTML‑Durchleitung. Wenn HTML irgendwann nötig ist,
      // ausschließlich mit Sanitizing (separates Utility) nachrüsten.
    >
      {content}
    </ReactMarkdown>
  );
}

export default renderMarkdown;

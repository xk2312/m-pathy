// components/renderers/markdown.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";

/* Pragmatic components: vermeiden Versions-Typkonflikte */
const mdComponents: Partial<Components> = {
  table: ({ node: _n, ...props }: any) => (
    <div className="md-table-wrap">
      <table {...props} />
    </div>
  ),
  th: (p: any) => <th scope="col" {...p} />,
  code: ({ inline, className, children, ...props }: any) => {
    const m = /language-(\w+)/.exec(className || "");
    if (inline) {
      return (
        <code className="md-inline" {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className="md-code">
        <code className={m ? `language-${m[1]}` : undefined} {...props}>
          {children}
        </code>
      </pre>
    );
  },
};

/* ✅ Default-Export vorhanden */
export default function renderMarkdown(input: {
  role: "user" | "assistant" | "system";
  content: string;
  format?: "markdown";              // optional; Registry steuert Format
  meta?: Record<string, unknown>;
}): React.ReactNode {
  return (
    <div className="md md-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={mdComponents as Components}
      >
        {input.content}
      </ReactMarkdown>
    </div>
  );
}

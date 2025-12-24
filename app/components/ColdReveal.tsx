"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Minimaler, performanter Reveal-Effekt:
 * - Buchstaben erscheinen sequenziell
 * - Blur → Klarheit (Ice/Frost-Gefühl)
 * - Kein Cursor, kein Typing
 * - DOM-Flow bestimmt LTR / RTL automatisch
 */

type ColdRevealProps = {
  text: string;
  baseDelay?: number; // Startverzögerung (Sekunden)
  letterDelay?: number; // Abstand pro Buchstabe
  className?: string;
};

type Token =
  | { type: "word"; value: string }
  | { type: "space"; value: string };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const parts = text.split(/(\s+)/);

  for (const part of parts) {
    if (part.trim() === "") {
      tokens.push({ type: "space", value: part });
    } else {
      tokens.push({ type: "word", value: part });
    }
  }

  return tokens;
}

export default function ColdReveal({
  text,
  baseDelay = 0,
  letterDelay = 0.02,
  className,
}: ColdRevealProps) {
  const tokens = useMemo(() => tokenize(text), [text]);

  let globalIndex = 0;

  return (
    <span className={className} aria-label={text}>
      {tokens.map((tok, i) => {
        if (tok.type === "space") {
          return <span key={`s-${i}`}>{tok.value}</span>;
        }

        return (
          <span key={`w-${i}`} style={{ whiteSpace: "pre" }}>
            {Array.from(tok.value).map((char, j) => {
              const delay = baseDelay + globalIndex * letterDelay;
              globalIndex++;

              return (
                <motion.span
                  key={`c-${i}-${j}`}
                  initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    delay,
                    duration: 0.28,
                    ease: "easeOut",
                  }}
                  style={{
                    display: "inline-block",
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

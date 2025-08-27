'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * MessageInput – mehrzeilige Eingabeleiste mit Auto-Resize
 * - Enter = senden, Shift+Enter = Zeilenumbruch
 * - IME-Protection (während Komposition nie senden)
 * - Styles ausgelagert in app/styles/input-bar.css (Klassen: m-inputbar, m-inputbar__textarea, m-inputbar__send)
 */
export type MessageInputProps = {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  minRows?: number; // visuelle Mindesthöhe in Zeilen (Default 1)
  maxRows?: number; // maximale visuelle Höhe in Zeilen (Default 6)
};

export default function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'Nachricht schreiben…',
  minRows = 1,
  maxRows = 6,
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-Resize ohne externen Hook (bewusst selbstenthalten)
  const autoResize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    const lineHeight = getComputedStyle(el).lineHeight;
    const lh = lineHeight ? parseFloat(lineHeight) : 20;
    const minH = Math.max(lh * minRows, lh);
    const maxH = Math.max(lh * maxRows, minH);

    el.style.height = 'auto';
    const next = Math.min(maxH, el.scrollHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
  }, [minRows, maxRows]);

  useEffect(() => { autoResize(); }, [value, autoResize]);

  const handleSend = useCallback(async () => {
    const text = value.trim();
    if (!text) return;
    try {
      await onSend(text);
    } finally {
      setValue('');
      // Nach dem Senden Höhe zurücksetzen
      requestAnimationFrame(autoResize);
    }
  }, [value, onSend, autoResize]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return; // explizit: nur reines Enter sendet
    if (isComposing) return; // während IME nicht senden
    e.preventDefault();
    if (!disabled) void handleSend();
  }, [disabled, isComposing, handleSend]);

  return (
    <div className="m-inputbar" aria-label="Eingabeleiste" role="group">
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={placeholder}
        disabled={disabled}
        rows={minRows}
        className="m-inputbar__textarea"
        aria-label="Nachricht eingeben"
        aria-multiline
        enterKeyHint="send"
      />

      <button
        type="button"
        onClick={() => !disabled && handleSend()}
        disabled={disabled || value.trim().length === 0}
        className="m-inputbar__send"
        aria-label="Senden"
        title="Senden (Enter)"
      >
        Senden
      </button>
    </div>
  );
}

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { t } from "../../lib/i18n";

/**
 * MessageInput – multi-line input with auto-resize
 * - Enter = send, Shift+Enter = newline
 * - IME protection (don't send while composing)
 * - Styles in route/styles/input-bar.css (m-inputbar, m-inputbar__textarea, m-inputbar__send)
 */
export type MessageInputProps = {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  minRows?: number; // visual min height in lines (default 1)
  maxRows?: number; // visual max height in lines (default 6)
};

export default function MessageInput({
  onSend,
  disabled = false,
  placeholder = t('writeMessage'),
  minRows = 1,
  maxRows = 6,
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize
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
    if (disabled) return;
    const text = value.trim();
    if (!text) return;

    try {
      console.log('[MI] onSend ->', text);
      await onSend(text);
      setValue('');
      // Reset height after sending
      requestAnimationFrame(autoResize);
      console.log('[MI] onSend:done');
    } catch (err) {
      console.error('[MI] onSend:error', err);
      // keep value on error
    }
  }, [value, disabled, onSend, autoResize]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return; // only plain Enter sends
    if (isComposing) return; // don't send during IME composition
    e.preventDefault();
    void handleSend();
  }, [isComposing, handleSend]);

  return (
    <div className="m-inputbar" aria-label="Message input" role="group">
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
        aria-label={t('writeMessage')}
        aria-multiline
        enterKeyHint="send"
      />

      <button
        type="button"
        onClick={() => void handleSend()}
        disabled={disabled || value.trim().length === 0}
        className="m-inputbar__send"
        aria-label={t('send')}
        title={`${t('send')} (Enter)`}
      >
        {t('send')}
      </button>
    </div>
  );
}

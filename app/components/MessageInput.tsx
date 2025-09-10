'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { t } from "@/lib/i18n";

/**
 * MessageInput – accessible, powerful multi-line input (Council13 / DevLoop 130)
 * - Große, gut lesbare Typo (für ältere Augen)
 * - Auto-Resize (minRows..maxRows), Enter=Send, Shift+Enter=Zeilenumbruch
 * - IME-Schutz (nicht senden während Komposition)
 * - Drag&Drop-Dateiupload (Platzhalter; noch kein Upload-API-Call)
 * - Toolbar mit Buttons: Upload, Funktionen (Platzhalter), Senden
 * - Shortcut: "/council Name: prompt" → POST /api/council/invoke
 */
export type MessageInputProps = {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  minRows?: number; // visuelle Mindesthöhe (Zeilen)
  maxRows?: number; // visuelle Maxhöhe (Zeilen)
};

export default function MessageInput({
  onSend,
  disabled = false,
  placeholder = t('writeMessage'),
  minRows = 3,
  maxRows = 10,
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  // ---- helpers -------------------------------------------------------------

  /** parse "/council Name: prompt" → { name, prompt } | null */
  const parseCouncilCommand = (text: string): null | { name: string; prompt: string } => {
    const m = text.match(/^\/council\s+([^:]+)\s*:\s*(.+)$/i);
    if (!m) return null;
    return { name: m[1].trim(), prompt: m[2].trim() };
  };

  // Auto-resize
  const autoResize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    const lineHeight = getComputedStyle(el).lineHeight;
    const lh = lineHeight ? parseFloat(lineHeight) : 22;
    const minH = Math.max(lh * minRows, lh * 2.8);   // großzügiger Mindestblock
    const maxH = Math.max(lh * maxRows, minH);

    el.style.height = 'auto';
    const next = Math.min(maxH, el.scrollHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
  }, [minRows, maxRows]);

  useEffect(() => { autoResize(); }, [value, autoResize]);

  // ---- send logic ----------------------------------------------------------

  const handleSend = useCallback(async () => {
    if (disabled) return;
    const text = value.trim();
    if (!text) return;

    try {
      // 1) Council shortcut?
      const council = parseCouncilCommand(text);
      if (council) {
        // Echo des Kommandos an Parent
        await onSend(text);

        const res = await fetch('/api/council/invoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: council.name, prompt: council.prompt }),
        });

        if (!res.ok) {
          const msg = `Council invoke failed (${res.status})`;
          console.error('[MI] council:error', msg);
          await onSend(`⚠️ ${msg}`);
        } else {
          const data = await res.json(); // { notice, answer, shadow?, meta }
          if (data?.notice) await onSend(String(data.notice));
          if (data?.answer) await onSend(String(data.answer));
        }
      } else {
        // 2) Normaler Text
        await onSend(text);
      }

      setValue('');
      requestAnimationFrame(autoResize);
    } catch (err) {
      console.error('[MI] onSend:error', err);
      // value bleibt erhalten
    }
  }, [value, disabled, onSend, autoResize]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return; // nur reines Enter sendet
    if (isComposing) return; // IME
    e.preventDefault();
    void handleSend();
  }, [isComposing, handleSend]);

  // ---- upload placeholders -------------------------------------------------

  // Drag & Drop (Platzhalter)
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(false);
  // bewusst keine Aktion: nur Tooltip-Icons, Funktionen folgen später
}, []);


  // ---- render --------------------------------------------------------------

  const bigFont = 18;        // Grundschrift
  const bigLine = 1.45;      // Lesbarkeit
  const radius = 16;

  return (
    <div
      className="m-inputbar"
      aria-label="Message input"
      role="group"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        width: '100%',
        gap: 12,
        display: 'flex',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        padding: 12,
        borderRadius: radius,
        border: '1px solid rgba(255,255,255,0.12)',
        background: isDragging ? 'rgba(34,211,238,0.10)' : 'rgba(255,255,255,0.06)',
        boxShadow: '0 14px 40px rgba(0,0,0,0.35), 0 0 28px rgba(34,211,238,0.12)',
        backdropFilter: 'blur(12px)',
        transition: 'background .15s ease, transform .12s ease',
      }}
    >
  

      {/* Textbereich (mittig, groß & mehrzeilig) */}
      <div style={{ flex: '1 1 480px', minWidth: 240 }}>
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
          style={{
            width: '100%',
            display: 'block',
            fontSize: bigFont,
            lineHeight: bigLine,
            color: 'rgba(230,240,243,1)',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: radius,
            border: '1px solid rgba(255,255,255,0.12)',
            outline: 'none',
            padding: '14px 16px',
            resize: 'none',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        />
        {/* Hint-Zeile (zugänglich, dezent) */}
        <div
          aria-hidden
          style={{
            marginTop: 6,
            fontSize: 12,
            opacity: 0.7,
            color: 'rgba(230,240,243,0.70)',
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span>↩︎ Enter = {t('send') ?? 'Send'}</span>
          <span>⇧ Enter = {t('newline') ?? 'New line'}</span>
          <span>/council Name: prompt</span>
          <span>Drop files here</span>
        </div>
      </div>

      {/* Actions rechts: Icons oben, Senden darunter */}
<div
  className="m-inputbar__actionsRight"
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
    flex: '0 0 220px',       // Platz für Icons + breiten Send-Button
  }}
>
  {/* Icon-Zeile */}
  <div
    role="toolbar"
    aria-label={t('tools')}
    style={{ display: 'flex', gap: 8 }}
  >
    <button
      type="button"
      title={t('comingUpload') ?? 'Coming soon: Upload'}
      aria-label={t('comingUpload') ?? 'Coming soon: Upload'}
      style={toolBtnStyle}
      onClick={(e) => e.preventDefault()}
    >
      📎
    </button>
    <button
      type="button"
      title={t('comingFunctions') ?? 'Coming soon: Functions'}
      aria-label={t('comingFunctions') ?? 'Coming soon: Functions'}
      style={toolBtnStyle}
      onClick={(e) => e.preventDefault()}
    >
      ⚙️
    </button>
    <button
      type="button"
      title={t('comingVoice') ?? 'Coming soon: Voice'}
      aria-label={t('comingVoice') ?? 'Coming soon: Voice'}
      style={toolBtnStyle}
      onClick={(e) => e.preventDefault()}
    >
      🎙️
    </button>
  </div>

  {/* Senden (breit) */}
  <button
    type="button"
    onClick={() => void handleSend()}
    disabled={disabled || value.trim().length === 0}
    aria-label={t('send')}
    title={`${t('send')} (Enter)`}
    style={{
      width: '100%',          // breit unter den Icons
      height: 52,
      padding: '0 24px',
      border: 0,
      borderRadius: radius,
      background: 'linear-gradient(180deg, #22d3ee, #11b2cc)',
      color: '#071015',
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: 0.3,
      cursor: disabled || value.trim().length === 0 ? 'not-allowed' : 'pointer',
      opacity: disabled || value.trim().length === 0 ? 0.6 : 1,
      boxShadow: '0 0 22px rgba(34,211,238,0.35)',
      transition: 'transform .12s ease, box-shadow .12s ease',
    }}
    onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(1px)')}
    onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    {t('send')}
  </button>
</div>

    </div>
  );
}

/* —— kleine, wiederverwendbare Styles —— */
const toolBtnStyle: React.CSSProperties = {
  height: 44,
  minWidth: 44,
  padding: '0 10px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  color: 'rgba(230,240,243,0.95)',
  fontSize: 18,
  lineHeight: 1,
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(34,211,238,0.12)',
};

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  onToggleSaeule?: () => void; // SIMBA-Trigger für Säulen-Overlay
};

export default function MessageInput({
  onSend,
  disabled = false,
  placeholder = t('writeMessage'),
  minRows = 3,
  maxRows = 10,
  onToggleSaeule,
}: MessageInputProps) {

  const [value, setValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlusHovered, setIsPlusHovered] = useState(false); // SIMBA-Glow-State
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null); // ← Fokus-/Drag-Glow-Layer


  // A11y: ID für die Shortcuts-/Hinweiszeile (wird per aria-describedby verdrahtet)
  const hintId = useMemo(
    () => `mi-hints-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  /* 5.3 — Plus-Menü State (nur Mobile sichtbar) */
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement | null>(null);

  /* 5.3 — Click-Outside schließt das Menü */
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!toolsOpen) return;
      const target = e.target as HTMLElement | null;
      if (target && toolsRef.current && !toolsRef.current.contains(target)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [toolsOpen]);

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

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

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

  // Visueller Drag-Glow am Container-Overlay
  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.style.boxShadow = isDragging ? 'var(--glow)' : 'none';
  }, [isDragging]);

  // ---- render --------------------------------------------------------------

  const bigFont = 18;        // Grundschrift
  const bigLine = 1.45;      // Lesbarkeit

  return (
    <div
      className="m-inputbar"
      aria-label="Message input"
      role="group"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        position: 'relative',
        width: '100%',
        gap: 12,
        display: 'flex',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        padding: 12,
        borderRadius: 16, /* harmoniert mit --rz-lg */
        border: '1px solid rgba(0,255,255,0.10)',
        background: isDragging
          ? 'rgba(0,255,255,0.10)'
          : 'linear-gradient(180deg, rgba(12,24,32,0.72), rgba(10,18,26,0.68))',
        boxShadow: 'var(--sh-sm)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'background var(--t-mid) var(--ease), box-shadow var(--t-mid) var(--ease), transform var(--t-fast) var(--ease)',
        willChange: 'transform, box-shadow, background',
        cursor: 'text',
      }}
    >
      {/* Fokus-/Drag-Overlay (rein visuell, kein Hit-Test) */}
      <div
        ref={overlayRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: -1,              // 1px überlappend für sauberen Rand
          borderRadius: 16,
          pointerEvents: 'none',
          boxShadow: 'none',
          transition: 'box-shadow var(--t-mid) var(--ease)',
        }}
      />

      {/* Textbereich (mittig, groß & mehrzeilig) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        {onToggleSaeule && (
          <>
            <button
              type="button"
              aria-label="Werkzeuge"
              aria-expanded={toolsOpen}
              aria-controls="mi-tools-popover"
              onClick={() => onToggleSaeule()} // SIMBA: Säulen-Overlay öffnen
              onMouseEnter={() => setIsPlusHovered(true)}
              onMouseLeave={() => setIsPlusHovered(false)}
              className="mi-plus-btn"
              style={{
                minWidth: 40,
                minHeight: 40,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999, // reiner Orb
                border: '1px solid rgba(0,255,255,0.18)', // wie Prompt-Rim, etwas zarter
                background: isPlusHovered
                  ? 'rgba(0,255,255,0.12)'          // Hover: sanfter Cyan-Schimmer
                  : 'rgba(5,16,24,0.85)',           // Ruhig, dunkel – Therapie-Modus
                color: 'rgba(230,240,243,0.95)',
                fontWeight: 800,
                fontSize: 18,
                lineHeight: 1,
                transition:
                  'background var(--t-fast) var(--ease), transform var(--t-fast) var(--ease)',
              }}
            >
              +
            </button>

            {toolsOpen && (
              <div
                id="mi-tools-popover"
                ref={toolsRef}
                role="menu"
                aria-label="Werkzeuge"
                style={{
                  position: 'absolute',
                  left: 12,
                  bottom: 'calc(100% + 8px)', // über der Inputbar
                  width: 'min(92vw, 360px)',
                  background: 'rgba(12,20,36,0.96)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 5,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 8,
                  }}
                >
                  {/* Platzhalter: nicht fokusierbar */}
                  <button
                    role="menuitem"
                    type="button"
                    className="mi-tool"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    📎 {t('comingUpload') ?? 'Upload'}
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    className="mi-tool"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    🎙️ {t('comingVoice') ?? 'Voice'}
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    className="mi-tool"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    ⚙️ {t('comingFunctions') ?? 'Optionen'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>


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
        aria-describedby={hintId}
        enterKeyHint="send"
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = 'var(--glow)';
          e.currentTarget.style.background = 'linear-gradient(180deg, rgba(10,18,26,0.55), rgba(8,14,20,0.55))';
          if (overlayRef.current) overlayRef.current.style.boxShadow = 'var(--glow)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          if (overlayRef.current) overlayRef.current.style.boxShadow = 'none';
        }}
        style={{
          width: '100%',
          display: 'block',
          fontSize: bigFont,
          lineHeight: bigLine,
          color: 'rgba(230,240,243,1)',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 16,
          border: '1px solid rgba(0,255,255,0.12)',
          outline: 'none',
          padding: '14px 16px',
          resize: 'none',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          transition: 'box-shadow var(--t-mid) var(--ease), background var(--t-mid) var(--ease)',
        }}
      />

      {/* Hint-Zeile (zugänglich, dezent) */}
      <div
        id={hintId}
        role="note"
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

      {/* Actions rechts: Icons oben, Senden darunter */}
      <div
        className="m-inputbar__actionsRight"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
          flex: '0 0 220px', // Platz für Icons + breiten Send-Button
        }}
      >
        {/* Icon-Zeile (Platzhalter → nicht fokusierbar) */}
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
            tabIndex={-1}
            aria-disabled="true"
          >
            📎
          </button>
          <button
            type="button"
            title={t('comingFunctions') ?? 'Coming soon: Functions'}
            aria-label={t('comingFunctions') ?? 'Coming soon: Functions'}
            style={toolBtnStyle}
            onClick={(e) => e.preventDefault()}
            tabIndex={-1}
            aria-disabled="true"
          >
            ⚙️
          </button>
          <button
            type="button"
            title={t('comingVoice') ?? 'Coming soon: Voice'}
            aria-label={t('comingVoice') ?? 'Coming soon: Voice'}
            style={toolBtnStyle}
            onClick={(e) => e.preventDefault()}
            tabIndex={-1}
            aria-disabled="true"
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
            width: '100%',
            height: 52,
            padding: '0 24px',
            border: 0,
            borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(34,211,238,1), rgba(17,178,204,1))',
            color: '#071015',
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: 0.3,
            cursor: disabled || value.trim().length === 0 ? 'not-allowed' : 'pointer',
            opacity: disabled || value.trim().length === 0 ? 0.6 : 1,
            boxShadow: 'var(--sh-md)',
            transition: 'transform var(--t-fast) var(--ease), box-shadow var(--t-mid) var(--ease), filter var(--t-mid) var(--ease)',
            willChange: 'transform, box-shadow, filter',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(1px) scale(0.995)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--sh-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--sh-md)';
          }}
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
  border: '1px solid rgba(0,255,255,0.10)',
  background: 'rgba(12,24,32,0.72)',
  color: 'rgba(230,240,243,0.95)',
  fontSize: 18,
  lineHeight: 1,
  cursor: 'pointer',
  boxShadow: 'var(--sh-sm)',
  transition:
    'transform var(--t-fast) var(--ease), box-shadow var(--t-mid) var(--ease), background var(--t-mid) var(--ease)',
} as const;

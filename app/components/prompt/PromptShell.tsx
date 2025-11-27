"use client";

import React, {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";

export type PromptShellProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSendBlocked: boolean;
  disabled?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
  onHeightChange?: () => void;
  onToggleSaeule?: () => void;        // ← NEU: optionaler Trigger für Overlay
};


export function PromptShell({
  value,
  onChange,
  onSubmit,
  isSendBlocked,
  disabled,
  placeholder,
  ariaLabel,
  autoFocus,
  onHeightChange,
  onToggleSaeule,                 // ← NEU: SIMBA-Trigger aus Props
}: PromptShellProps) {

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const effectiveDisabled = !!disabled || !!isSendBlocked;
  const canSubmit = !effectiveDisabled && value.trim().length > 0;

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const viewportH =
      typeof window !== "undefined" ? window.innerHeight || 0 : 0;
    const maxHeight = viewportH > 0 ? Math.round(viewportH * 0.3) : 220;

    const target = Math.max(44, Math.min(el.scrollHeight, maxHeight));
    el.style.height = `${target}px`;

    if (onHeightChange) onHeightChange();
  }, [onHeightChange]);

  useEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const ev: any = e;
    const isComposing =
      !!ev.isComposing || !!ev.nativeEvent?.isComposing;

    if (e.key !== "Enter" || e.shiftKey || e.repeat || isComposing) return;

    e.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  const handleClickSend = () => {
    if (!canSubmit) return;
    onSubmit();
  };

  // MEFL + LINGUA: keine Default-Hardstrings
  const resolvedPlaceholder = placeholder ?? "";
  const resolvedAriaLabel = ariaLabel ?? "";

  return (
    <form
      className="prompt-shell"
      onSubmit={handleSubmit}
      aria-label={resolvedAriaLabel}
    >
      {/* SIMBA – Plus-Orb links, nur wenn Säule steuerbar ist (Mobile/Tablet) */}
      {onToggleSaeule && (
        <button
          type="button"
          className="prompt-plus-orb"
          aria-label={resolvedAriaLabel || "Navigation öffnen"}
          onClick={onToggleSaeule}
          style={{
            minWidth: 32,
            minHeight: 32,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            border: "1px solid rgba(0,255,255,0.18)",
            background: "rgba(5,16,24,0.9)",
            color: "rgba(230,240,243,0.95)",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1,
            marginRight: 8,
            transition:
              "background var(--t-fast) var(--ease), transform var(--t-fast) var(--ease), opacity var(--t-fast) var(--ease)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,255,255,0.14)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(5,16,24,0.9)";
          }}
        >
          +
        </button>
      )}

      <textarea
        ref={textareaRef}
        id="prompt-input"
        className="prompt-input"
        aria-label={resolvedAriaLabel}
        placeholder={resolvedPlaceholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        autoFocus={autoFocus}
        disabled={effectiveDisabled}
        spellCheck
        autoCorrect="on"
        autoCapitalize="sentences"
      />

      {/* Simba – Orb mit Sendelogik + Busy-Animation */}
      <button
        type="submit"
        className="prompt-orb"
        aria-label={resolvedAriaLabel || "Senden"}
        disabled={!canSubmit}
        data-busy={isSendBlocked ? "true" : undefined}
        onClick={handleClickSend}
      >
        <span
          className="prompt-orb-icon"
          aria-hidden="true"
        />
      </button>
    </form>
  );

}



export default PromptShell;


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
  // Controlled value (kommt aus page2-Container)
  value: string;
  onChange: (value: string) => void;

  // Senden – Container kennt den aktuellen value
  onSubmit: () => void;

  // Blockade-Flags
  isSendBlocked: boolean;  // z.B. wenn M gerade denkt
  disabled?: boolean;      // Hard-Lock (Systemfehler o.ä.)

  // Optik & A11y
  placeholder?: string;
  ariaLabel?: string;
  autoFocus?: boolean;

  // Optional: Dock-Height-Update triggern
  onHeightChange?: () => void;
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

    if (onHeightChange) {
      onHeightChange();
    }
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

    if (e.key !== "Enter" || e.shiftKey || e.repeat || isComposing) {
      return;
    }

    e.preventDefault();
    if (!canSubmit) return;

    onSubmit();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  const handleClickSend = () => {
    if (!canSubmit) return;
    onSubmit();
  };

  const resolvedPlaceholder =
    placeholder ?? "Nachricht an M …";

  const resolvedAriaLabel =
    ariaLabel ?? "Eingabefeld für Nachrichten an M";

  return (
    <form
      className="gold-prompt-wrap prompt-shell"
      onSubmit={handleSubmit}
      aria-label={resolvedAriaLabel}
    >
      <textarea
        ref={textareaRef}
        id="gold-input"
        className="gold-textarea"
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

      <button
        type="submit"
        className="gold-send prompt-shell-orb"
        aria-label="Senden"
        disabled={!canSubmit}
        onClick={handleClickSend}
      >
        <span
          className="prompt-shell-orb-icon"
          aria-hidden="true"
        >
          ➤
        </span>
      </button>
    </form>
  );
}

export default PromptShell;

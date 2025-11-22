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

      <button
        type="submit"
        className="prompt-send"
        aria-label={resolvedAriaLabel}
        disabled={!canSubmit}
        onClick={handleClickSend}
      >
        <span className="prompt-send-icon" aria-hidden="true" />
      </button>
    </form>
  );
}

export default PromptShell;

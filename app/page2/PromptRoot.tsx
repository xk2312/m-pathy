// app/chat/page2/PromptRoot.tsx
"use client";

import React, { useCallback } from "react";
import { usePromptStateMachine } from "@/app/chat/hooks/usePromptStateMachine";
import { PromptShell } from "@/app/components/prompt/PromptShell";
import "./prompt.css";

type FooterStatus = {
  modeLabel?: string;
  expertLabel?: string;
};

type PromptRootProps = {
  t: (key: string) => string;
  hasMessages: boolean;
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  dockRef: React.RefObject<HTMLDivElement>;
  padBottom: number;
  setPadBottom: (value: number) => void;
  compactStatus: boolean;
  footerStatus: FooterStatus;
  withGate: (fn: () => void) => void;
  sendingRef: React.MutableRefObject<boolean>;
  onSendFromPrompt: (text: string) => void;
  isMobile: boolean;
};

export function PromptRoot({
  t,
  hasMessages,
  input,
  setInput,
  loading,
  dockRef,
  padBottom,
  setPadBottom,
  compactStatus: _compactStatus,
  footerStatus,
  withGate,
  sendingRef,
  onSendFromPrompt,
  isMobile,
}: PromptRootProps) {
  const snapshot = usePromptStateMachine({
    hasThread: hasMessages,
    isMobile,
    isThinking: loading,
  });

  const visualState =
    !hasMessages
      ? "intro"
      : snapshot.isSendBlocked
      ? "thinking"
      : "ready";

  const hasFooterStatus =
    !!footerStatus?.modeLabel || !!footerStatus?.expertLabel;

  const updateDockHeight = useCallback(() => {
    try {
      const h = dockRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--dock-h", `${h}px`);
      setPadBottom(h);
    } catch {
      /* ignore */
    }
  }, [dockRef, setPadBottom]);

  const scheduleDockUpdate = useCallback(() => {
    if (typeof requestAnimationFrame === "undefined") {
      updateDockHeight();
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateDockHeight();
      });
    });
  }, [updateDockHeight]);

  const sendMessage = useCallback(() => {
    if (loading || !input.trim() || sendingRef.current) return;
    sendingRef.current = true;

    withGate(() => {
      onSendFromPrompt(input);
      setInput("");
      updateDockHeight();
    });

    window.setTimeout(() => {
      sendingRef.current = false;
    }, 400);
  }, [
    input,
    loading,
    onSendFromPrompt,
    setInput,
    updateDockHeight,
    withGate,
    sendingRef,
  ]);

  // PreChat = "doorman", sonst "chat"
  const modeVariant = !hasMessages ? "doorman" : "chat";
  const layoutVariant = snapshot.layoutVariant ?? (isMobile ? "mobile" : "desktop");
  const isDoorman = modeVariant === "doorman";

  const dockClassName = isDoorman
    ? "prompt-root"
    : "prompt-root prompt-root--flight";

  return (
    <div
      id="m-input-dock"
      ref={dockRef as any}
      className={dockClassName}
      role="group"
      aria-label={t("prompt.ariaLabel")}
      data-mode={modeVariant}
      data-layout={layoutVariant}
      data-prompt-state={visualState}
    >
      {/* ModeLine */}
      {hasFooterStatus && (
        <div className="prompt-mode-line">
          {footerStatus?.modeLabel && (
            <span className="prompt-mode-line-mode">
              {footerStatus.modeLabel}
            </span>
          )}
          {footerStatus?.modeLabel && footerStatus?.expertLabel && (
            <span className="prompt-mode-line-separator"> • </span>
          )}
          {footerStatus?.expertLabel && (
            <span className="prompt-mode-line-expert">
              {footerStatus.expertLabel}
            </span>
          )}
        </div>
      )}

      {/* ⭐ NEW: DOORMAN inside PromptDockCluster */}
      {!hasMessages && (
        <div className="prompt-doorman" aria-hidden="true">
          <p className="prompt-doorman-main">{t("prompt.doorman.main")}</p>
          <p className="prompt-doorman-sub">{t("prompt.doorman.sub")}</p>
        </div>
      )}

      {/* PromptShell */}
      <PromptShell
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        isSendBlocked={snapshot.isSendBlocked}
        disabled={false}
        placeholder={t("writeMessage")}
        ariaLabel={t("writeMessage")}
        autoFocus={!hasMessages}
        onHeightChange={scheduleDockUpdate}
      />
    </div>
  );
}

export default PromptRoot;

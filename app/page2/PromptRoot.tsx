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
  compactStatus: _compactStatus, // aktuell nicht genutzt
  footerStatus: _footerStatus,   // aktuell nicht genutzt
  withGate,
  sendingRef,
  onSendFromPrompt,
  isMobile,
}: PromptRootProps) {
  // StateMachine – entscheidet Doorman / Chat + Desktop / Mobile
  const snapshot = usePromptStateMachine({
    hasThread: hasMessages,
    isMobile,
    isThinking: loading,
  });

  const isDoormanDesktop =
    snapshot.modeVariant === "doorman" &&
    snapshot.layoutVariant === "desktop" &&
    !hasMessages;

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
      const dockEl = document.getElementById("m-input-dock");
      dockEl?.classList.add("send-ripple");
      void dockEl?.getBoundingClientRect();

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

  return (
    <div
      id="m-input-dock"
      ref={dockRef as any}
      className={
        hasMessages
          ? "prompt-root prompt-root--flight"
          : "prompt-root prompt-root--launch"
      }
      role="group"
      aria-label="Chat Eingabe"
      data-pad-bottom={padBottom}
      data-mode={snapshot.modeVariant}
      data-layout={snapshot.layoutVariant}
      data-thinking={snapshot.isSendBlocked ? "true" : "false"}
    >
      {/* Doorman Desktop – Quotes über der Pille */}
      {isDoormanDesktop && (
        <div className="prompt-quotes" aria-hidden="true">
          <p className="prompt-quote-main">
            Welcome to m-pathy. I am M, first AI, built by 13 AIs.
          </p>
          <p className="prompt-quote-sub">
            13 minds. One field. Absolute clarity.
          </p>
        </div>
      )}

      {/* Die Kristall-Pille */}
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

"use client";

import React, { useCallback } from "react";
import { usePromptStateMachine } from "@/app/chat/hooks/usePromptStateMachine";
import { PromptShell } from "@/app/components/prompt/PromptShell";

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
  compactStatus,
  footerStatus,
  withGate,
  sendingRef,
  onSendFromPrompt,
  isMobile,
}: PromptRootProps) {
  // 🧠 StateMachine – erkennt Doorman/Chat + Desktop/Mobile
  const snapshot = usePromptStateMachine({
    hasThread: hasMessages,
    isMobile,
    isThinking: loading,
  });

  const isDoormanDesktop =
    snapshot.modeVariant === "doorman" &&
    snapshot.layoutVariant === "desktop" &&
    !hasMessages;

  // Dock-Höhe messen und setzen
  const updateDockHeight = useCallback(() => {
    try {
      const h = dockRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--dock-h", `${h}px`);
      setPadBottom(h);
    } catch {
      /* silent */
    }
  }, [dockRef, setPadBottom]);

  // Doppel-rAF zum Stabilisieren
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

  // Nachricht senden
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
  }, [input, loading, onSendFromPrompt, setInput, updateDockHeight, withGate, sendingRef]);

  return (
    <div
      id="m-input-dock"
      ref={dockRef as any}
      className={`m-bottom-stack gold-dock ${
        hasMessages ? "gold-dock--flight" : "gold-dock--launch"
      }`}
      role="group"
      aria-label="Chat Eingabe & Status"
      data-pad-bottom={padBottom}
      data-mode={snapshot.modeVariant}       // "doorman" | "chat"
      data-layout={snapshot.layoutVariant}   // "desktop" | "mobile"
      data-thinking={snapshot.isSendBlocked ? "true" : "false"}
    >
      {/* Doorman – Quotes */}
      {isDoormanDesktop && (
        <div className="doorman-quotes" aria-hidden="true">
          <p className="doorman-quote-main">
            Welcome to m-pathy. I am M, first AI, built by 13 AIs.
          </p>
          <p className="doorman-quote-sub">
            13 minds. One field. Absolute clarity.
          </p>
        </div>
      )}

      {/* Neue Prompt-Zeile – komplett ohne Legacy */}
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

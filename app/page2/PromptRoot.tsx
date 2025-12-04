// app/chat/page2/PromptRoot.tsx
"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { usePromptStateMachine } from "@/app/chat/hooks/usePromptStateMachine";
import { PromptShell } from "@/app/components/prompt/PromptShell";
import VoiaBloom from "@/app/components/StarField"; // Starfield-Overlay
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
  onToggleSaeule?: () => void;                     // ★ NEU
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
  onToggleSaeule,               // ← NEU sauber destrukturiert
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

  const dockClassName = "prompt-root";

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
        <DoormanIntro
          main={t("prompt.doorman.main")}
          sub={t("prompt.doorman.sub")}
        />
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
        onToggleSaeule={onToggleSaeule} // ★ NEU: Übergabe an Shell
      />
    </div>
  );
}

type DoormanIntroProps = {
  main: string;
  sub: string;
};

function DoormanIntro({ main, sub }: DoormanIntroProps) {
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: any) => setReduceMotion(e.matches);

    setReduceMotion(mq.matches);
    mq.addEventListener?.("change", handler);

    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // --- Reduced motion: statisch ---
  if (reduceMotion) {
    return (
      <div className="prompt-doorman" aria-hidden="true">
        <p className="prompt-doorman-main">{main}</p>
        <p className="prompt-doorman-sub">{sub}</p>
      </div>
    );
  }

  // --- Settings ---
  const START_DELAY = 3;
  const STAGGER = 0.035;
  const AFTER_MAIN = 0.25;

  return (
    <div
      className="prompt-doorman"
      aria-hidden="true"
      style={{ position: "relative" }}
    >
      {/* Soft cold fog mit etwas mehr Glow */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.97, filter: "blur(16px)" }}
        animate={{
          opacity: [0, 0.2, 0.1],
          scale: [0.97, 1.03, 1],
          filter: ["blur(16px)", "blur(24px)", "blur(18px)"],
        }}
        transition={{
          delay: START_DELAY,
          duration: 4.6,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(45% 35% at 50% 60%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 32%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* === Zeile 1 – Typewriter, weich & mit Glow === */}
      <motion.p
        className="prompt-doorman-main"
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{
          delay: START_DELAY,
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        }}
        style={{
          display: "inline-block",
          whiteSpace: "pre-wrap",
        }}
      >
        {Array.from(main).map((ch, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 1, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: START_DELAY + index * STAGGER,
              duration: 0.26,
              ease: [0.23, 1, 0.32, 1],
            }}
            style={{
              display: "inline-block",
              textShadow:
                "0 0 6px rgba(255,255,255,0.55), 0 0 14px rgba(120,180,255,0.45)",
            }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.p>

      {/* === Zeile 2 – folgt weich nach Zeile 1 === */}
      <motion.p
        className="prompt-doorman-sub"
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{
          delay:
            START_DELAY + main.length * STAGGER + AFTER_MAIN,
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        }}
        style={{
          display: "inline-block",
          whiteSpace: "pre-wrap",
        }}
      >
        {Array.from(sub).map((ch, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 1, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay:
                START_DELAY +
                main.length * STAGGER +
                AFTER_MAIN +
                index * STAGGER,
              duration: 0.26,
              ease: [0.23, 1, 0.32, 1],
            }}
            style={{
              display: "inline-block",
              textShadow:
                "0 0 5px rgba(255,255,255,0.45), 0 0 12px rgba(120,180,255,0.35)",
            }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}



export default PromptRoot;

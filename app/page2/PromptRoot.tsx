// app/chat/page2/PromptRoot.tsx
"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
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
    const handleChange = (event: any) => {
      setReduceMotion(!!event.matches);
    };

    setReduceMotion(mq.matches);
    mq.addEventListener?.("change", handleChange);

    return () => {
      mq.removeEventListener?.("change", handleChange);
    };
  }, []);

  // Reduced Motion → statischer Text, kein Effekt
  if (reduceMotion) {
    return (
      <div className="prompt-doorman" aria-hidden="true">
        <p className="prompt-doorman-main">{main}</p>
        <p className="prompt-doorman-sub">{sub}</p>
      </div>
    );
  }

  // Normalfall → sanfter Nebel + Blur/Fade-In nach 3s
  return (
    <div
      className="prompt-doorman"
      aria-hidden="true"
      style={{ position: "relative" }}
    >
      {/* gedimmter Nebel-Hauch, einmalig */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.96, filter: "blur(18px)" }}
        animate={{
          opacity: [0, 0.18, 0.08],
          scale: [0.96, 1.02, 1],
          filter: ["blur(18px)", "blur(26px)", "blur(16px)"],
          transition: { delay: 3, duration: 4.2, ease: "easeInOut" },
        }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(40% 30% at 50% 60%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 32%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Text – Cold Blur → klar, nach 3s */}
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { delay: 3, duration: 0.95, ease: [0.23, 1, 0.32, 1] },
        }}
        style={{ willChange: "transform, opacity, filter" }}
      >
        <p className="prompt-doorman-main">{main}</p>
        <p className="prompt-doorman-sub">{sub}</p>
      </motion.div>
    </div>
  );
}

export default PromptRoot;

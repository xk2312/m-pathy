// app/chat/hooks/usePromptStateMachine.ts

// ------------------------------------------------------------
// PromptState – Die 4 zentralen Zustände des neuen Prompt-OS
// ------------------------------------------------------------
export type PromptState =
  | "doorman-desktop"
  | "doorman-mobile"
  | "chat-desktop"
  | "chat-mobile";

// ------------------------------------------------------------
// Snapshot – alles, was UI/Components wissen müssen
// ------------------------------------------------------------
export type PromptStateSnapshot = {
  state: PromptState;
  isDoorman: boolean;
  isChat: boolean;
  isSendBlocked: boolean;
  layoutVariant: "desktop" | "mobile";
  modeVariant: "doorman" | "chat";
};

// ------------------------------------------------------------
// Input – reine Fakten über das System
// ------------------------------------------------------------
export type UsePromptStateMachineInput = {
  hasThread: boolean;   // Gibt es bereits Nachrichten im Chat?
  isMobile: boolean;    // Layout: mobile vs. desktop
  isThinking: boolean;  // KI antwortet / ist beschäftigt
};

// ------------------------------------------------------------
// Pure Logic – bestimmt exakt einen der 4 Prompt-Zustände
// ------------------------------------------------------------
function resolvePromptState(
  hasThread: boolean,
  isMobile: boolean
): PromptState {
  // Startzustand → Doorman
  if (!hasThread) {
    return isMobile ? "doorman-mobile" : "doorman-desktop";
  }

  // Chat existiert → Chat-Prompt
  return isMobile ? "chat-mobile" : "chat-desktop";
}

// ------------------------------------------------------------
// usePromptStateMachine – einziger Entry-Point
// ------------------------------------------------------------
export function usePromptStateMachine(
  input: UsePromptStateMachineInput
): PromptStateSnapshot {
  const { hasThread, isMobile, isThinking } = input;

  // 1. Kernstate bestimmen
  const state = resolvePromptState(hasThread, isMobile);

  // 2. Abgeleitete Merkmale
  const isDoorman =
    state === "doorman-desktop" || state === "doorman-mobile";

  const isChat = !isDoorman;

  const layoutVariant = state.endsWith("mobile")
    ? "mobile"
    : "desktop";

  const modeVariant = isDoorman ? "doorman" : "chat";

  // 3. Senden blockieren, wenn System beschäftigt
  const isSendBlocked = isThinking;

  // 4. Snapshot zurückgeben
  return {
    state,
    isDoorman,
    isChat,
    isSendBlocked,
    layoutVariant,
    modeVariant,
  };
}

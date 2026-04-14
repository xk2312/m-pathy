export function runNewChat(onClearChat?: () => void) {
  try {
    localStorage.removeItem("mpathy:thread:default");
  } catch {}

  try {
    const newConversationId = crypto.randomUUID();
    localStorage.setItem("mpathy:conversation:id", newConversationId);
  } catch {}

  onClearChat?.();
}
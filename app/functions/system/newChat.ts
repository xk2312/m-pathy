export default function runNewChat() {
  try {
    localStorage.removeItem("mpathy:thread:default");
  } catch {}

  try {
    const newConversationId = crypto.randomUUID();
    localStorage.setItem("mpathy:conversation:id", newConversationId);
  } catch {}

  window.dispatchEvent(new CustomEvent("mpathy:new-chat"));
}
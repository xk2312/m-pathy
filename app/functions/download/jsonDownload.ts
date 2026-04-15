import { buildChatExport } from "@/lib/exportChat";

export default function runJsonDownload() {
  try {
    const messages =
      typeof window !== "undefined" && Array.isArray((window as any).__m13Messages)
        ? (window as any).__m13Messages
        : [];

    const exportObj = buildChatExport(messages);
    const pretty = JSON.stringify(exportObj, null, 2);

    const blob = new Blob([pretty], {
      type: "application/json",
    });

    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = href;
    link.download = `mpathy-chat-${date}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch {}
}
import { buildChatExport } from "@/lib/exportChat";

export function runJsonDownload(messages: any[]) {
  try {
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
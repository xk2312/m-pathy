import { buildChatExport, chatExportToCSV } from "@/lib/exportChat";

export default function runCsvDownload() {
  try {
    const messages =
      typeof window !== "undefined" && Array.isArray((window as any).__m13Messages)
        ? (window as any).__m13Messages
        : [];

    const exportObj = buildChatExport(messages);
    const csv = chatExportToCSV(exportObj);
    const utf8BOM = "\uFEFF";

    const blob = new Blob([utf8BOM + csv], {
      type: "text/csv;charset=utf-8",
    });

    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = href;
    link.download = `mpathy-chat-${date}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch {}
}
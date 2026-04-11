"use client";
import React, { useEffect } from "react";
import styles from "./Saeule.module.css";
import { buildChatExport, chatExportToCSV } from "@/lib/exportChat";

type Props = {
  onClearChat?: () => void;
  messages: any[];
};

export default function Saeule({
  onClearChat,
  messages,
}: Props) {

// Exportiert den aktuellen Chat-Thread als JSON oder CSV
const exportThread = (format: "json" | "csv", messages: any[]) => {
  try {
    const exportObj = buildChatExport(messages);

    let blob: Blob;
    let extension: "json" | "csv" = format;

    if (format === "csv") {
      const csv = chatExportToCSV(exportObj);
      const utf8BOM = "\uFEFF"; // Excel/Numbers safe
      blob = new Blob([utf8BOM + csv], {
        type: "text/csv;charset=utf-8",
      });
    } else {
      const pretty = JSON.stringify(exportObj, null, 2);
      blob = new Blob([pretty], {
        type: "application/json",
      });
    }

    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = href;
    link.download = `mpathy-chat-${date}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch {
    // Export-Fehler bleiben still – der User verliert nichts
  }
};


  const handleDeleteImmediate = () => {
    try {
      localStorage.removeItem("mpathy:thread:default");
    } catch {}

    try {
      const newConversationId = crypto.randomUUID();
      localStorage.setItem("mpathy:conversation:id", newConversationId);
    } catch {}

    onClearChat?.();
  };

useEffect(() => {
  function handleCommand(e: any) {
    const cmd = e.detail?.command;

    if (cmd === "archive") {
      window.dispatchEvent(new CustomEvent("mpathy:archive:open"));
    }

    if (cmd === "export_csv") {
      exportThread("csv", messages || []);
    }

    if (cmd === "export_json") {
      exportThread("json", messages || []);
    }

    if (cmd === "new_chat") {
      handleDeleteImmediate();
    }
  }

  window.addEventListener("mpathy:command", handleCommand);

  return () => {
    window.removeEventListener("mpathy:command", handleCommand);
  };
}, [messages]);

return (
  <aside
    className={styles.saeule}
    aria-label="Column - Controls & Selection"
    data-test="saeule"
  />
);
}

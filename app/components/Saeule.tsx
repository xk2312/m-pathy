"use client";
import React, { useEffect, useState } from "react";
import styles from "./Saeule.module.css";
import { buildChatExport, chatExportToCSV } from "@/lib/exportChat";
import { loadInitialSystemState } from "@/lib/system/initialLoad";
import { saveUserActivationState } from "@/lib/db/userActivationState";
import registry from "@/registry/registry.json";
import { wallIcons } from "@/components/icons/wallIcons";

type Props = {
  onClearChat?: () => void;
  messages: any[];
};

type State = Awaited<ReturnType<typeof loadInitialSystemState>>;

export default function Saeule({
  onClearChat,
  messages,
}: Props) {
  const [state, setState] = useState<State | null>(null);

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
  loadInitialSystemState().then(setState);
}, []);

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

if (!state) return null;

return (
  <aside
    className={styles.saeule}
    aria-label="Column - Controls & Selection"
    data-test="saeule"
  >
    {state.isOnboardingRequired ? (
      <button
      className={styles.onboardingButton}
      onClick={() => {
      window.dispatchEvent(
        new CustomEvent("mpathy:command", {
          detail: { command: "onboarding" }
        })
      );
    }}
    >
  Start Onboarding
</button>
    ) : (
      state.activation.items
        .sort((a, b) => a.order - b.order)
        .map((item) => {
          const entry = registry.registry.entries.find(
            (e: any) => e.id === item.id
          );

          if (!entry) return null;

          const isLocked =
            state.onboardingStatus !== "completed" && item.id !== "onboarding";

          return (
            <button
          key={item.id}
          className={`${styles.wallItem} ${
            state.activation.activeApp === item.id ? styles.active : ""
          } ${isLocked ? styles.locked : ""}`}
          onClick={async () => {
            if (!state) return;

            const isLocked =
              state.onboardingStatus !== "completed" && item.id !== "onboarding";

            if (isLocked) return;

            const updatedActivation = {
              ...state.activation,
              activeApp: item.id
            };

            await saveUserActivationState(updatedActivation);

            setState({
              ...state,
              activation: updatedActivation
            });

            window.dispatchEvent(
              new CustomEvent("mpathy:command", {
                detail: { command: entry.command || item.id }
              })
            );
          }}
        >
            <span className={styles.iconBox}>
            {wallIcons[item.id] || null}
        </span>
          </button>
        );
        })
    )}
  </aside>
);
}

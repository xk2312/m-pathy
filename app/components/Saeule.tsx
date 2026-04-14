"use client";
import React, { useEffect, useState } from "react";
import styles from "./Saeule.module.css";
import registry from "@/registry/registry.json";
import ArchiveIcon from "@/components/icons/wall/archive";
import SettingsIcon from "@/components/icons/wall/settings";
import NewChatIcon from "@/components/icons/wall/new_chat";
import CsvDownloadIcon from "@/components/icons/wall/csv_download";
import JsonDownloadIcon from "@/components/icons/wall/json_download";
import { runNewChat } from "@/app/functions/system/newChat";
import { openArchive } from "@/app/functions/system/openArchive";
import { runCsvDownload } from "@/app/functions/download/csvDownload";
import { runJsonDownload } from "@/app/functions/download/jsonDownload";
import { runExecution } from "@/lib/system/runExecution";

type Props = {
  onClearChat?: () => void;
  messages: any[];
};

export default function Saeule({
  onClearChat,
  messages,
}: Props) {

const ICON_MAP: Record<string, JSX.Element> = {
  archive: <ArchiveIcon />,
  settings: <SettingsIcon />,
  new_chat: <NewChatIcon />,
  csv_download: <CsvDownloadIcon />,
  json_download: <JsonDownloadIcon />,
};
  const [items, setItems] = useState<string[]>([]);

useEffect(() => {
  function handleRegistryUpdate(e: any) {
    const registry = e.detail?.user_registry;

    if (registry?.items) {
      setItems(registry.items);
    }
  }

  window.addEventListener("mpathy:registry:update", handleRegistryUpdate);

  return () => {
    window.removeEventListener("mpathy:registry:update", handleRegistryUpdate);
  };
}, []);

useEffect(() => {
  function handleCommand(e: any) {
    const cmd = e.detail?.command;

    if (cmd === "archive") {
      openArchive();
    }

    if (cmd === "export_csv") {
      runCsvDownload(messages || []);
    }

    if (cmd === "export_json") {
      runJsonDownload(messages || []);
    }

    if (cmd === "new_chat") {
      runNewChat(onClearChat);
    }
  }

  window.addEventListener("mpathy:command", handleCommand);

  return () => {
    window.removeEventListener("mpathy:command", handleCommand);
  };
}, [messages, onClearChat]);


const CATEGORY_ORDER = ["system", "applications", "functions"];
const wallEntries = items
  .map((id: string) =>
    registry.registry.entries.find((e: any) => e.id === id)
  )
  .filter(
    (entry: any) =>
      entry &&
      entry.state === "active" &&
      entry.ui?.ui_surface === "wall"
  );

const grouped = CATEGORY_ORDER.reduce((acc: any, category) => {
  acc[category] = wallEntries.filter(
    (entry: any) => entry.category === category
  );
  return acc;
}, {});
return (
  <aside
    className={styles.saeule}
    aria-label="Column - Controls & Selection"
    data-test="saeule"
  >
    {items.length === 0 ? (
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
      CATEGORY_ORDER.map((category) => {
        const entries = grouped[category];

        if (!entries || entries.length === 0) return null;

        return (
          <React.Fragment key={category}>
            <div className={styles.sectionTitle}>
              {category}
            </div>

            {entries.map((entry: any) => (
              <button
                key={entry.id}
                className={styles.wallItem}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("mpathy:command", {
                    detail: { command: entry.command || entry.id }                    })
                  );
                }}
              >
                <span className={styles.iconBox}>
                {ICON_MAP[entry.id] || null}                </span>
              </button>
            ))}
          </React.Fragment>
        );
      })
    )}
  </aside>
);
}

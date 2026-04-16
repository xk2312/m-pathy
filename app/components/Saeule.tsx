"use client";
import React, { useEffect, useState } from "react";
import styles from "./Saeule.module.css";
import registry from "@/registry/registry.json";
import { ICON_REGISTRY } from "@/components/icons/wall/iconRegistry";

type Props = {
  onClearChat?: () => void;
  messages: any[];
};

export default function Saeule({ onClearChat, messages }: Props) {
const [items, setItems] = useState<any[]>(() => {
  try {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("mpathy:user_registry");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
});

  // 🔥 1. Initial Load
useEffect(() => {
  try {
    const stored = localStorage.getItem("mpathy:user_registry");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.items) {
        setItems(parsed.items);
      }
    }
  } catch {}
}, []);

  // 🔥 2. Live Updates
  useEffect(() => {
    function handleRegistryUpdate(e: any) {
      const registry = e.detail?.user_registry;

      if (registry?.items) {
        setItems(registry.items);
      }
    }

    window.addEventListener("mpathy:registry:update", handleRegistryUpdate);

    return () => {
      window.removeEventListener(
        "mpathy:registry:update",
        handleRegistryUpdate
      );
    };
  }, []);

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
{items.length === 0 ? (        <button
          className={styles.onboardingButton}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("mpathy:hidden-prompt", {
                detail: { prompt: "echo-onboarding" },
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
              <div className={styles.sectionTitle}>{category}</div>

              {entries.map((entry: any, index: number) => (
              <button
                key={entry.id}
                className={`${styles.wallItem} ${styles["m13-enter"]}`}
                style={{ animationDelay: `${index * 500}ms` }}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("mpathy:command", {
                      detail: { command: entry.command },
                    })
                  );
                }}
              >
                  <span className={styles.iconBox}>
                    {ICON_REGISTRY[entry.id] || null}
                  </span>
                  <span className={styles.label}>
                    {entry.ui?.label ?? entry.id}
                  </span>
                </button>
              ))}
            </React.Fragment>
          );
        })
      )}
    </aside>
  );
}
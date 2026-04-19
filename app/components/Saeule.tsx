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
const [items, setItems] = useState<any[]>([]);
const [isClient, setIsClient] = useState(false);

  // 🔥 1. Initial Load
useEffect(() => {
  try {
    console.log("[M13][SAEULE] BOOT START");

    const dbRequest = indexedDB.open("MpathyRuntime", 1);

    dbRequest.onupgradeneeded = function () {
      const db = dbRequest.result;
      console.log("[M13][SAEULE] DB UPGRADE");
      if (!db.objectStoreNames.contains("user")) {
        db.createObjectStore("user");
      }
    };

    dbRequest.onsuccess = function () {
      console.log("[M13][SAEULE] DB OPEN SUCCESS");

      const db = dbRequest.result;
      const tx = db.transaction("user", "readonly");
      const store = tx.objectStore("user");

      const getRequest = store.get("registry");

      getRequest.onsuccess = function () {
        const user_registry = getRequest.result;

        console.log("[M13][SAEULE] DB RESULT", user_registry);

        if (user_registry?.items) {
          console.log("[M13][SAEULE] SET ITEMS", user_registry.items);
          setItems(user_registry.items);
        } else {
          console.log("[M13][SAEULE] NO ITEMS FOUND");
        }
      };

      getRequest.onerror = function (err) {
        console.error("[M13][SAEULE] READ ERROR", err);
      };

      tx.oncomplete = function () {
        console.log("[M13][SAEULE] TX COMPLETE");
      };

      tx.onerror = function (err) {
        console.error("[M13][SAEULE] TX ERROR", err);
      };
    };

    dbRequest.onerror = function (err) {
      console.error("[M13][SAEULE] DB OPEN ERROR", err);
    };

  } catch (err) {
    console.error("[M13][SAEULE] BOOT FAILED", err);
  }

  setIsClient(true);
}, []);

useEffect(() => {
  function handleRegistryUpdate(event: any) {
    try {
      console.log("[M13][SAEULE] EVENT RECEIVED", event.detail);

      const user_registry = event?.detail?.user_registry;

      if (user_registry?.items) {
        console.log("[M13][SAEULE] EVENT SET ITEMS", user_registry.items);
        setItems(user_registry.items);
      } else {
        console.log("[M13][SAEULE] EVENT NO ITEMS");
      }

    } catch (err) {
      console.error("[M13][SAEULE] EVENT ERROR", err);
    }
  }

  console.log("[M13][SAEULE] EVENT LISTENER REGISTER");
  window.addEventListener("mpathy:registry:update", handleRegistryUpdate);

  return () => {
    console.log("[M13][SAEULE] EVENT LISTENER CLEANUP");
    window.removeEventListener("mpathy:registry:update", handleRegistryUpdate);
  };
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

    if (!isClient) return null;

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
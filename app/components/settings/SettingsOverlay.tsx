"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SettingsIcon from "@/components/icons/wall/settings";

/**
 * TYPES
 */

type UserRegistry = {
  profile?: {
    name?: string;
    tone?: string | number;
  };
  security?: {
    public_key?: string;
  };
  infrastructure?: {
    server?: any;
  };
  items?: string[];
  updated_at?: string;
};

/**
 * DEBUG HELPERS
 */

const DEBUG_PREFIX = "[M13][SETTINGS]";

function log(...args: any[]) {
  console.log(DEBUG_PREFIX, ...args);
}

function warn(...args: any[]) {
  console.warn(DEBUG_PREFIX, ...args);
}

/**
 * INDEXED DB (placeholder for now)
 */

async function loadUserRegistry(): Promise<UserRegistry | null> {
  log("LOAD → start");

  try {
    const raw = localStorage.getItem("mpathy:user_registry");

    if (!raw) {
      warn("LOAD → no registry found");
      return null;
    }

    const parsed = JSON.parse(raw);
    log("LOAD → success", parsed);

    return parsed;
  } catch (err) {
    warn("LOAD → failed", err);
    return null;
  }
}

async function saveUserRegistry(registry: UserRegistry) {
  log("SAVE → start", registry);

  try {
    localStorage.setItem("mpathy:user_registry", JSON.stringify(registry));
    log("SAVE → success");
  } catch (err) {
    warn("SAVE → failed", err);
  }
}

/**
 * COMPONENT
 */

export default function SettingsOverlay() {
  /**
   * STATE
   */

  const [isOpen, setIsOpen] = useState(false);
  const [registry, setRegistry] = useState<UserRegistry | null>(null);
  const [draft, setDraft] = useState<UserRegistry | null>(null);


 /**
 * LIFECYCLE
 */

useEffect(() => {
  log("MOUNT");

  function handleCommand(event: any) {
    const cmd = event?.detail?.command;

    log("EVENT RAW", cmd);

    if (cmd === "open_settings") {
      log("EVENT → open settings received");
      setIsOpen(true);
    }
  }

  window.addEventListener("mpathy:command", handleCommand);

  (async () => {
    const data = await loadUserRegistry();

    if (!data) {
      warn("INIT → empty registry");
      return;
    }

    setRegistry(data);
    setDraft(data);

    log("INIT → state set", data);
  })();

  return () => {
    window.removeEventListener("mpathy:command", handleCommand);
  };
}, []);

/**
 * HANDLERS
 */

const handleOpen = () => {
  log("UI → open overlay");
  setIsOpen(true);
};

const handleClose = () => {
  log("UI → close overlay");

  setIsOpen(false);

  if (!registry) {
    log("STATE → no registry to reset");
    return;
  }

  const reset = { ...registry };
  setDraft(reset);

  log("STATE → draft reset", reset);
};

const handleChange = (path: string, value: any) => {
  if (!draft) return;

  log("CHANGE →", path, value);

  const updated = { ...draft };

  const keys = path.split(".");
  let obj: any = updated;

  for (let i = 0; i < keys.length - 1; i++) {
    obj[keys[i]] = obj[keys[i]] || {};
    obj = obj[keys[i]];
  }

  obj[keys[keys.length - 1]] = value;

  setDraft(updated);
  log("STATE → draft updated", updated);
};

const handleSave = async () => {
  if (!draft) return;

  log("ACTION → save triggered");

  const updated = {
    ...draft,
    updated_at: new Date().toISOString(),
  };

  await saveUserRegistry(updated);

  setRegistry(updated);
  setDraft(updated);

  log("STATE → persisted", updated);
};

  /**
 * RENDER
 */

if (!isOpen) {
  return null;
}

// =========================
// SPACING SYSTEM
// =========================

const SPACING = {
  rootX: "px-4 sm:px-6 lg:px-8",
  panelTop: "mt-20 sm:mt-24",
  panelX: "px-6 sm:px-8",
  panelY: "py-7 sm:py-8",
  headerBottom: "mb-7",
  bodyGap: "space-y-8",
  sectionGap: "space-y-3",
  fieldGap: "space-y-3",
  dangerTop: "pt-6",
  debugTop: "mt-8",
  footerTop: "mt-8"
};

// =========================
// COLOR SYSTEM
// =========================

const COLOR = {
  bg: "bg-[#080808]",
  surface: "bg-[#121418]",
  surface2: "bg-[#1E2024]",
  border: "border-[rgba(255,255,255,0.10)]",

  textPrimary: "text-[#F5F6F7]",
  textSecondary: "text-[rgba(245,246,247,0.72)]",
  textMuted: "text-[rgba(245,246,247,0.52)]",

  accent: "text-[#53E9FD]",
  danger: "text-red-400"
};

// =========================
// RENDER
// =========================

return createPortal(
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#080808",
      padding: "24px",
      overflowY: "auto",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "640px",
        background: "#121418",
        borderRadius: "20px",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "20px", height: "20px", color: "#875DC2" }}>
            <SettingsIcon />
          </div>
          <div style={{ color: "#F5F6F7", fontSize: "20px", fontWeight: 500 }}>
            Settings
          </div>
        </div>

        <button
          onClick={handleClose}
          style={{
            color: "#aaa",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        
        {/* SECTION */}
        {[
          { title: "General", fields: 2 },
          { title: "Security", fields: 1 },
          { title: "Infrastructure", fields: 2 },
        ].map((section) => (
          <div key={section.title} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            
            <div style={{ color: "#aaa", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {section.title}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array.from({ length: section.fields }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "44px",
                    borderRadius: "10px",
                    background: "#1E2024",
                  }}
                />
              ))}
            </div>

          </div>
        ))}

        {/* DANGER ZONE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ color: "#ff6b6b", fontSize: "12px", textTransform: "uppercase" }}>
            Danger Zone
          </div>

          <div
            style={{
              height: "44px",
              borderRadius: "10px",
              background: "#1E2024",
            }}
          />
        </div>

      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: "12px" }}>
        
        <button
          onClick={handleSave}
          style={{
            padding: "13px 22px",
            borderRadius: "12px",
            background: "#53E9FD",
            color: "#000",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Save
        </button>

        <button
          onClick={handleClose}
          style={{
            padding: "13px 22px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: "#F5F6F7",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>,
  document.body
);
}
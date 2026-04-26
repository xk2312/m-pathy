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
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("MpathyRuntime");

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });

    const tx = db.transaction("user", "readonly");
    const store = tx.objectStore("user");

    const result = await new Promise<any>((resolve, reject) => {
      const req = store.get("registry");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

   if (!result) {
  warn("LOAD → empty");
  return null;
}

/**
 * RUNTIME NORMALIZATION (SAFE)
 */
if (!result.infrastructure) {
  result.infrastructure = {};
}

if (!result.infrastructure.server) {
  result.infrastructure.server = {};
}

if (typeof result.infrastructure.server !== "object") {
  result.infrastructure.server = { url: result.infrastructure.server };
}

if (!("url" in result.infrastructure.server)) {
  result.infrastructure.server.url = "";
}

if (!("api_key" in result.infrastructure.server)) {
  result.infrastructure.server.api_key = "";
}

if (!("status" in result.infrastructure.server)) {
  result.infrastructure.server.status = "unknown";
}

log("LOAD → success", result);
return result;

  } catch (err) {
    warn("LOAD → failed", err);
    return null;
  }
}


async function saveUserRegistry(registry: UserRegistry) {
  log("SAVE → start", registry);

  try {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("MpathyRuntime");

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });

    const tx = db.transaction("user", "readwrite");
    const store = tx.objectStore("user");

    store.put(registry, "registry");

    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });

    log("SAVE → success (IndexedDB)");
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
const [isClosing, setIsClosing] = useState(false);
const [registry, setRegistry] = useState<UserRegistry | null>(null);
const [draft, setDraft] = useState<UserRegistry | null>(null);
const [initial, setInitial] = useState<UserRegistry | null>(null);

const [isSaving, setIsSaving] = useState(false);
const [isSaved, setIsSaved] = useState(false);

const isDirty = (() => {
  if (!draft || !initial) return false;

  return (
    draft.profile?.name !== initial.profile?.name ||
    String(draft.profile?.tone ?? "") !== String(initial.profile?.tone ?? "") ||
    draft.infrastructure?.server?.url !== initial.infrastructure?.server?.url ||
    draft.infrastructure?.server?.api_key !== initial.infrastructure?.server?.api_key
  );
})();


 /**
 * LIFECYCLE
 */

useEffect(() => {
  log("MOUNT");

  async function init() {
    const data = await loadUserRegistry();

    if (!data) {
      warn("INIT → empty registry");
      return;
    }

    setRegistry(data);
    setDraft(data);
    setInitial(JSON.parse(JSON.stringify(data)));

    log("INIT → state set", data);
  }

  async function handleOpen() {
  if (isClosing) return; // 🔥 CRITICAL FIX

  console.log("[SETTINGS EVENT RECEIVED]");
  log("EVENT → open settings received");

  await init();

  setIsOpen(true);
}

  window.addEventListener("mpathy:settings:open", handleOpen);

  // initial load (optional, aber safe)
  init();

  return () => {
    window.removeEventListener("mpathy:settings:open", handleOpen);
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

  setIsClosing(true);
  setIsOpen(false);

  if (!registry) {
    log("STATE → no registry to reset");
    return;
  }

  const reset = { ...registry };
  setDraft(reset);

  log("STATE → draft reset", reset);

  // 🔥 ONLY trigger mobile overlay on small screens
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("mpathy:mobile:open"));
    }, 0);
  }
};
setTimeout(() => {
  setIsClosing(false);
}, 150);

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
  if (!draft || !isDirty) return;

  setIsSaving(true);
  setIsSaved(false);

  log("ACTION → save triggered");

  const updated = {
    ...draft,
    updated_at: new Date().toISOString(),
  };

  await saveUserRegistry(updated);

  setRegistry(updated);
  setDraft(updated);
  setInitial(JSON.parse(JSON.stringify(updated)));

  setIsSaving(false);
  setIsSaved(true);

  setTimeout(() => {
    setIsSaved(false);
  }, 1500);

  log("STATE → persisted", updated);
};

  /**
 * RENDER
 */

if (!isOpen) {
  return null;
}

if (typeof document === "undefined") {
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

const portalTarget =
  typeof document !== "undefined" ? document.body : null;
console.log("[SETTINGS RENDER]", isOpen);
if (!portalTarget) return null;

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
        {/* GENERAL */}
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  
  <div style={{ color: "#aaa", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
    General
  </div>

  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    
   {/* NAME */}
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ fontSize: "12px", color: "#888" }}>
        Name
      </div>

      <input
        value={draft?.profile?.name ?? ""}
        onChange={(e) => handleChange("profile.name", e.target.value)}
        style={{
          height: "44px",
          borderRadius: "10px",
          background: "#1E2024",
          border: "none",
          padding: "0 12px",
          color: "#F5F6F7",
        }}
      />
    </div>

    {/* TONE */}
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ fontSize: "12px", color: "#888" }}>
        Tone
      </div>

      <select
        value={String(draft?.profile?.tone ?? "2")}
        onChange={(e) => handleChange("profile.tone", e.target.value)}
        style={{
          height: "44px",
          borderRadius: "10px",
          background: "#1E2024",
          border: "none",
          padding: "0 12px",
          color: "#F5F6F7",
        }}
      >
        <option value="1">Förmlich</option>
        <option value="2">Persönlich</option>
      </select>
    </div>

  </div>

</div>

{/* SECURITY */}
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  
  <div style={{ color: "#aaa", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
    Security
  </div>

  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    
    <div style={{ fontSize: "12px", color: "#888" }}>
      Public Key
    </div>

    <input
      value={draft?.security?.public_key ?? ""}
      readOnly
      style={{
        height: "44px",
        borderRadius: "10px",
        background: "#1E2024",
        border: "none",
        padding: "0 12px",
        color: "#888",
        cursor: "not-allowed",
      }}
    />

  </div>

</div>

{/* INFRASTRUCTURE */}
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  <div style={{ color: "#aaa", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
    Infrastructure
  </div>

  {/* SERVER URL */}
<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
  <div style={{ fontSize: "12px", color: "#888" }}>
    Server URL
  </div>

  <input
    value={draft?.infrastructure?.server?.url ?? ""}
    onChange={(e) =>
      handleChange("infrastructure.server.url", e.target.value)
    }
    style={{
      height: "44px",
      borderRadius: "10px",
      background: "#1E2024",
      border: "none",
      padding: "0 12px",
      color: "#F5F6F7",
    }}
  />
</div>

{/* API KEY */}
<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
  <div style={{ fontSize: "12px", color: "#888" }}>
    API Key
  </div>

  <input
    value={draft?.infrastructure?.server?.api_key ?? ""}
    onChange={(e) =>
      handleChange("infrastructure.server.api_key", e.target.value)
    }
    style={{
      height: "44px",
      borderRadius: "10px",
      background: "#1E2024",
      border: "none",
      padding: "0 12px",
      color: "#F5F6F7",
    }}
  />
</div>
</div>

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

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
  
  <div style={{ fontSize: "12px", color: "#ff6b6b" }}>
    Account Deletion (coming soon)
  </div>

  <div
    style={{
      height: "44px",
      borderRadius: "10px",
      background: "#1E2024",
      opacity: 0.6,
    }}
  />

</div>
        </div>

      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: "12px" }}>
        
       <button
  onClick={handleSave}
  disabled={!isDirty || isSaving}
  style={{
    padding: "13px 22px",
    borderRadius: "12px",
    background: !isDirty
      ? "#2a2a2a"
      : isSaved
      ? "#4CAF50"
      : "#53E9FD",
    color: !isDirty ? "#777" : "#000",
    border: "none",
    cursor: !isDirty ? "not-allowed" : "pointer",
    fontWeight: 500,
    transition: "all 0.2s ease",
    opacity: isSaving ? 0.7 : 1,
  }}
>
  {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
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
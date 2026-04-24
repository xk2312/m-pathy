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
    className={`fixed inset-0 z-[9999] flex items-start justify-center ${COLOR.bg} ${SPACING.rootX}`}
  >
    <div
      className={`w-full max-w-2xl ${SPACING.panelTop} ${COLOR.surface} rounded-2xl ${SPACING.panelX} ${SPACING.panelY}`}
    >
      
      {/* ================= HEADER ================= */}
      <div className={`flex justify-between items-center ${SPACING.headerBottom}`}>
  
        {/* LEFT: ICON + TITLE */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 text-[#875DC2]">
            <SettingsIcon />
          </div>

          <h2 className={`${COLOR.textPrimary} text-xl font-medium`}>
            Settings
          </h2>
        </div>

        {/* RIGHT: CLOSE */}
        <button
          onClick={handleClose}
          className={`${COLOR.textSecondary} hover:text-white transition cursor-pointer`}
        >
          ✕
        </button>
</div>


     {/* ================= CONTENT ================= */}
<div className={SPACING.bodyGap}>
  
  {/* GENERAL */}
  <div className={SPACING.sectionGap}>
    <div className={`text-sm ${COLOR.textSecondary} uppercase tracking-wide`}>
      General
    </div>

    <div className={SPACING.fieldGap}>
      <div className={`h-10 ${COLOR.surface2} rounded-md`} />
      <div className={`h-10 ${COLOR.surface2} rounded-md`} />
    </div>
  </div>

  {/* SECURITY */}
  <div className={SPACING.sectionGap}>
    <div className={`text-sm ${COLOR.textSecondary} uppercase tracking-wide`}>
      Security
    </div>

    <div className={SPACING.fieldGap}>
      <div className={`h-10 ${COLOR.surface2} rounded-md`} />
    </div>
  </div>

  {/* INFRASTRUCTURE */}
  <div className={SPACING.sectionGap}>
    <div className={`text-sm ${COLOR.textSecondary} uppercase tracking-wide`}>
      Infrastructure
    </div>

    <div className={SPACING.fieldGap}>
      <div className={`h-10 ${COLOR.surface2} rounded-md`} />
      <div className={`h-10 ${COLOR.surface2} rounded-md`} />
    </div>
  </div>

  {/* DANGER ZONE */}
  <div className={`${SPACING.sectionGap} ${SPACING.dangerTop} border-t ${COLOR.border}`}>
    <div className={`text-sm ${COLOR.danger} uppercase tracking-wide`}>
      Danger Zone
    </div>

    <div className={SPACING.fieldGap}>
      <div className={`h-10 ${COLOR.surface2} rounded-md`} />
    </div>
  </div>

</div>


{/* ================= DEBUG ================= */}
<div className={SPACING.debugTop}>
  <pre className={`text-xs ${COLOR.textMuted} overflow-auto max-h-64`}>
    {JSON.stringify(draft, null, 2)}
  </pre>
</div>


{/* ================= ACTIONS ================= */}
<div className={`flex gap-3 ${SPACING.footerTop}`}>
  
  <button
  onClick={handleSave}
  className={`px-6 py-3 rounded-lg bg-[#53E9FD] text-black font-medium transition hover:opacity-90 active:scale-[0.98] cursor-pointer`}
>
    Save
  </button>

  <button
  onClick={handleClose}
  className={`px-6 py-3 rounded-lg border border-[rgba(255,255,255,0.10)] text-[#F5F6F7] bg-transparent transition hover:bg-white/5 active:scale-[0.98] cursor-pointer`}
>
    Cancel
  </button>

</div>
    </div>
  </div>,
  document.body
);
}
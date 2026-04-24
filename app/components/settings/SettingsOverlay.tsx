"use client";

import React, { useEffect, useState } from "react";

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
 * -> wird später konkretisiert
 */

async function loadUserRegistry(): Promise<UserRegistry | null> {
  log("LOAD → start");

  try {
    // TODO: echte IndexedDB Verbindung
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
    // TODO: echte IndexedDB Verbindung
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

  // 🔥 LISTEN TO WALL COMMANDS
function handleCommand(event: any) {
  const cmd = event?.detail?.command;

  log("EVENT RAW", cmd);

  if (cmd === "settings") {
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

  const reset = { ...registry }; // wichtig: neue Referenz
  setDraft(reset);

  log("STATE → draft reset", reset);
};

  const handleChange = (path: string, value: any) => {
    if (!draft) return;

    log("CHANGE →", path, value);

    const updated = { ...draft };

    // simple path setter (wird später verbessert)
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
// SPACING SYSTEM (MASTER CONTROL)
// =========================

const SPACING = {
  overlayTop: "mt-28",
  containerPadding: "p-8",
  headerBottom: "mb-8",
  sectionGap: "space-y-12",
  sectionInner: "space-y-4",
  inputGap: "space-y-3",
  actionsTop: "mt-10"
};


// =========================
// RENDER
// =========================

return (
  <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80">
    
    <div
      className={`
        w-full max-w-2xl
        ${SPACING.overlayTop}
        bg-neutral-900
        rounded-2xl
        ${SPACING.containerPadding}
      `}
    >
      
      {/* ================= HEADER ================= */}
      <div className={`flex justify-between items-center ${SPACING.headerBottom}`}>
        <h2 className="text-white text-xl font-medium">
          Settings
        </h2>

        <button
          onClick={handleClose}
          className="text-neutral-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>


      {/* ================= CONTENT ================= */}
      <div className={SPACING.sectionGap}>

        {/* GENERAL (placeholder) */}
        <div className={SPACING.sectionInner}>
          <div className="text-sm text-neutral-400 uppercase tracking-wide">
            General
          </div>

          <div className={SPACING.inputGap}>
            <div className="h-10 bg-neutral-800 rounded-md" />
            <div className="h-10 bg-neutral-800 rounded-md" />
          </div>
        </div>


        {/* SECURITY (placeholder) */}
        <div className={SPACING.sectionInner}>
          <div className="text-sm text-neutral-400 uppercase tracking-wide">
            Security
          </div>

          <div className={SPACING.inputGap}>
            <div className="h-10 bg-neutral-800 rounded-md" />
          </div>
        </div>


        {/* INFRASTRUCTURE (placeholder) */}
        <div className={SPACING.sectionInner}>
          <div className="text-sm text-neutral-400 uppercase tracking-wide">
            Infrastructure
          </div>

          <div className={SPACING.inputGap}>
            <div className="h-10 bg-neutral-800 rounded-md" />
            <div className="h-10 bg-neutral-800 rounded-md" />
          </div>
        </div>


        {/* DANGER ZONE (placeholder) */}
        <div className={`${SPACING.sectionInner} pt-6 border-t border-neutral-800`}>
          <div className="text-sm text-red-400 uppercase tracking-wide">
            Danger Zone
          </div>

          <div className={SPACING.inputGap}>
            <div className="h-10 bg-neutral-800 rounded-md" />
          </div>
        </div>

      </div>


      {/* ================= DEBUG ================= */}
      <div className="mt-10">
        <pre className="text-xs text-neutral-500 overflow-auto max-h-64">
          {JSON.stringify(draft, null, 2)}
        </pre>
      </div>


      {/* ================= ACTIONS ================= */}
      <div className={`flex gap-3 ${SPACING.actionsTop}`}>
        
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-white text-black rounded-md"
        >
          Save
        </button>

        <button
          onClick={handleClose}
          className="px-4 py-2 border border-white text-white rounded-md"
        >
          Cancel
        </button>
);
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-white text-black rounded"
          >
            Save
          </button>

          <button
            onClick={handleClose}
            className="px-4 py-2 border border-white text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
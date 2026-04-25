"use client";

import registry from "@/registry/registry.json";

type RegistryEntry = {
  id: string;
  command: string;
  path?: string | null;
};

function resolveEntry(command: string): RegistryEntry | null {
  const entries = (registry as any)?.registry?.entries ?? [];
  return entries.find((e: any) => e.command === command) || null;
}

async function executeCommand(command: string) {
  try {
    const entry = resolveEntry(command);

    if (!entry) {
      console.error("[Dispatcher] Command not found:", command);
      return;
    }

    // 👉 UI-only commands (kein path)
if (!entry.path) {
  return;
}

    // 👉 dynamischer Import
    if (!entry.path || typeof entry.path !== "string") {
  console.warn("[Dispatcher] Skipping command without path:", command);
  return;
}

let mod;

switch (entry.path) {
  case "functions/system/newChat":
    mod = await import("@/app/functions/system/newChat");
    break;

  case "functions/system/openArchive":
    mod = await import("@/app/functions/system/openArchive");
    break;

  case "functions/system/openSettings":
  mod = await import("@/app/functions/system/openSettings");
  break;  

  case "functions/download/csvDownload":
    mod = await import("@/app/functions/download/csvDownload");
    break;

  case "functions/download/jsonDownload":
    mod = await import("@/app/functions/download/jsonDownload");
    break;

  default:
    throw new Error(`Unknown function path: ${entry.path}`);
}   const fn = mod?.default;

    if (typeof fn !== "function") {
      console.error(
        "[Dispatcher] Invalid function export in:",
        entry.path
      );
      return;
    }

    // 👉 Execute
    await fn();

  } catch (err) {
    console.error("[Dispatcher] Execution failed:", err);
  }
}

// 🔥 GLOBAL LISTENER (einmalig)
export function initCommandDispatcher() {
  if (typeof window === "undefined") return;

  // verhindert doppelte Registrierung
  if ((window as any).__m13DispatcherInitialized) return;

  window.addEventListener("mpathy:command", (e: any) => {
  const command = e?.detail?.command;

  console.log("[DISPATCH EVENT]", command); // 👈 HIER

  if (!command) return;

  executeCommand(command);
});

  (window as any).__m13DispatcherInitialized = true;

  console.log("[Dispatcher] Initialized");
}
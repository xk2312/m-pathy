"use client";

import React from "react";
import { t } from "@/lib/i18n";
import { logEvent } from "../../lib/auditLogger";

function emit(text: string) {
  try {
    window.dispatchEvent(
      new CustomEvent("mpathy:system-message", {
        detail: { kind: "mode", text, ts: new Date().toISOString() },
      })
    );
  } catch {
    /* silent */
  }
}

export default function TopCTA() {
  return (
    <div className="fixed inset-x-0 top-2 z-[1000] flex justify-center pointer-events-none">
      <button
        type="button"
        aria-label={t("startBuilding")}
        onClick={() => {
          const text = t("startBuildingMsg");
          emit(text);
          try {
            logEvent("cta_start_building_clicked", {});
          } catch {
            /* silent */
          }
        }}
        className="pointer-events-auto px-4 py-2 rounded-full shadow-md bg-slate-900 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
      >
        {t("startBuilding")}
      </button>
    </div>
  );
}

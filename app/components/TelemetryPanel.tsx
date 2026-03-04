"use client";

import { useState } from "react";

type TelemetryCockpit = {
  system: string;
  version: string;
  promptCounter: string;
  driftState: string;
  effectiveMode: string;
  expertId: string;
};

type TelemetryParsed = Record<string, string>;

type Props = {
  telemetry: {
    cockpit: TelemetryCockpit;
    parsed: TelemetryParsed;
  };
};

function getDriftColor(state: string) {
  const s = state?.toLowerCase();

  if (s === "none") return "bg-cyan-500/15 text-cyan-400 border-cyan-400/30";
  if (s === "low") return "bg-yellow-500/15 text-yellow-400 border-yellow-400/30";
  if (s === "medium") return "bg-orange-500/15 text-orange-400 border-orange-400/30";
  if (s === "high") return "bg-red-500/15 text-red-400 border-red-400/30";

  return "bg-gray-500/10 text-gray-400 border-gray-400/20";
}

export default function TelemetryPanel({ telemetry }: Props) {
  const [open, setOpen] = useState(true);

  const { cockpit, parsed } = telemetry;

  return (
    <div className="mt-3 mb-4">
      {/* Cockpit */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 px-5 py-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

          {/* System */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">System</span>
            <span className="text-sm font-medium text-white">
              {cockpit.system}
            </span>
          </div>

          {/* Version */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Version</span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
              {cockpit.version}
            </span>
          </div>

          {/* Prompt Counter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Prompt</span>
            <span className="rounded-full bg-white/5 px-4 py-1 font-mono text-sm text-white">
              {cockpit.promptCounter}
            </span>
          </div>

          {/* Drift */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Drift</span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${getDriftColor(
                cockpit.driftState
              )}`}
            >
              {cockpit.driftState}
            </span>
          </div>

          {/* Effective Mode */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Mode</span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
              {cockpit.effectiveMode}
            </span>
          </div>

          {/* Expert ID */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Expert</span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
              {cockpit.expertId || "none"}
            </span>
          </div>
        </div>
      </div>

      {/* Accordion */}
      <div className="mt-3 rounded-xl border border-white/10 bg-neutral-900/40 px-5 py-4">
        <button
          onClick={() => setOpen(!open)}
          className="mb-3 flex w-full items-center justify-between text-left text-sm text-white/80"
        >
          <span>Telemetry Details</span>
          <span className="text-white/50">{open ? "−" : "+"}</span>
        </button>

        {open && (
  <div className="flex flex-col gap-y-6">

    {[
      {
        title: "Telemetry Core",
        keys: [
          "telemetryAuthority",
          "telemetryOrder",
          "telemetryScope",
          "telemetryMutability",
          "telemetryFailurePolicy",
          "telemetrySourceSeparation",
        ],
      },
      {
        title: "Mode Layer",
        keys: [
          "userMode",
          "systemMode",
        ],
      },
      {
        title: "Expert Layer",
        keys: [
          "expertStatus",
          "expertType",
        ],
      },
      {
        title: "Drift Layer",
        keys: [
          "driftOrigin",
          "driftRisk",
        ],
      },
      {
        title: "Orchestration",
        keys: [
          "orchestrationMode",
          "orchestrationAuthority",
          "expertConfiguration",
          "complexityLevel",
          "councilFinalStatus",
        ],
      },
      {
        title: "Rights & Governance",
        keys: [
          "expertRightsProfile",
          "expertRightsScope",
          "expertRightsSource",
          "analysisContainerState",
          "expertActivationCount",
          "councilDecisionId",
          "councilRightsAttestation",
          "councilDecisionTrace",
          "domainResolutionMode",
          "containerTransitionAuthority",
        ],
      },
    ].map(group => (
      <div key={group.title} className="flex flex-col gap-y-3">

        <div className="px-1 text-xs font-medium uppercase tracking-wide text-white/40">
          {group.title}
        </div>

        <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-x-8">
          {group.keys.map(key => {
            const value = parsed[key];
            if (!value) return null;

            return (
              <div
                key={key}
                className="flex flex-col rounded-lg border border-white/5 bg-white/5 px-4 py-3"
              >
                <span className="mb-1 text-xs text-white/40">
                  {key}
                </span>
                <span className="font-mono text-xs text-white/80 break-words">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}
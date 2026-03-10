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

function getDriftColor(risk: string) {
  const s = risk?.toLowerCase();

if (s === "none" || s === "minimal") return "bg-cyan-500/30 text-cyan-400 border-cyan-400/40";
if (s === "moderate") return "bg-yellow-500/30 text-yellow-400 border-yellow-400/40";
if (s === "high") return "bg-orange-500/30 text-orange-400 border-orange-400/40";
if (s === "critical") return "bg-red-500/30 text-red-400 border-red-400/40";

  return "bg-gray-500/10 text-gray-400 border-gray-400/20";
}

export default function TelemetryPanel({ telemetry }: Props) {
  const [open, setOpen] = useState(true);

  const { cockpit, parsed } = telemetry;

  return (
    <div className="mt-3 mb-4">
      {/* Cockpit */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 px-5 py-4 backdrop-blur-sm">

        <div className="flex flex-col gap-y-3">

          {/* Row 1 → Identity */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

            {/* System */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-white/50">System</span>
              <span className="text-sm font-medium text-white">
                {cockpit.system}
              </span>
            </div>

            {/* Version */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-white/50">Version</span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                {cockpit.version}
              </span>
            </div>

            {/* Prompt Counter */}
<div className="flex items-center gap-2">
  <span className="text-[10px] sm:text-xs text-white/50">Prompt#</span>
  <span className="rounded-full bg-white/5 px-4 py-1 font-mono text-sm text-white">
    {cockpit.promptCounter}
  </span>
</div>

            {/* Mode */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-white/50">Mode</span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                {cockpit.effectiveMode}
              </span>
            </div>

          </div>

          {/* Row 2 → Stability */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

                    {/* Drift */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs text-white/50">Drift</span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
              {cockpit.driftState}
            </span>
          </div>

          {/* Risk */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs text-white/50">Risk</span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${getDriftColor(
                parsed.driftRisk || "none"
              )}`}
            >
              {parsed.driftRisk || "none"}
            </span>
          </div>

            {/* Origin */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-white/50">Origin</span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                {parsed.driftOrigin || "none"}
              </span>
            </div>

            {/* Complexity */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-white/50">Complexity</span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                {parsed.complexityLevel || "none"}
              </span>
            </div>

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
    "expertId",
  ],
},
{
  title: "Agent Layer",
  keys: [
    "agentActive",
    "agentId",
    "agentProperty",
    "agentModes",
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
    "orchestratorId",
    "goalId",
    "taskId",
    "executionStage",
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
    "councilDecisionId",
    "domainResolutionMode",
    "runtimeContainerId",
    "systemStateHash",
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
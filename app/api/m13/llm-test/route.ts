import { NextRequest, NextResponse } from "next/server";
import { callM13Llm } from "@/lib/m13/llm";
import type { M13LlmCommand } from "@/lib/m13/llm";

export const runtime = "nodejs";

const allowedCommands: M13LlmCommand[] = [
  "reasoning",
  "challenge",
  "summary",
  "fast",
];

function isAllowedCommand(value: unknown): value is M13LlmCommand {
  return (
    typeof value === "string" &&
    allowedCommands.includes(value as M13LlmCommand)
  );
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          status: "error",
          error: "Invalid request format. JSON required.",
        },
        { status: 415 }
      );
    }

    const body = await req.json();

    if (!isAllowedCommand(body?.command)) {
      return NextResponse.json(
        {
          status: "error",
          error: "Invalid or missing command.",
          allowed_commands: allowedCommands,
        },
        { status: 400 }
      );
    }

    const prompt =
      typeof body?.prompt === "string" && body.prompt.trim().length > 0
        ? body.prompt.trim()
        : "Erkläre kurz auf Deutsch, warum ein isolierter LLM Adapter Layer für M13 wichtig ist.";

    const system =
      typeof body?.system === "string" && body.system.trim().length > 0
        ? body.system.trim()
        : "Antworte ausschließlich auf Deutsch. Antworte kurz, präzise und sachlich.";

        const maxTokens =
      typeof body?.maxTokens === "number" && body.maxTokens > 0
        ? body.maxTokens
        : undefined;

    const temperature =
      typeof body?.temperature === "number" && body.temperature >= 0
        ? body.temperature
        : undefined;

    const result = await callM13Llm({
      command: body.command,
      system,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      maxTokens,
      temperature,
    });

    return NextResponse.json(
      {
        status: "ok",
        test_route: "app/api/m13/llm-test/route.ts",
        command: result.command,
        adapter: result.adapter,
        model: result.model,
        content: result.content,
        usage: result.usage,
        stop_reason: result.stopReason ?? null,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[M13][LLM-TEST][ERROR]", err);

    return NextResponse.json(
      {
        status: "error",
        error: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
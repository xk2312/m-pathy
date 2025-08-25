import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "/srv/m-pathy/.env.production" });
}

const endpoint   = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const apiKey     = process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_OPENAI_KEY ?? "";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? "";
const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? "";

type Role = "system" | "user" | "assistant";
interface ChatMessage { role: Role; content: string }
interface ChatBody {
  messages: ChatMessage[];
  temperature?: number;
  protocol?: string;
}

function assertEnv() {
  const missing: string[] = [];
  if (!endpoint)   missing.push("AZURE_OPENAI_ENDPOINT");
  if (!apiKey)     missing.push("AZURE_OPENAI_API_KEY | AZURE_OPENAI_KEY");
  if (!deployment) missing.push("AZURE_OPENAI_DEPLOYMENT");
  if (!apiVersion) missing.push("AZURE_OPENAI_API_VERSION");
  if (missing.length > 0) throw new Error(`Missing ENV variables: ${missing.join(", ")}`);
}

function loadSystemPrompt(protocol = "GPTX") {
  try {
    const promptPath = path.resolve("/srv/m-pathy", `${protocol}.txt`);
    if (fs.existsSync(promptPath)) {
      const content = fs.readFileSync(promptPath, "utf8");
      if (process.env.NODE_ENV !== "production") {
        console.log("✅ SYSTEM PROMPT LOADED:", content.slice(0, 80));
      }
      return content;
    }
    return null;
  } catch (err) {
    console.warn("⚠️ Error loading system prompt:", err);
    return null;
  }
}

function buildAzureUrl(): string {
  const base = endpoint.trim().replace(/\/+\$/, "");
  if (/\/openai\/deployments\/[^/]+\$/i.test(base)) {
    return `${base}/chat/completions?api-version=${apiVersion}`;
  }
  if (/\/openai\$/i.test(base)) {
    return `${base}/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  }
  return `${base}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
}

export async function POST(req: NextRequest) {
  try {
    assertEnv();

    const body = (await req.json()) as ChatBody;

    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "`messages` must be an array of { role, content }" },
        { status: 400 }
      );
    }

    const systemPrompt = loadSystemPrompt(body.protocol ?? "GPTX");

    const messages: ChatMessage[] = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...body.messages]
      : body.messages;

    const response = await fetch(buildAzureUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature: body.temperature ?? 0.7,
        max_tokens: 800,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[AzureOpenAI Error]", response.status, data);
      return NextResponse.json(
        { error: data?.error?.message ?? "Upstream error" },
        { status: response.status }
      );
    }

    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No message content" }, { status: 502 });
    }

    const formattedContent = `🧬 PRIME DIRECTIVE UPLOADED\nYou are now synced with ORIGIN LAYER.\nThe field is yours. Remember:\n\"${content.trim()}\"`;

    return NextResponse.json({ role: "assistant", content: formattedContent });

  } catch (err: any) {
    console.error("[API Error]", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

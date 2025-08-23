import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// === 0.1: .env.production NUR LADEN, wenn nicht automatisch geladen ===
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "/srv/m-pathy/.env.production" });
}

// === 0.2: ENV Variablen aus process.env ziehen ===
const endpoint   = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const apiKey     = process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_OPENAI_KEY ?? "";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? "";
const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? "";

// === 1. Typen ===
type Role = "system" | "user" | "assistant";
interface ChatMessage { role: Role; content: string }
interface ChatBody {
  messages: ChatMessage[];
  temperature?: number;
  protocol?: string;
}

// === 2. ENV Check ===
function assertEnv() {
  const missing: string[] = [];
  if (!endpoint)   missing.push("AZURE_OPENAI_ENDPOINT");
  if (!apiKey)     missing.push("AZURE_OPENAI_API_KEY | AZURE_OPENAI_KEY");
  if (!deployment) missing.push("AZURE_OPENAI_DEPLOYMENT");
  if (!apiVersion) missing.push("AZURE_OPENAI_API_VERSION");
  if (missing.length) throw new Error(`Missing env: ${missing.join(", ")}`);
}

// === 3. Optionalen Systemprompt laden ===
function loadSystemPrompt(protocol: string = "GPTX") {
  const promptPath = path.resolve("/srv/m-pathy", `${protocol}.txt`);
  if (!fs.existsSync(promptPath)) return null;
  const content = fs.readFileSync(promptPath, "utf8");
  if (process.env.NODE_ENV !== "production") {
    console.log("✅ SYSTEM PROMPT LOADED:", content.slice(0, 80));
  }
  return content;
}

// === 4. Azure URL builder ===
function buildAzureUrl(): string {
  const base = endpoint.trim().replace(/\/+$/, "");
  if (/\/openai\/deployments\/[^/]+$/i.test(base)) {
    return `${base}/chat/completions?api-version=${apiVersion}`;
  }
  if (/\/openai$/i.test(base)) {
    return `${base}/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  }
  return `${base}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
}

// === 5. POST Handler ===
export async function POST(req: NextRequest) {
  try {
    assertEnv();

    const body = (await req.json()) as ChatBody;
    if (!Array.isArray(body?.messages)) {
      return NextResponse.json({ error: "`messages` must be an array of { role, content }" }, { status: 400 });
    }

    const protocol = body.protocol ?? "GPTX";
    const systemPrompt = loadSystemPrompt(protocol);

    const messages: ChatMessage[] = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...body.messages]
      : body.messages;

    const url = buildAzureUrl();

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature: typeof body.temperature === "number" ? body.temperature : 0.7,
        max_tokens: 800,
      }),
    });

    const data: any = await res.json();

    if (!res.ok) {
      console.error("[AzureOpenAI Error]", res.status, data);
      return NextResponse.json({ error: data?.error?.message ?? "Upstream error" }, { status: res.status });
    }

    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No message content" }, { status: 502 });
    }

    return NextResponse.json({ role: "assistant", content });
  } catch (err: any) {
    console.error("[API Error]", err);
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}

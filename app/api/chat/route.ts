import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import dotenv from "dotenv";

// 🌱 Sicherstellen, dass ENV geladen ist – auch bei Import-Schwächen
dotenv.config({ path: "/srv/m-pathy/.env.production" }); // 🔒 Gold-Standard

// === 1. Typen ===
type Role = "system" | "user" | "assistant";
interface ChatMessage { role: Role; content: string }
interface ChatBody {
  messages: ChatMessage[];
  temperature?: number;
  protocol?: string;
}

// === 2. ENV laden (nach dotenv)
const ENV = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT ?? "",
  apiKey: process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_OPENAI_KEY ?? "",
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT ?? "",
  version: process.env.AZURE_OPENAI_API_VERSION ?? "",
};

// === 3. ENV-Schutz ===
function assertEnv() {
  const missing: string[] = [];
  if (!ENV.endpoint)   missing.push("AZURE_OPENAI_ENDPOINT");
  if (!ENV.apiKey)     missing.push("AZURE_OPENAI_API_KEY | AZURE_OPENAI_KEY");
  if (!ENV.deployment) missing.push("AZURE_OPENAI_DEPLOYMENT");
  if (!ENV.version)    missing.push("AZURE_OPENAI_API_VERSION");
  if (missing.length) throw new Error(`Missing env: ${missing.join(", ")}`);
}

// === 4. Systemprompt laden ===
function loadSystemPrompt(protocol: string = "GPTX") {
  const path = `/srv/m-pathy/${protocol}.txt`;
  if (!fs.existsSync(path)) return null;
  const content = fs.readFileSync(path, "utf8");
  if (process.env.NODE_ENV !== "production") {
    console.log("✅ SYSTEM PROMPT LOADED:", content.slice(0, 80));
  }
  return content;
}

// === 5. Azure URL Generator ===
function buildAzureUrl() {
  const base = ENV.endpoint.trim().replace(/\/+$/, "");
  if (/\/openai\/deployments\/[^/]+$/i.test(base)) {
    return `${base}/chat/completions?api-version=${ENV.version}`;
  }
  if (/\/openai$/i.test(base)) {
    return `${base}/deployments/${ENV.deployment}/chat/completions?api-version=${ENV.version}`;
  }
  return `${base}/openai/deployments/${ENV.deployment}/chat/completions?api-version=${ENV.version}`;
}

// === 6. POST Handler ===
export async function POST(req: NextRequest) {
  try {
    assertEnv();

    const body = (await req.json()) as ChatBody;
    if (!Array.isArray(body?.messages)) {
      return NextResponse.json(
        { error: "`messages` must be an array of { role, content }" },
        { status: 400 }
      );
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
        "api-key": ENV.apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature: typeof body.temperature === "number" ? body.temperature : 0.7,
        max_tokens: 800,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error("[AzureOpenAI Error]", res.status, errorText);
      return NextResponse.json({ error: errorText || "Upstream error" }, { status: res.status });
    }

    const data: any = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[AzureOpenAI] No content in response", JSON.stringify(data, null, 2));
      return NextResponse.json({ error: "No message content" }, { status: 502 });
    }

    return NextResponse.json({ role: "assistant", content });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[API Error]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

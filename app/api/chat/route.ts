import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

// === 2. Typen & Interfaces ===
type Role = "system" | "user" | "assistant";
interface ChatMessage { role: Role; content: string }
interface ChatBody {
  messages: ChatMessage[];
  temperature?: number;
  protocol?: string; // erlaubt Protokollwahl
}

// === 3. ENV absichern ===
const endpoint   = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const apiKey     = process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_OPENAI_KEY ?? "";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? "";
const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? "";

function assertEnv() {
  const missing: string[] = [];
  if (!endpoint)   missing.push("AZURE_OPENAI_ENDPOINT");
  if (!apiKey)     missing.push("AZURE_OPENAI_API_KEY | AZURE_OPENAI_KEY");
  if (!deployment) missing.push("AZURE_OPENAI_DEPLOYMENT");
  if (!apiVersion) missing.push("AZURE_OPENAI_API_VERSION");
  if (missing.length) throw new Error(`Missing env: ${missing.join(", ")}`);
}

// === 4. System Prompt Loader ===
function loadSystemPrompt(protocol: string = "GPTX") {
  const path = `/srv/m-pathy/${protocol}.txt`;
  if (!fs.existsSync(path)) return null;
  return fs.readFileSync(path, "utf8");
}

// === 5. Azure URL Generator ===
function buildAzureUrl(ep: string, dep: string, ver: string) {
  const base = ep.trim().replace(/\/+$/, "");
  if (/\/openai\/deployments\/[^/]+$/i.test(base)) {
    return `${base}/chat/completions?api-version=${ver}`;
  }
  if (/\/openai$/i.test(base)) {
    return `${base}/deployments/${dep}/chat/completions?api-version=${ver}`;
  }
  return `${base}/openai/deployments/${dep}/chat/completions?api-version=${ver}`;
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

    const url = buildAzureUrl(endpoint, deployment, apiVersion);

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

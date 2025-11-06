import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { withGate, retryingFetch } from "@/lib/rate";
import { verifyAndBumpFreegate } from "@/lib/freegate";  // ← FreeGate

export const runtime = "nodejs"; // wir lesen Dateien ⇒ Node-Runtime

// === 0.1: ENV laden falls Production ===
if (process.env.NODE_ENV === "production") {
  // Server-Pfad entspricht deinem Deploy-Layout
  dotenv.config({ path: "/srv/app/current/.env.production" });
} else {
  dotenv.config(); // auch im Dev laden
}


// === 0.2: ENV Variablen vorbereiten ===
const endpoint   = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const apiKey     = process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_OPENAI_KEY ?? "";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? "";
const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? "";

// **Limits steuerbar per ENV**
const MODEL_MAX_TOKENS = parseInt(process.env.MODEL_MAX_TOKENS ?? "512", 10);
const GPTX_MAX_CHARS   = parseInt(process.env.GPTX_MAX_CHARS   ?? "32000", 10);

// FreeGate-ENV
const FREE_LIMIT   = parseInt(process.env.FREE_LIMIT ?? "9", 10);
const FG_SECRET    = process.env.FREEGATE_SECRET || "";
const CHECKOUT_URL = process.env.CHECKOUT_URL || "https://example.com/checkout";

// === Typen ===
type Role = "system" | "user" | "assistant";
interface ChatMessage { role: Role; content: string }
interface ChatBody {
  messages: ChatMessage[];
  temperature?: number;
  protocol?: string;
}

// === ENV-Check ===
function assertEnv() {
  const missing: string[] = [];
  if (!endpoint)   missing.push("AZURE_OPENAI_ENDPOINT");
  if (!apiKey)     missing.push("AZURE_OPENAI_API_KEY | AZURE_OPENAI_KEY");
  if (!deployment) missing.push("AZURE_OPENAI_DEPLOYMENT");
  if (!apiVersion) missing.push("AZURE_OPENAI_API_VERSION");
  if (missing.length > 0) {
    console.error("❌ ENV missing:", missing.join(", "));
    throw new Error(`Missing ENV variables: ${missing.join(", ")}`);
  }
}

// === Systemprompt mit Hardcap ===
function loadSystemPrompt(protocol = "GPTX") {
  try {
    const promptPath = path.resolve("/srv/m-pathy", `${protocol}.txt`);
    if (fs.existsSync(promptPath)) {
      const content = fs.readFileSync(promptPath, "utf8").slice(0, GPTX_MAX_CHARS);
      if (process.env.NODE_ENV !== "production") {
        console.log("✅ SYSTEM PROMPT LOADED:", content.slice(0, 80));
      }
      // Markdown-Wrap beibehalten (kompatibel zu deinem bisherigen Verhalten)
      return `\`\`\`markdown\n${content.trim()}\n\`\`\``;
    } else {
      console.warn("⚠️ Prompt-Datei nicht gefunden:", promptPath);
    }
    return null;
  } catch (err) {
    console.warn("⚠️ Error loading system prompt:", err);
    return null;
  }
}

// === Azure URL Builder ===
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

// === POST-Handler (mit Gate + Backoff) ===
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatBody;

        if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "`messages` must be an array of { role, content }" },
        { status: 400 }
      );
    }

   // ── FreeGate (BS13: Dry-Run – nur zählen & Cookie setzen, kein 402) ──
if (!FG_SECRET) {
  return NextResponse.json({ error: "FREEGATE_SECRET missing" }, { status: 500 });
}
const ua = req.headers.get("user-agent") || "";
const cookieHeader = req.headers.get("cookie");
const { count, cookie } = verifyAndBumpFreegate({
  cookieHeader,
  userAgent: ua,
  freeLimit: FREE_LIMIT,
  secret: FG_SECRET
}); // blocked wird bewusst ignoriert

// Hinweis: Das tatsächliche Blocken (402) schalten wir erst in BS13/7 ein.


    // ── DEV-Fallback, wenn Azure-ENV fehlt (verhindert 500 im Dev) ──
    const hasAzureEnv = endpoint && apiKey && deployment && apiVersion;
    if (!hasAzureEnv) {
      const TOKENS_USED = Math.min(MODEL_MAX_TOKENS, 120);
      const res = NextResponse.json({
        role: "assistant",
        content: "Hello from GPTM-Galaxy+ minimal chat stub (DEV, no Azure ENV).",
        free_count: count,
        free_limit: FREE_LIMIT
      }, { status: 200 });
      res.headers.set("X-Tokens-Delta", String(-TOKENS_USED));
      res.headers.set("Set-Cookie", cookie ?? "");
      return res;
    }
    // ────────────────────────────────────────────────────────────────

    // Ab hier: echte Azure-Antwort (jetzt erst sicher prüfen)
    assertEnv();

    // ─────────────────────────────────────────────────────────────────────────────


    const systemPrompt = loadSystemPrompt(body.protocol ?? "GPTX");
    const messages: ChatMessage[] = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...body.messages]
      : body.messages;

    const payload = {
      messages,
      temperature: body.temperature ?? 0.7,
      max_tokens: MODEL_MAX_TOKENS, // kleiner halten → weniger 429 
    };

    const init: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify(payload),
    };
    console.log("Endpoint in runtime:", process.env.AZURE_OPENAI_ENDPOINT);
    console.log("🔍 Azure URL in use:", buildAzureUrl());
    console.log("🔑 API Key (masked):", apiKey ? apiKey.slice(0, 5) + "..." : "MISSING");

    // Concurrency-Gate + Retry-After Backoff
    const response = await withGate(() => retryingFetch(buildAzureUrl(), init, 5));
    const data = await response.json();

    if (!response.ok) {
      console.error("[AzureOpenAI Error]", response.status, data);
      return NextResponse.json(
        { error: data?.error?.message ?? `Upstream error ${response.status}` },
        { status: response.status }
      );
    }

    const content: string | undefined = data?.choices?.[0]?.message?.content;
if (!content) {
  return NextResponse.json({ error: "No message content" }, { status: 502 });
}

// Beispiel: Tokens-Verbrauch schätzen (Stub). Später ersetzen wir das durch echte Usage.
const TOKENS_USED =  Math.min(MODEL_MAX_TOKENS, 120);

const res = NextResponse.json({ role: "assistant", content }, { status: 200 });
res.headers.set("X-Tokens-Delta", String(-TOKENS_USED));
res.headers.set("X-Free-Used", String(count));
res.headers.set("X-Free-Limit", String(FREE_LIMIT));
if (cookie) res.headers.set("Set-Cookie", cookie);
return res;


  } catch (err: any) {
    console.error("[API Error]", err);
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}

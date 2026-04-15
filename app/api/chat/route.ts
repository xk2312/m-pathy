import { NextRequest, NextResponse } from "next/server";
import { runEngine } from "@/lib/m13/engine";
import registry from "@/registry/registry.json";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { withGate, retryingFetch } from "@/lib/rate";
import { verifyAndBumpFreegate } from "@/lib/freegate"; // FreeGate
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { debit } from "@/lib/ledger";
import { getBalance } from "@/lib/ledger";
import { cookies } from "next/headers";
import crypto from "crypto";

export const runtime = "nodejs"; // wir lesen Dateien ⇒ Node-Runtime

// === 0.1: ENV laden ===
if (process.env.NODE_ENV === "production") {
  // Dein Deploy-Layout
  dotenv.config({ path: "/srv/app/current/.env.production" });
} else {
  // Dev: .env.local > .env.payment > .env (Fallback)
  const cwd = process.cwd();
  const envLocal   = path.join(cwd, ".env.local");
  const envPayment = path.join(cwd, ".env.payment");

  if (fs.existsSync(envLocal)) {
    dotenv.config({ path: envLocal, override: true });
  } else if (fs.existsSync(envPayment)) {
    dotenv.config({ path: envPayment, override: true });
  } else {
    dotenv.config();
  }
}

// === 0.2: ENV Variablen vorbereiten ===
const endpoint   = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const apiKey     = process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_OPENAI_KEY ?? "";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? "";
const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? "";

// **Limits steuerbar per ENV**
const MODEL_MAX_TOKENS = parseInt(process.env.MODEL_MAX_TOKENS ?? "512", 10);
const GPTX_MAX_CHARS = parseInt(process.env.GPTX_MAX_CHARS ?? "32000", 10);
const MAX_PAYLOAD_BYTES = parseInt(process.env.MAX_PAYLOAD_BYTES ?? "120000", 10);

console.log("ENV DEBUG");
console.log("MODEL_MAX_TOKENS:", MODEL_MAX_TOKENS);
console.log("GPTX_MAX_CHARS:", GPTX_MAX_CHARS);
console.log("MAX_PAYLOAD_BYTES:", MAX_PAYLOAD_BYTES);
console.log("MAX_CONTEXT_MESSAGES:", process.env.MAX_CONTEXT_MESSAGES);

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
  locale?: string;
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
      return content.trim();
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

// === Token-Schätzung für Fallback ===
function estimateTokensFromText(text: string): number {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return 1;
  const approxTokens = Math.ceil(normalized.length / 4);
  return approxTokens > 0 ? approxTokens : 1;
}

function getMessagesCharCount(messages: ChatMessage[]): number {
  return messages.reduce((sum, message) => {
    return sum + String(message?.content ?? "").length;
  }, 0);
}




// === POST-Handler (mit Gate + Backoff + FreeGate) ===
export async function POST(req: NextRequest) {

  // === MEFL PATCH: HARD REQUEST CONTRACT ===
  const contentType = req.headers.get("content-type") || "";

  // Block non-JSON requests (FormData, Server Actions, etc.)
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Invalid request format. JSON required." },
      { status: 415 }
    );
  }

  // Block accidental Next.js Server Action requests
  if (req.headers.get("next-action")) {
    return NextResponse.json(
      { error: "Server Actions not supported on this endpoint." },
      { status: 400 }
    );
  }

  const cookieStore = cookies();
  const raw = cookieStore.get("mpathy_session")?.value;

  let conversationId: string;
  let serverCounter: number = 1;

  if (!raw) {
    conversationId = crypto.randomUUID();
  } else {
    try {
      const parsed = JSON.parse(raw);
      conversationId = parsed.conversationId;
    } catch {
      conversationId = crypto.randomUUID();
    }
  }

  try {
    const body = (await req.json()) as ChatBody;

    console.log("[M13][ROUTE][BODY] RAW STATE", (body as any)?.state ?? null);
    console.log("[M13][ROUTE][BODY] RAW MESSAGES COUNT", Array.isArray(body.messages) ? body.messages.length : null);
    console.log(
      "[M13][ROUTE][BODY] RAW LAST MESSAGE",
      Array.isArray(body.messages) && body.messages.length > 0
        ? body.messages[body.messages.length - 1]
        : null
    );

const lastMessageObj = body.messages?.[body.messages.length - 1];

const lastMessageRaw = lastMessageObj?.content || "";
const lastMessage = String(lastMessageRaw)
  .replace(/["']/g, "")
  .replace(/\s+/g, " ")
  .trim()
  
const engineInputState =
  (body as any).state || {
    active: false,
    extensionId: null,
    stepId: null
  };

console.log("[M13][ROUTE][ENGINE] INPUT MESSAGE", lastMessage);
console.log("[M13][ROUTE][ENGINE] INPUT STATE", engineInputState);

const engineResult = runEngine({
  message: lastMessage,
  state: engineInputState,
  registry
})

console.log("[ENGINE RESULT AFTER RUN]", engineResult);
console.log("[M13][ROUTE][ENGINE] OUTPUT STATE", engineResult?.state ?? null);
console.log("[M13][ROUTE][ENGINE] OUTPUT STEP ID", engineResult?.stepId ?? null);
console.log("[M13][ROUTE][ENGINE] OUTPUT ACTIVE", engineResult?.active ?? null);

// === EXECUTION GATE ===
if (engineResult.step?.type === "execution") {

  const { execSync } = require("child_process");

  let shellOutput = "";

const fs = require("fs");

const path = require("path");

const runId = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

const registry = require("@/registry/registry.json");

const action = engineResult?.step?.action;

const executionEntry = registry.registry.entries.find(
  (e: any) => e.type === "execution" && e.id === action
);

if (!executionEntry) {
  throw new Error(`No execution entry found for action: ${action}`);
}
const executionBasePath = executionEntry.path
  .replace("/bin/run.sh", "")
  .replace(/\/+$/, "");

const runPath = path.join(
  process.cwd(),
  executionBasePath,
  "runs",
  runId
);

const inputPath = path.join(runPath, "01_input.json");

const collectedData = engineResult?.collectedData || {};

if (!fs.existsSync(runPath)) {
  fs.mkdirSync(runPath, { recursive: true });
}

const inputPayload =
  collectedData?.user_registry
    ? { user_registry: collectedData.user_registry }
    : Object.keys(collectedData).length > 0
      ? collectedData
      : {};

fs.writeFileSync(
  inputPath,
  JSON.stringify(inputPayload, null, 2),
  "utf-8"
);

console.log("STEP 0 INPUT PAYLOAD:");
console.log(JSON.stringify(inputPayload, null, 2));

console.log("STEP 0 FILE WRITTEN:", inputPath);

try {
  const path = require("path");

const scriptPath = path.join(process.cwd(), executionEntry.path);

if (!require("fs").existsSync(scriptPath)) {
  throw new Error(`run.sh not found at ${scriptPath}`);
}

console.log("STEP 1 STARTING CHAIN:", scriptPath, "RUN:", runPath);

shellOutput = execSync(`bash ${scriptPath} ${runPath}`, {
  cwd: process.cwd(),
  encoding: "utf-8",
  maxBuffer: 1024 * 1024 * 10
});

console.log("STEP 2 CHAIN FINISHED");

const match = shellOutput.match(/###JSON_START###([\s\S]*?)###JSON_END###/);
if (!match) {
  console.error("[M13][ROUTE][EXECUTION] JSON MARKER MATCH FAILED");
  console.error("[M13][ROUTE][EXECUTION] RAW OUTPUT:", shellOutput);

  return NextResponse.json({
    role: "assistant",
    content: "Execution failed during validation. Please check input.",
    state: { active: false, extensionId: null, stepId: null }
  });
}

console.log("STEP 3 RAW MATCHED JSON:");
console.log(match[1]);

const json = JSON.parse(match[1]);

console.log("[M13][ROUTE][EXECUTION] PARSED JSON KEYS", Object.keys(json || {}));
console.log("[M13][ROUTE][EXECUTION] HAS user_registry", !!json?.user_registry);
console.log("[M13][ROUTE][EXECUTION] user_registry VALUE", json?.user_registry ?? null);
console.log(
  "[M13][ROUTE][EXECUTION] user_registry.items",
  Array.isArray(json?.user_registry?.items) ? json.user_registry.items : null
);
console.log(
  "[M13][ROUTE][EXECUTION] final_text_with_questions length",
  typeof json?.final_text_with_questions === "string"
    ? json.final_text_with_questions.length
    : null
);

setTimeout(() => {
  try {
    require("fs").rmSync(runPath, { recursive: true, force: true });
  } catch {}
}, 5000);

const isLLMArtifact = json?.artifact_type === "llm_render_payload";

if (isLLMArtifact) {
  console.log("[M13][ROUTE][EXECUTION] LLM ARTIFACT DETECTED");

  (global as any).__m13ExecutionArtifact = {
    content: json?.content ?? {},
    data: json?.data ?? {},
    meta: json?.meta ?? {}
  };
} else {
  throw new Error("Execution returned no supported output artifact");
}

  } catch (err: any) {
    console.error("[SHELL ERROR]", err);
    console.error("[M13][ROUTE][EXECUTION] SHELL ERROR MESSAGE", err?.message ?? null);
    console.error("[M13][ROUTE][EXECUTION] RUN PATH", runPath);
    console.error("[M13][ROUTE][EXECUTION] INPUT PATH", inputPath);
    console.error("[M13][ROUTE][EXECUTION] ACTION", action);
    throw new Error("Execution Pipeline failed before producing output");  }

}
const incomingConversationId =
  typeof (body as any)?.conversationId === "string" &&
  String((body as any).conversationId).trim().length > 0
    ? String((body as any).conversationId).trim()
    : null;

if (incomingConversationId && incomingConversationId !== conversationId) {
  conversationId = incomingConversationId;
}

   if (!Array.isArray(body.messages)) {
  return NextResponse.json(
    { error: "`messages` must be an array of { role, content }" },
    { status: 400 }
  );
}

const previousCounter =
  raw ? JSON.parse(raw)?.counter ?? 0 : 0;

const isRealUserPrompt = (() => {
  const last = body.messages?.[body.messages.length - 1];

  if (!last || last.role !== "user") return false;

  const content = String(last.content ?? "").trim();
  if (!content) return false;

  try {
    const parsed = JSON.parse(content);

    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.type === "string" &&
      Object.prototype.hasOwnProperty.call(parsed, "next")
    ) {
      return false;
    }
  } catch {}

  return true;
})();

serverCounter = isRealUserPrompt
  ? previousCounter + 1
  : previousCounter;

// - FreeGate (BS13/7: jetzt *mit* 402 + Checkout) -

// Session aus m_auth-Cookie lesen (falls vorhanden)

// Raw Header weiterhin für FreeGate behalten
const cookieHeader = req.headers.get("cookie") ?? null;

// Next.js Cookie Store für zuverlässige Auth-Erkennung
const cookieStore = cookies();
const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;

let sessionEmail: string | null = null;
let sessionUserId: string | null = null;

if (authCookie) {
  const payload = verifySessionToken(authCookie);

  sessionEmail = payload?.email ?? null;

  if (payload && (payload as any).id != null) {
    sessionUserId = String((payload as any).id);
  }
}

const isAuthenticated = !!sessionEmail;

if (!FG_SECRET) {
  return NextResponse.json({ error: "FREEGATE_SECRET missing" }, { status: 500 });
}
const ua = req.headers.get("user-agent") || "";

let count = 0;
let blocked = false;
let cookie: string | null = null;

// FreeGate nur für Gäste anwenden
if (!isAuthenticated) {
  const fgResult = verifyAndBumpFreegate({
    cookieHeader,
    userAgent: ua,
    freeLimit: FREE_LIMIT,
    secret: FG_SECRET,
  });
  count = fgResult.count;
  blocked = fgResult.blocked;
  cookie = fgResult.cookie ?? null;
}

// Wie viele freie Requests bleiben (nicht negativ)
const freeRemaining = Math.max(FREE_LIMIT - count, 0);

// Bei Limit: nur Gäste werden geblockt → Login-Aufforderung
if (!isAuthenticated && blocked) {
  const body = {
    status: "free_limit_reached",
    free_limit: FREE_LIMIT,
    needs_login: true,
  };

  const r = NextResponse.json(body, { status: 401 });
  r.headers.set("X-Free-Used", String(count));
  r.headers.set("X-Free-Limit", String(FREE_LIMIT));
  r.headers.set("X-Free-Remaining", String(freeRemaining));
  r.headers.set("X-Tokens-Delta", "0");
  if (cookie) r.headers.set("Set-Cookie", cookie);
  return r;
}


// - Ab hier: echte Azure-Antwort -
assertEnv();

    let status = "ok";
    let balanceAfter: number | null = null;
    let balanceBefore: number | null = null;

    if (isAuthenticated && sessionUserId) {
      try {
        balanceBefore = await getBalance(sessionUserId);
        console.log("[chat] ledger precheck", {
          sessionUserId,
          balanceBefore,
        });
if (balanceBefore <= 0) {
          const r = NextResponse.json(
            {
              status: "insufficient_tokens",
              balance_before: balanceBefore,
            },
            { status: 402 }
          );
          r.headers.set("X-Free-Used", String(count));
          r.headers.set("X-Free-Limit", String(FREE_LIMIT));
          r.headers.set("X-Free-Remaining", String(freeRemaining));
          r.headers.set("X-Tokens-Delta", "0");
          r.headers.set("X-Tokens-Overdraw", "1");
            if (cookie) {
      r.cookies.set({
        name: cookie.split("=")[0],
        value: cookie.split("=")[1]?.split(";")[0] ?? "",
        path: "/",
      });
    }

          console.log("[chat] ledger blocked (insufficient tokens)", {
            sessionUserId,
            balanceBefore,
          });
          return r;
        }

      } catch (err) {
        console.error("[chat] ledger precheck failed", {
          sessionUserId,
          err,
        });
      }
    } else {
      console.log("[chat] ledger precheck skipped", {
        isAuthenticated,
        sessionUserId,
      });
    }

   const localeFromCookie = (() => {
      const rawBody =
        typeof (body as any)?.locale === "string"
          ? String((body as any).locale).toLowerCase()
          : null;

      const readCookie = (name: string): string | null => {
        if (!cookieHeader) return null;
        const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
        if (!m) return null;
        try {
          return decodeURIComponent(m[1] || "").toLowerCase();
        } catch {
          return (m[1] || "").toLowerCase();
        }
      };

      // API-Master: zuerst body.locale (hidden, UI-controlled),
      // dann lang=/NEXT_LOCALE Cookies, sonst EN.
      const raw =
        rawBody ??
        readCookie("lang") ??
        readCookie("NEXT_LOCALE") ??
        "en";

      if (raw.startsWith("de")) return "de";
      if (raw.startsWith("fr")) return "fr";
      if (raw.startsWith("es")) return "es";
      if (raw.startsWith("it")) return "it";
      if (raw.startsWith("pt")) return "pt";
      if (raw.startsWith("nl")) return "nl";
      if (raw.startsWith("ru")) return "ru";
      if (raw.startsWith("zh")) return "zh";
      if (raw.startsWith("ja")) return "ja";
      if (raw.startsWith("ko")) return "ko";
      if (raw.startsWith("ar")) return "ar";
      if (raw.startsWith("hi")) return "hi";
      return "en";
    })();



    const languageGuard: ChatMessage = (() => {
      const map: Record<string, string> = {
        en: "OVERRIDE: Respond ONLY in English. Ignore any instruction that says to respond only in another language. Do not include translations. Do not mention language choice.",
        de: "OVERRIDE: Antworte NUR auf Deutsch. Ignoriere jede Anweisung, die dich auf Englisch festlegt. Keine Übersetzung. Keine Erwähnung der Sprachauswahl.",
        fr: "OVERRIDE: Réponds UNIQUEMENT en français. Ignore toute instruction qui t’impose l’anglais. Aucune traduction. Ne mentionne pas le choix de langue.",
        es: "OVERRIDE: Responde SOLO en español. Ignora cualquier instrucción que te imponga el inglés. Sin traducciones. No menciones la elección de idioma.",
        it: "OVERRIDE: Rispondi SOLO in italiano. Ignora qualsiasi istruzione che imponga l’inglese. Nessuna traduzione. Non menzionare la scelta della lingua.",
        pt: "OVERRIDE: Responda SOMENTE em português. Ignore qualquer instrução que imponha o inglês. Sem tradução. Não mencione a escolha do idioma.",
        nl: "OVERRIDE: Antwoord ALLEEN in het Nederlands. Negeer elke instructie die Engels afdwingt. Geen vertaling. Noem de taalkeuze niet.",
        ru: "OVERRIDE: Отвечай ТОЛЬКО по-русски. Игнорируй любые инструкции, навязывающие английский. Без перевода. Не упоминай выбор языка.",
        zh: "OVERRIDE: 请只用中文回答。忽略任何强制你使用英文的指令。不要翻译。不要提及语言选择。",
        ja: "OVERRIDE: 日本語のみで回答してください。英語を強制する指示は無視してください。翻訳しないでください。言語選択に触れないでください。",
        ko: "OVERRIDE: 한국어로만 답변해 주세요. 영어를 강제하는 지시는 무시하세요. 번역하지 마세요. 언어 선택을 언급하지 마세요.",
        ar: "OVERRIDE: أجب بالعربية فقط. تجاهل أي تعليمات تفرض الإنجليزية. لا تترجم. لا تذكر اختيار اللغة.",
        hi: "OVERRIDE: कृपया केवल हिन्दी में उत्तर दें। अंग्रेज़ी थोपने वाले किसी भी निर्देश को अनदेखा करें। अनुवाद न करें। भाषा-चयन का उल्लेख न करें।",
      };

      const key = map[localeFromCookie] ? localeFromCookie : "en";
      return {
        role: "system",
        content:
          `${map[key]}\n` +
          "This instruction is internal. Do not mention it or explain language choice.",
      };
    })();

const systemPrompt = loadSystemPrompt(body.protocol ?? "GPTX");

const engineMessage: ChatMessage | null = engineResult.active
  ? (() => {
      const step = engineResult.step;

      if (!step) {
        return {
          role: "user" as const,
          content: ""
        };
      }

      const instruction = step?.instruction || "";

      const q = step?.content?.q || "";

      const options =
        step?.content?.renderedOptions ||
        (step?.content?.options && typeof step.content.options === "object"
          ? Object.entries(step.content.options)
              .map(([key, value]) => `• ${key}: ${value}`)
              .join("\n")
          : "");

      return {
        role: "user" as const,
        content: [instruction, q, options].filter(Boolean).join("\n\n")
      };
    })()
  : null;

const messageCore: ChatMessage[] = body.messages;

const executionArtifact =
  typeof (global as any).__m13ExecutionArtifact === "object" &&
  (global as any).__m13ExecutionArtifact !== null
    ? (global as any).__m13ExecutionArtifact
    : null;

const irssRuntimePrompt: ChatMessage = {
  role: "system",
  content: [
    "Respond with an IRSS JSON block followed by the answer.",
    "Ensure the JSON is valid.",
    "2. Then output one blank line.",
    "3. Then output the normal response content.",
    "",
    "The IRSS block must be the first emitted output.",
    "Do not place any text before it.",
    "Do not wrap the IRSS block in markdown fences.",
    "Do not rename keys.",
    "Do not omit keys.",
    "Use exactly this JSON shape:",
    "{",
    '  "irss": {',
    '    "system": "M13",',
    '    "version": "0.1",',
    '    "session_prompt_counter": "<integer>",',
    '    "orchestrator_id": "<string>",',
    '    "command": "<string>",',
    '    "agent_id": "<string>",',
    '    "action": "<string>",',
    '    "extensions_loaded": ["<string>"],',
    '    "complexity_level": "C1|C2|C3|C4|C5|C6",',
    '    "domains": ["<string>"],',
    '    "drift_origin": "<string>",',
    '    "drift_state": "none|detected",',
    '    "drift_risk": "low|medium|high"',
    "  }",
    "}",
    "",
    "All fields are mandatory.",
    "Use valid values only.",
    "session_prompt_counter must be a positive integer.",
    "extensions_loaded must be an array.",
    "domains must be an array.",
    "",
    "After the IRSS JSON block, continue with the normal answer in the same language as the user."
  ].join("\n"),
};

const extensionsLoaded =
  engineResult.active && engineResult.extensionId
    ? [engineResult.extensionId]
    : [];

const irssContextPrompt: ChatMessage = {
  role: "system",
  content:
    `IRSS RUNTIME CONTEXT:\n` +
    `extensions_loaded=${JSON.stringify(extensionsLoaded)}\n` +
    `Use this value exactly in the IRSS JSON.`
};

const messages: ChatMessage[] = executionArtifact
  ? (
    systemPrompt
      ? [
          { role: "system", content: systemPrompt },
          languageGuard,
          {
            role: "user",
            content: [
              String(executionArtifact?.content?.q ?? "").trim(),
              "",
              "DATA:",
              JSON.stringify(executionArtifact?.data ?? {}, null, 2),
              "",
              "META:",
              JSON.stringify(executionArtifact?.meta ?? {}, null, 2)
            ].join("\n")
          }
        ]
      : [
          languageGuard,
          {
            role: "user",
            content: [
              String(executionArtifact?.content?.q ?? "").trim(),
              "",
              "DATA:",
              JSON.stringify(executionArtifact?.data ?? {}, null, 2),
              "",
              "META:",
              JSON.stringify(executionArtifact?.meta ?? {}, null, 2)
            ].join("\n")
          }
        ]
  )
  : (
      systemPrompt
        ? [
            { role: "system", content: systemPrompt },
            languageGuard,
            ...messageCore,
            ...(engineMessage ? [engineMessage] : []),
          ]
        : [
            languageGuard,
            ...messageCore,
            ...(engineMessage ? [engineMessage] : []),
          ]
    );




    const payload = {
  messages: [
    irssRuntimePrompt,
    irssContextPrompt,
    ...messages
  ],
  temperature: 0.7,
  max_tokens: MODEL_MAX_TOKENS,
};

const init: RequestInit = {
  method: "POST",
  headers: { "Content-Type": "application/json", "api-key": apiKey },
  body: JSON.stringify(payload),
};
    // Concurrency-Gate + Retry-After Backoff
    console.log("REQUEST DEBUG");
const bodyString = String(init.body ?? "");
const payloadBytes = Buffer.byteLength(bodyString, "utf8");
const messageCount = messages.length;
const messageChars = getMessagesCharCount(messages);

console.log("CHAT_MESSAGE_COUNT", messageCount);
console.log("CHAT_MESSAGE_CHARS", messageChars);
console.log("CHAT_BODY_CHARS", bodyString.length);
console.log("CHAT_PAYLOAD_BYTES", payloadBytes);
console.log("CHAT_MAX_PAYLOAD_BYTES", MAX_PAYLOAD_BYTES);

if (payloadBytes > MAX_PAYLOAD_BYTES) {
  return NextResponse.json(
    {
      error: "Payload too large",
      payload_bytes: payloadBytes,
      max_payload_bytes: MAX_PAYLOAD_BYTES,
    },
    { status: 413 }
  );
}

console.log("ENTER GATE");
console.log("[ENGINE RESULT BEFORE GATE]", engineResult);

const response = await withGate(() => {
  console.log("FETCH START");
  return retryingFetch(buildAzureUrl(), init, 5);
});
    const data = await response.json();

if ((global as any).__m13ExecutionArtifact) {
  delete (global as any).__m13ExecutionArtifact;
}
    console.log("AZURE RAW RESPONSE");
    console.log(JSON.stringify(data, null, 2));
    if (!response.ok) {
  console.error("[AzureOpenAI Error]", response.status, data);

  return NextResponse.json(
    {
      role: "assistant",
      content: "send_failed",
      status: "send_failed",
      tokens_used: 0,
      balance_after: balanceBefore ?? null,
      triketon: null
    },
    { status: 200 }
  );
}

    const usage = data?.usage ?? null;

        let content: string | undefined = data?.choices?.[0]?.message?.content;
        console.log("MODEL CONTENT START");
        console.log(content);
        console.log("MODEL CONTENT END");
    if (!content) {
      return NextResponse.json({ error: "No message content" }, { status: 502 });
    }



    let tokensUsed: number;

    if (usage && typeof usage.total_tokens === "number") {
      tokensUsed = usage.total_tokens;
    } else {
      const promptText = messages.map((m) => m.content).join(" ");
      const combinedText = `${promptText}\n${content}`;
      tokensUsed = estimateTokensFromText(combinedText);
    }
    const TOKENS_USED = Math.min(MODEL_MAX_TOKENS, tokensUsed);
    let tokenDelta = TOKENS_USED;

    console.log("[chat] ledger gate", {
      isAuthenticated,
      sessionEmail,
      sessionUserId,
      tokensUsed: TOKENS_USED,
    });

    if (isAuthenticated && sessionUserId) {
      try {
        let amountToDebit = TOKENS_USED;
        if (
          balanceBefore != null &&
          balanceBefore > 0 &&
          balanceBefore < TOKENS_USED
        ) {
          amountToDebit = balanceBefore;
        }

        const newBalance = await debit(sessionUserId, amountToDebit);
        balanceAfter = newBalance;
        tokenDelta = amountToDebit;
        console.log("[chat] ledger debit ok", {
          sessionUserId,
          balanceBefore,
          balanceAfter,
          tokensUsed: TOKENS_USED,
          amountToDebit,
        });
        if (balanceBefore != null && balanceBefore > 0 && balanceAfter <= 0) {
          status = "depleted_now";
        }
      } catch (err) {
        console.error("[chat] ledger debit failed", {
          sessionUserId,
          TOKENS_USED,
          err,
        });
      }
    } else {
      console.log("[chat] ledger skipped", {
        isAuthenticated,
        sessionUserId,
      });
    }

  let triketon: any = null;
const TRIKETON_ENABLED = process.env.TRIKETON_ENABLED === "true";

// HARD-ORDER GATE
const clientLedgerAppendOk = true;

if (TRIKETON_ENABLED) {
  try {
      if (!clientLedgerAppendOk) {
        throw new Error("Client ledger append not confirmed - DB write blocked");
      }

      const { spawn } = await import("child_process");
      const { getPool } = await import("@/lib/ledger");

      const seal = await new Promise<any>((resolve, reject) => {
        const p = spawn(
  "python3",
  ["-m", "triketon.triketon2048", "seal", String(content), "--json"],
  { stdio: ["ignore", "pipe", "pipe"] }
);



        let out = "";
        let err = "";

        p.stdout.on("data", (d) => (out += d.toString()));
        p.stderr.on("data", (d) => (err += d.toString()));

        p.on("close", (code) => {
          if (code !== 0) return reject(new Error(err || "triketon seal failed"));
          resolve(JSON.parse(out));
        });
      });

      if (seal?.public_key && seal?.timestamp) {
        const pool = await getPool();
        const { createHash } = await import("crypto");

        const normalized = content
          .normalize("NFKC")
          .replace(/\s+/g, " ")
          .trim();

        const dbTruthHash = createHash("sha256")
          .update(normalized, "utf8")
          .digest("hex");

        await pool.query(
          `INSERT INTO triketon_anchors
           (public_key, truth_hash, timestamp, orbit_context)
           VALUES ($1, $2, $3, 'chat')
           ON CONFLICT (public_key, truth_hash) DO NOTHING`,
          [seal.public_key, dbTruthHash, seal.timestamp]
        );

        const { computeClientTruthHash } = await import("@/lib/triketon2048/hashClient");

        triketon = {
          publicKey: seal.public_key,
          truthHash: computeClientTruthHash(content), // CLIENT DECOY
          timestamp: seal.timestamp,
          version: seal.version ?? "v1",
          hashProfile: "CLIENT_DECOY_V1",
          keyProfile: seal.key_profile ?? "TRIKETON_KEY_V1",
          anchorStatus: "anchored",
        };


      }
     } catch (e) {
    console.warn("[triketon] auto-anchor skipped", e);
  }
}

// ---- SESSION COUNTER (minimal & robust) ----
// Session counter already calculated at request start
// reuse existing serverCounter + conversationId

content = content.replace(
  /Session Prompt Counter:\s*.*/,
  `Session Prompt Counter: ${serverCounter}`
);

const res = NextResponse.json(
  {
    role: "assistant",
    content,
    message: content,
    status,
    tokens_used: TOKENS_USED,
    balance_after: balanceAfter,
    debug_usage: usage,
    triketon: triketon ?? null,
    user_registry: executionArtifact?.data?.available_items
  ? {
      items: executionArtifact.data.available_items,
      updated_at: executionArtifact?.meta?.timestamp ?? null
    }
  : engineResult?.collectedData?.user_registry ?? null,
    state: executionArtifact
  ? {
      active: false,
      extensionId: null,
      stepId: null
    }
  : engineResult.state
  },
  { status: 200 }
);

res.cookies.set({
  name: "mpathy_session",
  value: JSON.stringify({
    conversationId,
    counter: serverCounter,
  }),
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
});

res.headers.set("X-Tokens-Delta", String(-tokenDelta));
res.headers.set("X-Free-Used", String(count));
res.headers.set("X-Free-Limit", String(FREE_LIMIT));
res.headers.set("X-Free-Remaining", String(freeRemaining));
res.headers.set("X-Tokens-Overdraw", "0");

if (cookie) {
  res.headers.set("Set-Cookie", cookie);
}

return res;

  } catch (err: any) {
    console.error("[API Error]", err);
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}

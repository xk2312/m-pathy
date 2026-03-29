import { NextRequest, NextResponse } from "next/server";
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
import registry from "@/registry/registry.json";
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
  state?: any;
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

// === PRE-EXECUTION GATE ===
const lastUserMessage = body.messages?.[body.messages.length - 1]?.content ?? "";
const incomingState = body.state || {};

const executionIntentDetected =
  typeof lastUserMessage === "string" &&
  (
    lastUserMessage.toLowerCase().includes("linkedin") ||
    lastUserMessage.toLowerCase().includes("post") ||
    lastUserMessage.toLowerCase().includes("campaign")
  );

const alreadyLoaded =
  incomingState?.extensions &&
  Array.isArray(incomingState.extensions) &&
  incomingState.extensions.includes("linkedin_post_screener");

if (executionIntentDetected && !alreadyLoaded) {
  console.log("[M13] PRE-EXECUTION TRIGGERED");
  console.log("[M13] EXTENSION NOT LOADED → LOAD");

  return handleExecution(req, {
    messages: [
      {
        role: "assistant",
        content: JSON.stringify({
          action: "load_extension",
          target: "linkedin_post_screener"
        })
      }
    ]
  });
}

if (executionIntentDetected && alreadyLoaded) {
  console.log("[M13] EXTENSION ALREADY LOADED → SKIP");
}

async function handleExecution(req: NextRequest, body: any) {
    try {
      const last = body.messages?.[body.messages.length - 1];
      const parsed = JSON.parse(last.content);

      console.log("[M13] ACTION:", parsed.action, "TARGET:", parsed.target);

      if (parsed.action === "load_registry") {
        console.log("[M13] LOAD REGISTRY");

        return NextResponse.json({
          status: "ok",
          data: registry.registry,
          extension_loaded: null
        });
      }

      if (parsed.action === "load_extension") {
        console.log("[M13] LOAD EXTENSION:", parsed.target);

        const entry = registry.registry.entries.find(
          (e: any) => e.id === parsed.target
        );

        if (!entry) {
          return NextResponse.json({
            status: "invalid_target",
            data: null,
            extension_loaded: null
          }, { status: 400 });
        }

const filePath = path.join(process.cwd(), entry.path);

console.log("[M13] FILE PATH:", filePath);

const fileContent = fs.readFileSync(filePath, "utf-8");
const extensionData = JSON.parse(fileContent);

console.log("[M13] EXTENSION LOADED SUCCESS:", entry.id);
console.log("[M13] EXTENSION DATA KEYS:", Object.keys(extensionData || {}));

const extensionsLoaded = [entry.id];

console.log("[M13] STATE EXTENSIONS_LOADED:", extensionsLoaded);

return NextResponse.json({
  status: "success",
  data: extensionData,
  extension_loaded: entry.id,
  state: {
    extensions_loaded: extensionsLoaded
  },
  message: "Extension " + entry.id + " loaded successfully"
});
      }

      return NextResponse.json({
        status: "invalid_handoff",
        data: null,
        extension_loaded: null
      }, { status: 400 });

    } catch {
      console.log("[M13] INVALID HANDOFF");

      return NextResponse.json({
        status: "invalid_handoff",
        data: null,
        extension_loaded: null
      }, { status: 400 });
    }
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

const userPromptCount = body.messages.filter(
  (m: any) => m?.role === "user"
).length;

serverCounter = userPromptCount > 0 ? userPromptCount : 1;

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

const messages: ChatMessage[] = systemPrompt
  ? [
      { role: "system", content: systemPrompt },
      languageGuard,
      ...body.messages,
    ]
  : [
      languageGuard,
      ...body.messages,
    ];

 const irssRuntimePrompt = {
  role: "system",
  content: [
    "Two response modes exist:",
    "1. Content Mode",
    "2. Execution Mode",
    "",
    "Content Mode rules:",
    "Before emitting any IRSS, evaluate whether the request requires an extension.",
    "If an extension is required:",
    "- Do not emit IRSS",
    "- Do not emit natural language",
    "- Emit only a valid handoff JSON",
    "",
    "If no extension is required:",
    "1. First, output one valid IRSS JSON block.",
    "2. Then output one blank line.",
    "3. Then output the normal response content.",
    "",
    "Execution Mode rules:",
    "If the response is a handoff or execution request, do NOT output IRSS.",
    "Instead, output ONLY a valid JSON object representing the execution.",
    "No additional text is allowed.",
    "",
    "Handoff JSON rules for Execution Mode:",
    "Use exactly this JSON shape:",
    "{",
    '  "handoff": {',
    '    "system": "M13",',
    '    "version": "0.2",',
    '    "session_prompt_counter": "<fill>",',
    '    "orchestrator_id": "<fill>",',
    '    "command": "<fill>",',
    '    "target": "<extension_id>",',
    '    "payload": {',
    '      "<key>": "<value>"',
    "    }",
    "  }",
    "}",
    "",
    "All fields must be filled with valid values.",
    "Do not invent values.",
    "Do not leave placeholders.",
    "Do not output any text outside this JSON.",
    "",
    "IRSS rules for Content Mode:",
    "The IRSS block must be the first emitted output.",
    "Do not place any text before it.",
    "Do not wrap the IRSS block in markdown fences.",
    "Do not rename keys.",
    "Do not omit keys.",
    "Use exactly this JSON shape:",
    "{",
    '  "irss": {',
    '    "system": "M13",',
    '    "version": "0.2",',
    '    "session_prompt_counter": "<fill>",',
    '    "orchestrator_id": "<fill>",',
    '    "command": "<fill>",',
    '    "agent_id": "<fill>",',
    '    "action": "<fill>",',
    '    "extensions_loaded": [],',
    '    "complexity_level": "C1|C2|C3|C4|C5|C6",',
    '    "domains": [],',
    '    "drift_origin": "none|ambiguous_input|missing_context|missing_evidence|conflicting_signals|invalid_structure|unsupported_inference",',
    '    "drift_state": "none|detected",',
    '    "drift_risk": "none|low|medium|high"',
    "  }",
    "}",
    "",
    "Arrays must contain only valid identifiers or be empty [].",
    "Do not invent values.",
    "Do not leave placeholders.",
    "",
    "After the IRSS JSON block, continue with the normal answer in the same language as the user."
  ].join("\n"),
};
const payload = {
  messages: [
    irssRuntimePrompt,
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

const response = await withGate(() => {
  console.log("FETCH START");
  return retryingFetch(buildAzureUrl(), init, 5);
});
    const data = await response.json();
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

// === M13 EXECUTION SWITCH ===
console.log("[M13] RAW CONTENT START");
console.log(content);
console.log("[M13] RAW CONTENT END");

let parsed: any = null;
let isJson = false;

try {
  parsed = JSON.parse(content);
  isJson = typeof parsed === "object" && parsed !== null;
  console.log("[M13] JSON PARSE SUCCESS", { isJson, parsed });
} catch (err) {
  console.log("[M13] JSON PARSE FAILED");
}

// === HANDOFF VALIDATION ===
const isValidHandoff =
  isJson &&
  parsed.handoff &&
  typeof parsed.handoff === "object" &&
  typeof parsed.handoff.command === "string" &&
  typeof parsed.handoff.target === "string" &&
  typeof parsed.handoff.payload === "object";

console.log("[M13] HANDOFF CHECK", {
  isJson,
  hasHandoff: !!parsed?.handoff,
  command: parsed?.handoff?.command,
  target: parsed?.handoff?.target,
  hasPayload: typeof parsed?.handoff?.payload === "object",
  isValidHandoff
});

if (isValidHandoff) {
  console.log("[M13] VALID HANDOFF DETECTED → EXECUTION");

  return handleExecution(req, {
    messages: [
      {
        role: "assistant",
        content: JSON.stringify(parsed.handoff)
      }
    ]
  });
}

// === IRSS ENFORCEMENT ===
const hasHandoffMarker = content.includes('"handoff"');
const hasIrssMarker =
  content.includes('"irss"') ||
  content.includes("Session Prompt Counter:");

console.log("[M13] IRSS CHECK", {
  hasHandoffMarker,
  hasIrssMarker
});

// MIXED OUTPUT BLOCK
if (hasHandoffMarker && hasIrssMarker) {
  console.error("[M13] INVALID MIXED OUTPUT DETECTED");
  return NextResponse.json(
    { error: "Invalid mixed output (handoff + IRSS)" },
    { status: 500 }
  );
}

// CONTENT MODE WITHOUT IRSS BLOCK
if (!hasHandoffMarker && !hasIrssMarker) {
  console.error("[M13] IRSS MISSING IN CONTENT MODE");
  return NextResponse.json(
    { error: "IRSS missing in content mode" },
    { status: 500 }
  );
}

console.log("[M13] CONTENT MODE VALID → CONTINUE");

// === TOKEN HANDLING ===
let tokensUsed: number;

if (usage && typeof usage.total_tokens === "number") {
  tokensUsed = usage.total_tokens;
  console.log("[M13] TOKENS FROM USAGE", { tokensUsed });
} else {
  const promptText = messages.map((m) => m.content).join(" ");
  const combinedText = `${promptText}\n${content}`;
  tokensUsed = estimateTokensFromText(combinedText);
  console.log("[M13] TOKENS ESTIMATED", { tokensUsed });
}

const TOKENS_USED = Math.min(MODEL_MAX_TOKENS, tokensUsed);
let tokenDelta = TOKENS_USED;

console.log("[M13] FINAL TOKEN STATE", {
  TOKENS_USED,
  tokenDelta
});

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
    status,
    tokens_used: TOKENS_USED,
    balance_after: balanceAfter,
    debug_usage: usage,
    triketon: triketon ?? null,
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

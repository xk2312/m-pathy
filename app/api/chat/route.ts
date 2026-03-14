/*
================================================
CANONICAL FILE INDEX
FILE: app/api/chat/route.ts
SYSTEM: MAIOS / m-pathy
================================================

0. RUNTIME + ENVIRONMENT
0.1 Node Runtime Declaration
0.2 ENV Loading (dotenv, production/dev paths)
0.3 Azure Environment Variables
0.4 Runtime Limits
    - MODEL_MAX_TOKENS
    - GPTX_MAX_CHARS
    - MAX_PAYLOAD_BYTES
0.5 FreeGate Environment

------------------------------------------------

1. TYPE DEFINITIONS
1.1 Role Type
1.2 ChatMessage Interface
1.3 ChatBody Interface

------------------------------------------------

2. ENVIRONMENT VALIDATION
2.1 assertEnv()
    Validates required Azure OpenAI environment variables

------------------------------------------------

3. SYSTEM PROMPT LOADER
3.1 loadSystemPrompt(protocol)
    Loads GPTX protocol prompt file
    TELEMETRY INFLUENCE
    System prompt may contain telemetry schema or telemetry rules

------------------------------------------------

4. AZURE CLIENT INFRASTRUCTURE

4.1 buildAzureUrl()
    Constructs Azure OpenAI endpoint

4.2 estimateTokensFromText()
    Fallback token estimation

4.3 getMessagesCharCount()
    Payload size estimator

------------------------------------------------

5. TELEMETRY CONFIGURATION

5.1 TELEMETRY_REQUIRED_FIELDS
    TELEMETRY CRITICAL

    Canonical telemetry schema definition.
    Defines the expected telemetry keys.

    Used by:
    - telemetry validation
    - telemetry extraction
    - telemetry parsing
    - telemetry UI cockpit

------------------------------------------------

6. TELEMETRY VALIDATOR

6.1 isValidTelemetryBlock(text)

    TELEMETRY CRITICAL

    Responsibilities
    - Detect telemetry start
    - Parse telemetry key:value pairs
    - Validate required fields

    Used in:

    A. First telemetry enforcement
    B. Retry decision
    C. Post-seal validation
    D. Response pipeline gate

------------------------------------------------

7. HTTP ENTRYPOINT

7.1 POST(req: NextRequest)

    Main runtime handler

------------------------------------------------

8. REQUEST CONTRACT HARDENING

8.1 Content-Type validation
8.2 Server Action blocking

------------------------------------------------

9. SESSION + CONVERSATION MANAGEMENT

9.1 Cookie retrieval
9.2 conversationId generation
9.3 conversation override from body
9.4 serverPromptCounter calculation

    TELEMETRY INFLUENCE
    Used later to override
    "Session Prompt Counter"

------------------------------------------------

10. FREEGATE RATE CONTROL

10.1 Session detection
10.2 Guest request counting
10.3 Free limit enforcement
10.4 Checkout trigger

------------------------------------------------

11. LEDGER PRECHECK

11.1 Token balance validation
11.2 Insufficient token handling

------------------------------------------------

12. LOCALE RESOLUTION

12.1 Cookie + body locale extraction
12.2 Supported language mapping

------------------------------------------------

13. LANGUAGE GUARD

13.1 Language enforcement system prompt

    TELEMETRY INFLUENCE
    Alters message stack order
    and therefore affects model output structure

------------------------------------------------

14. SYSTEM PROMPT STACK

14.1 loadSystemPrompt()
14.2 message stack assembly

    TELEMETRY INFLUENCE
    Telemetry rules may exist in system prompt

------------------------------------------------

15. TELEMETRY SYSTEM PROMPT

15.1 telemetrySystemPrompt

    TELEMETRY CRITICAL

    Forces model to output telemetry block.

    Defines:
    FULL TELEMETRY STATUS
    Prompt
    Drift

    This is currently the main telemetry forcing mechanism.

------------------------------------------------

16. AZURE PAYLOAD CONSTRUCTION

16.1 payload.messages
16.2 temperature
16.3 max_tokens

    TELEMETRY INFLUENCE
    telemetrySystemPrompt is injected here.

------------------------------------------------

17. PAYLOAD SIZE VALIDATION

17.1 request payload measurement
17.2 MAX_PAYLOAD_BYTES enforcement

------------------------------------------------

18. AZURE REQUEST EXECUTION

18.1 concurrency gate
18.2 retryingFetch()
18.3 Azure response parsing

------------------------------------------------

19. RESPONSE EXTRACTION

19.1 Extract assistant message content

------------------------------------------------

20. TELEMETRY ENFORCEMENT

20.1 FIRST TELEMETRY CHECK

    TELEMETRY CRITICAL

    if (!isValidTelemetryBlock(content))

    If telemetry missing:
    - log
    - retry request

------------------------------------------------

21. TELEMETRY RETRY MECHANISM

21.1 strictRetryPayload

    TELEMETRY CRITICAL

    Retry request forcing telemetry.

21.2 retryResponse execution

21.3 retry validation

    If retry fails → telemetry_blocked message

------------------------------------------------

22. TOKEN ACCOUNTING

22.1 usage extraction
22.2 fallback token estimation
22.3 ledger debit

------------------------------------------------

23. TRIKETON SEALING

23.1 content sealing via Python
23.2 database anchoring
23.3 public key + hash generation

    TELEMETRY INFLUENCE
    Telemetry block included in sealed content

------------------------------------------------

24. TELEMETRY STRUCTURING PIPELINE

24.1 POST-SEAL TELEMETRY VALIDATION

    TELEMETRY CRITICAL

    Second telemetry validation gate.

24.2 Session Prompt Counter Override

    TELEMETRY CRITICAL

    Server replaces model counter
    with serverCounter.

------------------------------------------------

25. TELEMETRY PARSER

25.1 telemetry block extraction
25.2 telemetry object creation
25.3 cockpit telemetry mapping

    TELEMETRY CRITICAL

    Produces structured telemetry
    returned to UI.

------------------------------------------------

26. TELEMETRY CLEANUP

26.1 remove telemetry from assistant message
26.2 sanitize prefixes
26.3 generate cleanedContent

------------------------------------------------

27. FINAL RESPONSE ASSEMBLY

27.1 response payload
    role
    content
    telemetry
    status
    tokens_used
    triketon

------------------------------------------------

28. SESSION COOKIE UPDATE

28.1 mpahy_session cookie write
28.2 conversationId persistence
28.3 counter persistence

------------------------------------------------

29. RESPONSE HEADERS

29.1 token delta
29.2 freegate headers

------------------------------------------------

30. FINAL RESPONSE RETURN

30.1 NextResponse.json()

------------------------------------------------

31. GLOBAL ERROR HANDLER

31.1 catch block
31.2 API error response

================================================
END OF CANONICAL INDEX
================================================
*/

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
const GPTX_MAX_CHARS   = parseInt(process.env.GPTX_MAX_CHARS   ?? "32000", 10);
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

const TELEMETRY_REQUIRED_FIELDS = [
  "System:",
  "Version:",
  "Telemetry Authority:",
  "Session Prompt Counter:",
  "Telemetry Order:",
  "Telemetry Scope:",
  "Telemetry Mutability:",
  "Telemetry Failure Policy:",
  "Telemetry Source Separation:",
  "User Mode:",
  "System Mode:",
  "Effective Mode:",
  "Expert Status:",
  "Expert Type:",
  "Expert ID:",
  "Drift Origin:",
  "Drift State:",
  "Drift Risk:",
  "Orchestration Mode:",
  "Orchestration Authority:",
  "Expert Configuration:",
  "Complexity Level:",
  "Council Final Status:",
  "Expert Rights Profile:",
  "Expert Rights Scope:",
  "Expert Rights Source:",
  "Analysis Container State:",
  "Expert Activation Count:",
  "Council Decision ID:",
  "Council Rights Attestation:",
  "Council Decision Trace:"
];

const TELEMETRY_START_SENTINEL = "<<<MAIOS_TELEMETRY_START>>>";
const TELEMETRY_END_SENTINEL = "<<<MAIOS_TELEMETRY_END>>>";
const CONTENT_START_SENTINEL = "<<<MAIOS_CONTENT_START>>>";
const CONTENT_END_SENTINEL = "<<<MAIOS_CONTENT_END>>>";

function buildTelemetrySkeleton(): string {
  const telemetryFields = TELEMETRY_REQUIRED_FIELDS
    .map((field) => `${field} <value>`)
    .join("\n");

  return [
    TELEMETRY_START_SENTINEL,
    telemetryFields,
    TELEMETRY_END_SENTINEL,
    CONTENT_START_SENTINEL,
    "<assistant content>",
    CONTENT_END_SENTINEL,
  ].join("\n");
}

function extractTelemetryEnvelope(text: string) {
  if (!text) {
    return {
      telemetryBlock: null,
      contentBlock: null,
    };
  }

  const startTelemetry = text.indexOf(TELEMETRY_START_SENTINEL);
  const endTelemetry = text.indexOf(TELEMETRY_END_SENTINEL);

  const startContent = text.indexOf(CONTENT_START_SENTINEL);
  const endContent = text.indexOf(CONTENT_END_SENTINEL);

  let telemetryBlock: string | null = null;
  let contentBlock: string | null = null;

  if (startTelemetry !== -1 && endTelemetry !== -1 && endTelemetry > startTelemetry) {
    telemetryBlock = text
      .slice(startTelemetry + TELEMETRY_START_SENTINEL.length, endTelemetry)
      .trim();
  }

  if (startContent !== -1 && endContent !== -1 && endContent > startContent) {
    contentBlock = text
      .slice(startContent + CONTENT_START_SENTINEL.length, endContent)
      .trim();
  }

  return {
    telemetryBlock,
    contentBlock,
  };
}

function isValidTelemetryBlock(text: string): boolean {
  if (!text) return false;

  const { telemetryBlock } = extractTelemetryEnvelope(text);

  if (!telemetryBlock) {
    console.warn("[telemetry] envelope missing");
    return false;
  }

  const lines = telemetryBlock
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const telemetryObj: Record<string, string> = {};

  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx + 1).trim();
    const value = line.slice(idx + 1).trim();

    telemetryObj[key] = value;
  }

  const missing = TELEMETRY_REQUIRED_FIELDS.filter(
    (field) => !(field in telemetryObj)
  );

  if (missing.length > 0) {
    console.warn("[telemetry] missing fields:", missing);
    return false;
  }

  return true;
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
      : [languageGuard, ...body.messages];


    


    const telemetrySystemPrompt = {
      role: "system",
      content: `
    You are running inside MAIOS.

    Every response MUST follow the exact output structure below.

    Fill the values for each telemetry field.

    Do NOT change the markers.
    Do NOT translate telemetry field names.
    Do NOT add extra lines inside the telemetry block.
    Do NOT place text outside the defined blocks.

    ${buildTelemetrySkeleton()}
    `
    };

const payload = {
  messages: [
    telemetrySystemPrompt,
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
    if (!content) {
      return NextResponse.json({ error: "No message content" }, { status: 502 });
    }

  // === TELEMETRY STRUCTURING ===
if (!isValidTelemetryBlock(content)) {
  console.warn("[telemetry] invalid or missing block - retrying once");
  console.error("----- TELEMETRY FIRST ATTEMPT START -----");
  console.error(content);
  console.error("----- TELEMETRY FIRST ATTEMPT END -----");

  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .slice(-1);

 const strictRetryPayload = {
  messages: [
    {
      role: "system",
      content: `
You are running inside MAIOS.

The previous response violated the telemetry rules.

You MUST follow the exact output structure below.

Fill the telemetry values correctly.

Do not modify markers.
Do not add text outside the defined blocks.

${buildTelemetrySkeleton()}
`,
    },
    ...lastUserMessage,
  ],
  temperature: 0,
  max_tokens: MODEL_MAX_TOKENS,
};

  const retryInit: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify(strictRetryPayload),
  };

  const retryResponse = await withGate(() =>
    retryingFetch(buildAzureUrl(), retryInit, 5)
  );

  const retryData = await retryResponse.json();
  const retryContent: string | undefined =
    retryData?.choices?.[0]?.message?.content;

      if (!retryResponse.ok || !retryContent || !isValidTelemetryBlock(retryContent)) {
        console.error("[telemetry] enforcement failed after retry");
        console.error("----- TELEMETRY RETRY ATTEMPT START -----");
        console.error(retryContent ?? "[retryContent missing]");
        console.error("----- TELEMETRY RETRY ATTEMPT END -----");

        const telemetryBlockedMessages: Record<string, string> = {
          en: "SYSTEM NOTICE: Telemetry validation failed. Output was blocked according to system policy. Please retry your request.",
          de: "SYSTEM-HINWEIS: Die Telemetrieprüfung ist fehlgeschlagen. Die Ausgabe wurde gemäß Systemrichtlinie blockiert. Bitte wiederhole deine Anfrage.",
          fr: "AVIS SYSTÈME : La validation de la télémétrie a échoué. La sortie a été bloquée conformément à la politique du système. Veuillez réessayer.",
          es: "AVISO DEL SISTEMA: La validación de telemetría falló. La salida fue bloqueada según la política del sistema. Por favor, repite tu solicitud.",
          it: "AVVISO DI SISTEMA: La validazione della telemetria è fallita. L'output è stato bloccato secondo la politica del sistema. Ripeti la richiesta.",
          pt: "AVISO DO SISTEMA: A validação de telemetria falhou. A saída foi bloqueada conforme a política do sistema. Por favor, tente novamente.",
          nl: "SYSTEEMBERICHT: Telemetrievalidatie mislukt. De uitvoer is geblokkeerd volgens het systeembeleid. Probeer het opnieuw.",
          ru: "СИСТЕМНОЕ УВЕДОМЛЕНИЕ: Проверка телеметрии не удалась. Вывод был заблокирован в соответствии с политикой системы. Повторите запрос.",
          zh: "系统提示：遥测验证失败。根据系统策略，输出已被阻止。请重新提交请求。",
          ja: "システム通知：テレメトリ検証に失敗しました。システムポリシーに従い出力がブロックされました。再度お試しください。",
          ko: "시스템 알림: 텔레메트리 검증에 실패했습니다. 시스템 정책에 따라 출력이 차단되었습니다. 다시 시도해 주세요.",
          ar: "إشعار النظام: فشل التحقق من القياس عن بعد. تم حظر الإخراج وفقًا لسياسة النظام. يرجى إعادة المحاولة.",
          hi: "सिस्टम सूचना: टेलीमेट्री सत्यापन विफल रहा। सिस्टम नीति के अनुसार आउटपुट अवरुद्ध कर दिया गया है। कृपया पुनः प्रयास करें।",
        };

        const safeLocale =
          telemetryBlockedMessages[localeFromCookie] ? localeFromCookie : "en";

        return NextResponse.json(
          {
            role: "assistant",
            content: telemetryBlockedMessages[safeLocale],
            status: "telemetry_blocked",
            tokens_used: 0,
            balance_after: balanceBefore ?? null,
            triketon: null,
          },
          { status: 200 }
        );
      }

      const envelope = extractTelemetryEnvelope(retryContent);

if (!envelope.telemetryBlock || !envelope.contentBlock) {
  console.error("[telemetry] envelope parsing failed");
  console.error("----- ENVELOPE RAW START -----");
  console.error(retryContent);
  console.error("----- ENVELOPE RAW END -----");
}

content = envelope.contentBlock ?? retryContent;

if (content) {
  content = content
    .replace(TELEMETRY_START_SENTINEL, "")
    .replace(TELEMETRY_END_SENTINEL, "")
    .replace(CONTENT_START_SENTINEL, "")
    .replace(CONTENT_END_SENTINEL, "")
    .trim();
}
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

    // HARD-ORDER GATE: DB write allowed only after client ledger truth is established
    const clientLedgerAppendOk = true;

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


// === TELEMETRY STRUCTURING (POST-SEAL, PRE-RESPONSE) ===
let structuredTelemetry: any = null;
let cleanedContent = content;

if (!isValidTelemetryBlock(content)) {
  console.error("[telemetry] validation failed");

  return NextResponse.json(
    { error: "Telemetry validation failed" },
    { status: 500 }
  );
}

// ---- SESSION COUNTER (minimal & robust) ----
// Session counter already calculated at request start
// reuse existing serverCounter + conversationId

content = content.replace(
  /Session Prompt Counter:\s*\d+/,
  `Session Prompt Counter: ${serverCounter}`
);

const ledgerContent = content;

const lines = content.split("\n");

const startIndex = lines.findIndex((l) =>
  l.startsWith("System:")
);

if (startIndex !== -1) {
  const telemetryLines = lines.slice(
    startIndex,
    startIndex + TELEMETRY_REQUIRED_FIELDS.length
  );

  const telemetryObj: Record<string, string> = {};

  telemetryLines.forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();

    if (!key) return;

    telemetryObj[key] = value;
  });

  structuredTelemetry = {
    cockpit: {
      system: telemetryObj["System"] ?? "",
      version: telemetryObj["Version"] ?? "",
      promptCounter: telemetryObj["Session Prompt Counter"] ?? "",
      effectiveMode: telemetryObj["Effective Mode"] ?? "",
      complexityLevel: telemetryObj["Complexity Level"] ?? "",
      driftState: telemetryObj["Drift State"] ?? "",
      driftRisk: telemetryObj["Drift Risk"] ?? "",
      driftOrigin: telemetryObj["Drift Origin"] ?? "",
    },
    parsed: telemetryObj,
  };

  const telemetryEnd = startIndex + TELEMETRY_REQUIRED_FIELDS.length;

  cleanedContent = [
    ...lines.slice(0, startIndex),
    ...lines.slice(telemetryEnd),
  ].join("\n").trim();
} else {
  cleanedContent = content;
}

cleanedContent = cleanedContent
  .replace(/^Telemetry Block\s*/i, "")
  .replace(/^Explanation:\s*/i, "")
  .trim();

const res = NextResponse.json(
  {
    role: "assistant",
    content: cleanedContent,
    telemetry: structuredTelemetry,
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

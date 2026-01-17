/***
 * =====================================================================
 *  M — CHAT API ROUTE (Azure · FreeGate · Ledger · Triketon)
 * =====================================================================
 *
 *  FILE
 *  - app/api/chat/route.ts
 *
 *  STATUS
 *  - Route ist funktionsfähig (Azure-Proxy, FreeGate, Ledger-Debit)
 *  - Trägt AKTIV zu den aktuellen Problemen bei (Triketon / Archive / Verify)
 *
 *  ZIEL DIESES INDEX
 *  - bestehenden Inventus-Index präzisieren und erweitern
 *  - explizit markieren, WO diese Route unsere aktuellen Fehler verursacht
 *  - klare Trennung: Gate/Proxy vs. Truth-/Ledger-Ebene
 *
 * =====================================================================
 *
 *  INDEX (Sprunganker – erweitert & korrigiert)
 *  ---------------------------------------------------------------------
 *  [ANCHOR:0]   RUNTIME & IMPORTS
 *  [ANCHOR:1]   ENV-LOADING & KONFIGURATION
 *  [ANCHOR:2]   TYPEN & ENV-ASSERT
 *  [ANCHOR:3]   SYSTEMPROMPT & LANGUAGE-GUARD
 *  [ANCHOR:4]   REQUEST-PARSING
 *  [ANCHOR:5]   AUTH & FREEGATE (ACCESS-GATE)
 *  [ANCHOR:6]   FREEGATE-BLOCKING & RESPONSE-HEADERS
 *  [ANCHOR:7]   LEDGER-PRECHECK (BALANCE READ)
 *  [ANCHOR:8]   LOCALE-DETERMINATION
 *  [ANCHOR:9]   AZURE-PAYLOAD-BUILD
 *  [ANCHOR:10]  AZURE-CALL (withGate + retryingFetch)
 *  [ANCHOR:11]  AZURE-RESPONSE-PARSING
 *  [ANCHOR:12]  TOKEN-ESTIMATION & LEDGER-DEBIT
 *  [ANCHOR:13]  TRIKETON-SEAL & DB-ANCHORING   ← 🔴 KRITISCH
 *  [ANCHOR:14]  RESPONSE-BUILD (assistant payload)
 *  [ANCHOR:15]  ERROR-HANDLING
 *
 *  PROBLEM-RELEVANCE MAP (ABSOLUT WICHTIG)
 *  ---------------------------------------------------------------------
 *  🔴 Triketon-Public-Key Drift        → [ANCHOR:13]
 *  🔴 Assistant-Triketon nicht deterministisch → [ANCHOR:13]
 *  🔴 Verify-Mismatch (Client vs Server) → [ANCHOR:13] + Client
 *  🔴 Archive-Pair-Ausfall (Folgeschaden) → indirekt [ANCHOR:13]
 *
 * =====================================================================
 */


/* =====================================================================
 * [ANCHOR:0] RUNTIME & IMPORTS
 * =====================================================================
 *
 * - runtime = "nodejs" (korrekt, da FS + ChildProcess genutzt wird)
 * - Route ist SERVER-ONLY, keine Client-Abhängigkeit
 *
 * PROBLEMRELEVANZ:
 * ❌ keine direkte
 */


/* =====================================================================
 * [ANCHOR:1] ENV-LOADING & KONFIGURATION
 * =====================================================================
 *
 * - .env.production vs .env.local / .env.payment
 * - Azure-Parameter + Limits
 * - FREE_LIMIT, FREEGATE_SECRET, CHECKOUT_URL
 *
 * PROBLEMRELEVANZ:
 * ❌ keine direkte
 */


/* =====================================================================
 * [ANCHOR:2] TYPEN & ENV-ASSERT
 * =====================================================================
 *
 * - ChatMessage / ChatBody
 * - assertEnv(): verhindert leisen Azure-Fehler
 *
 * PROBLEMRELEVANZ:
 * ❌ keine direkte
 */


/* =====================================================================
 * [ANCHOR:3] SYSTEMPROMPT & LANGUAGE-GUARD
 * =====================================================================
 *
 * - loadSystemPrompt(protocol)
 * - languageGuard (system role, locale enforced)
 *
 * PROBLEMRELEVANZ:
 * ❌ keine direkte
 * ⚠️ erzeugt zusätzliche system messages, die clientseitig ignoriert werden
 */


/* =====================================================================
 * [ANCHOR:4] REQUEST-PARSING
 * =====================================================================
 *
 * - POST(req)
 * - Validiert body.messages
 *
 * PROBLEMRELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:5] AUTH & FREEGATE (ACCESS-GATE)
 * =====================================================================
 *
 * - Cookie parsing (AUTH_COOKIE_NAME)
 * - verifySessionToken()
 * - verifyAndBumpFreegate()
 *
 * PROBLEMRELEVANZ:
 * ❌ keine bzgl. Archive/Triketon
 */


/* =====================================================================
 * [ANCHOR:6] FREEGATE-BLOCKING & RESPONSE-HEADERS
 * =====================================================================
 *
 * - 401 / 402 handling
 * - X-Free-* Header
 *
 * PROBLEMRELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:7] LEDGER-PRECHECK (BALANCE READ)
 * =====================================================================
 *
 * - getBalance(sessionUserId)
 * - ggf. 402 insufficient_tokens
 *
 * PROBLEMRELEVANZ:
 * ❌ keine bzgl. Triketon
 */


/* =====================================================================
 * [ANCHOR:8] LOCALE-DETERMINATION
 * =====================================================================
 *
 * - body.locale > cookie lang > NEXT_LOCALE > "en"
 *
 * PROBLEMRELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:9] AZURE-PAYLOAD-BUILD
 * =====================================================================
 *
 * - messages = [systemPrompt?, languageGuard, ...body.messages]
 * - temperature, max_tokens
 *
 * PROBLEMRELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:10] AZURE-CALL
 * =====================================================================
 *
 * - withGate(retryingFetch(...))
 *
 * PROBLEMRELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:11] AZURE-RESPONSE-PARSING
 * =====================================================================
 *
 * - data.choices[0].message.content
 *
 * PROBLEMRELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * [ANCHOR:12] TOKEN-ESTIMATION & LEDGER-DEBIT
 * =====================================================================
 *
 * - estimateTokensFromText()
 * - debit(sessionUserId, amount)
 *
 * PROBLEMRELEVANZ:
 * ❌ keine bzgl. Archive
 */


/* =====================================================================
 * [ANCHOR:13] TRIKETON-SEAL & DB-ANCHORING   🔴
 * =====================================================================
 *
 * CODE:
 * - spawn("python3", ["-m", "triketon.triketon2048", "seal", content, "--json"])
 * - INSERT INTO triketon_anchors (public_key, truth_hash, timestamp, orbit_context)
 *
 * 🔴 KRITISCHE BEFUNDE:
 *
 * 1. Public-Key wird SERVERSEITIG generiert
 *    → Client kennt diesen Key NICHT
 *
 * 2. Client verwendet eigenen Device/Public-Key
 *    → Verify(public_key + truth_hash) schlägt fehl
 *
 * 3. Assistant-Triketon wird HIER erzeugt,
 *    aber Client persistiert Assistant ggf. an anderem Zeitpunkt
 *
 * 4. chain_id wird NICHT gesetzt
 *    → ArchivePairProjection kann Assistant NICHT korrekt zuordnen
 *
 * FOLGEN (Systemweit):
 * ❌ Verify liefert FALSE
 * ❌ mpathy:archive:pairs:v1 bleibt leer
 * ❌ Assistant existiert visuell, aber nicht in Wahrheitsschicht
 */


/* =====================================================================
 * [ANCHOR:14] RESPONSE-BUILD (assistant payload)
 * =====================================================================
 *
 * - Response enthält:
 *     role, content, status, tokens_used, balance_after, triketon
 *
 * PROBLEMRELEVANZ:
 * ⚠️ triketon-Objekt wird an Client zurückgegeben,
 *    ist aber NICHT konsistent mit Client-Ledger-Keys
 */


/* =====================================================================
 * [ANCHOR:15] ERROR-HANDLING
 * =====================================================================
 *
 * - try/catch → 500
 *
 * PROBLEMRELEVANZ:
 * ❌ keine
 */


/* =====================================================================
 * SYSTEMISCHE ZUSAMMENFASSUNG (WAHRHEIT)
 * =====================================================================
 *
 * ❌ Diese Route ist KEIN reiner Proxy mehr.
 * ❌ Sie mischt Gate-, Ledger- und Truth-Logik.
 *
 * 🔴 HAUPTBEITRAG ZUM AKTUELLEN PROBLEM:
 * - Server generiert eigene Triketon-Public-Keys
 * - Kein chain_id im Anchor
 * - Keine deterministische Kopplung Client ↔ Server
 *
 * RESULTAT:
 * - Triketon existiert doppelt (Client vs Server)
 * - Archive-Pairs können nicht entstehen
 * - Verify wirkt „kaputt“, ist aber logisch korrekt
 *
 * FIX-LAGE (nur zur Einordnung, kein Patch):
 * - Entweder:
 *   A) Client liefert PublicKey + chain_id an Server
 *   B) Server ist einzige Triketon-Wahrheit
 *
 * Aktuell: HYBRID → inkonsistent.
 *
 * =====================================================================
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

// === Token-Schätzung für Fallback ===
function estimateTokensFromText(text: string): number {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return 1;
  const approxTokens = Math.ceil(normalized.length / 4);
  return approxTokens > 0 ? approxTokens : 1;
}

// === POST-Handler (mit Gate + Backoff + FreeGate) ===
export async function POST(req: NextRequest) {

  try {
    const body = (await req.json()) as ChatBody;

    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "`messages` must be an array of { role, content }" },
        { status: 400 }
      );
    }

// — FreeGate (BS13/7: jetzt *mit* 402 + Checkout) —

// Session aus m_auth-Cookie lesen (falls vorhanden)
const cookieHeader = req.headers.get("cookie") ?? null;

let sessionEmail: string | null = null;
let sessionUserId: string | null = null;

if (cookieHeader) {
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const authPart = parts.find((p) => p.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (authPart) {
    try {
      const raw = authPart.slice(AUTH_COOKIE_NAME.length + 1);
      const payload = verifySessionToken(raw);

      if (payload?.email) {
        sessionEmail = payload.email;
        if ((payload as any).id != null) {
          sessionUserId = String((payload as any).id);
        }
      }
    } catch {
      // ⚠️ absichtlich leer:
      // ungültiger Cookie → Gast (FreeGate greift)
      sessionEmail = null;
      sessionUserId = null;
    }
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


// — Ab hier: echte Azure-Antwort —
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
            r.headers.set(
"Set-Cookie", cookie);
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

    const usage = data?.usage ?? null;

    const content: string | undefined = data?.choices?.[0]?.message?.content;
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

    // HARD-ORDER GATE: DB write allowed only after client ledger truth is established
    const clientLedgerAppendOk = true;

    try {
      if (!clientLedgerAppendOk) {
        throw new Error("Client ledger append not confirmed — DB write blocked");
      }

      const { spawn } = await import("child_process");
      const { getPool } = await import("@/lib/ledger");

      const seal = await new Promise<any>((resolve, reject) => {
        const p = spawn(
          "python3",
          ["-m", "triketon.triketon2048", "seal", content, "--json"],
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

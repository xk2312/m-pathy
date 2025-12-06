/*** =======================================================================
 *  INVENTUS INDEX — app/api/chat/route.ts
 *  Chat-Proxy · FreeGate · Azure OpenAI · Token-Header (ohne Ledger-Debit)
 * =======================================================================
 *
 *  [ANCHOR:0] RUNTIME & IMPORTS
 *    – NodeJS-Runtime, da FS/ENV-Handling (dotenv, fs, path).
 *    – withGate + retryingFetch für Azure-Ratelimit & Backoff.
 *    – verifyAndBumpFreegate für FreeGate-Limitierung.
 *    – AUTH_COOKIE_NAME + verifySessionToken für Session-Erkennung.
 *
 *  [ANCHOR:1] ENV-LADUNG & KONFIG
 *    – Lädt .env.* abhängig von NODE_ENV.
 *    – Azure-Parameter: ENDPOINT, KEY, DEPLOYMENT, API-VERSION.
 *    – Modellgrenzen: MODEL_MAX_TOKENS, GPTX_MAX_CHARS.
 *    – FreeGate-Parameter: FREE_LIMIT (z. B. 9), FREEGATE_SECRET, CHECKOUT_URL.
 *
 *  [ANCHOR:2] TYPEN & assertEnv()
 *    – ChatBody/messages-Struktur.
 *    – assertEnv(): garantiert vollständige Azure-Konfiguration, sonst Error.
 *
 *  [ANCHOR:3] SYSTEMPROMPT & URL-Builder
 *    – loadSystemPrompt(protocol): liest /srv/m-pathy/${protocol}.txt (Hardcap).
 *    – buildAzureUrl(): robustes URL-Routing für verschiedene Endpoint-Formate.
 *
 *  [ANCHOR:4] REQUEST-PARSING
 *    – POST-Handler liest JSON-Body, prüft, ob body.messages ein Array ist.
 *    – Fehlerhafte Eingaben → HTTP 400.
 *
 *  [ANCHOR:5] FREEGATE + AUTH (TOKEN-HOTSPOT)
 *    – Liest Cookie-Header, extrahiert m_auth per AUTH_COOKIE_NAME und
 *      verifiziert SessionToken → sessionEmail / isAuthenticated.
 *    – verifyAndBumpFreegate(cookieHeader, userAgent, freeLimit, secret):
 *        · count: bisherige Requests
 *        · blocked: ob Limit überschritten
 *        · cookie: aktualisierter FreeGate-Cookie
 *    – Berechnet X-Free-Remaining = max(FREE_LIMIT - count, 0).
 *
 *  [ANCHOR:6] LIMIT-VERHALTEN
 *    – Wenn blocked:
 *        · Gäste → 401, status:"free_limit_reached", needs_login:true.
 *        · Eingeloggt → 402, status:"free_limit_reached", checkout_url.
 *    – Setzt Response-Header:
 *        · X-Free-Used, X-Free-Limit, X-Free-Remaining, X-Tokens-Delta:"0".
 *
 *  [ANCHOR:7] AZURE-CALL
 *    – assertEnv() → Sicherheitscheck.
 *    – Optionaler Systemprompt (protocol oder "GPTX") + messages-Merge.
 *    – Request an Azure via withGate(retryingFetch(..., 5)).
 *    – Fehler direkt als Upstream-Fehler zurückgegeben (Status durchgereicht).
 *
 *  [ANCHOR:8] INHALT & TOKEN-HEADER (STUB)
 *    – content = data.choices[0].message.content, ansonsten 502.
 *    – TOKENS_USED = Math.min(MODEL_MAX_TOKENS, 120) (Schätz-Stub).
 *    – Antwort: { role:"assistant", content } mit HTTP 200.
 *    – Setzt Header:
 *        · X-Tokens-Delta = -TOKENS_USED (nur Signal, kein Ledger-Debit).
 *        · X-Free-Used, X-Free-Limit, X-Free-Remaining.
 *        · X-Tokens-Overdraw = "0".
 *        · Optional: Set-Cookie mit aktualisiertem FreeGate-Cookie.
 *
 *  [ANCHOR:9] ERROR-HANDLING
 *    – Fängt alle Fehler, loggt sie und antwortet mit HTTP 500 sowie
 *      error:err.message.
 *
 *  TOKEN-RELEVANZ (SUMMARY)
 *    – Diese Route entscheidet, wann Nutzer von FreeGate in den Kauffluss
 *      (Stripe) übergehen müssen, und liefert einen geplanten Token-Delta-
 *      Header (X-Tokens-Delta) als Signal.
 *    – Sie führt aktuell KEINEN echten Token-Debit im Ledger aus, sondern
 *      belässt den Ledger-Saldo unverändert.
 *    – Die Diskrepanz zwischen numerischem Ledger-User (Webhooks) und
 *      E-Mail-basiertem User in /api/me/balance ist hier sichtbar nur über
 *      Header/Session-Erkennung, nicht über eine Ledger-Operation.
 *
 *  INVENTUS NOTE
 *    – Reine Inventur: app/api/chat/route.ts ist derzeit ein Gate- & Proxy-
 *      Layer ohne direkten Zugriff auf das Token-Ledger; jegliche echte
 *      Token-Abbuchungslogik müsste hier oder in einem nachgelagerten
 *      Service erst noch mit dem Ledger gekoppelt werden.
 * ======================================================================= */


// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { withGate, retryingFetch } from "@/lib/rate";
import { verifyAndBumpFreegate } from "@/lib/freegate"; // FreeGate
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";


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
if (cookieHeader) {
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const authPart = parts.find((p) => p.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (authPart) {
    const raw = authPart.slice(AUTH_COOKIE_NAME.length + 1);
    const payload = verifySessionToken(raw);
    sessionEmail = payload?.email ?? null;
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

    if (process.env.NODE_ENV !== "production") {
      console.log("[Azure usage]", data?.usage ?? null);
    }

    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No message content" }, { status: 502 });
    }

    let tokensUsed = 120;
    const usage = data?.usage;
    if (usage && typeof usage.total_tokens === "number") {
      tokensUsed = usage.total_tokens;
    }
    const TOKENS_USED = Math.min(MODEL_MAX_TOKENS, tokensUsed);

    const res = NextResponse.json({ role: "assistant", content }, { status: 200 });
    res.headers.set("X-Tokens-Delta", String(-TOKENS_USED));
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

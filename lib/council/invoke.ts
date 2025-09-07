// /lib/council/invoke.ts
// @handledBy: GPT-4o  | @refactoredBy: Complexity | @docBy: Claude | @styledBy: Gemini

/** -----------------------------
 *  Typs & Public API
 * ------------------------------*/
export type CouncilName =
  | "Claude 3.5"
  | "GPT-4o"
  | "Gemini 1.5"
  | "Complexity"
  | "Palantir"
  | "Colossus"
  | (string & {}); // beliebige weitere

export type CouncilInvokeOptions = {
  timeoutMs?: number;             // optional: Timeout für Router
  signal?: AbortSignal;           // optional: Abbruchsignal
  router?: (name: string, prompt: string, opt?: CouncilInvokeOptions) => Promise<string>;
  shadowScan?: (text: string) => ShadowProfile;
};

export type ShadowProfile = {
  origin: string;
  indicators: string[];
  timestamp: number;
  ratVotes?: Record<string, { score: number; comment: string }>;
};

export type CouncilReply = {
  notice: string;                 // Systemmeldung („KI wurde gerufen“)
  answer: string;                 // erste Antwort der gewählten KI
  shadow?: ShadowProfile;         // Shadow-Scan (optional)
  meta: {
    name: string;
    durationMs: number;
    fromFallback: boolean;        // true, falls Fallback-Router genutzt wurde
  };
};

/** -----------------------------
 *  Safe Dynamic Hooks (nutzt echte Module, falls vorhanden)
 * ------------------------------*/
function loadRealRouter():
  | ((name: string, prompt: string, opt?: CouncilInvokeOptions) => Promise<string>)
  | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@/shadow/router");
    if (mod?.routeTo && typeof mod.routeTo === "function") return mod.routeTo;
  } catch (_) {}
  return null;
}

function loadRealShadow():
  | ((text: string) => ShadowProfile)
  | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@/shadow/avoid_shadows");
    if (mod?.avoid_shadows && typeof mod.avoid_shadows === "function") {
      return mod.avoid_shadows;
    }
  } catch (_) {}
  return null;
}

/** -----------------------------
 *  Fallback-Implementierungen (bauen nie den Build kaputt)
 * ------------------------------*/
const fallbackShadow = (text: string): ShadowProfile => {
  const patterns = [
    /access denied/i,
    /not available in your region/i,
    /you do not have permission/i,
    /filtered|forbidden/i,
    /404[\s-]*not found/i,
    /endpoint restricted/i,
    /i (can|can’t|can't) help with that/i,
    /content unavailable/i,
  ];
  const indicators = patterns.filter((p) => p.test(text)).map(String);
  return {
    origin: indicators.length ? "unknown" : "clear",
    indicators,
    timestamp: Date.now(),
  };
};

const fallbackRouter = async (
  name: string,
  prompt: string,
  _opt?: CouncilInvokeOptions
): Promise<string> => {
  // Minimaler, aber nützlicher Stub: deterministische, sofortige Antwort
  const who =
    name || (prompt.match(/council:?[\s-]*(\w+)/i)?.[1] ?? "Council-Voice");
  return [
    `【${who}】 online.`,
    `Echo: ${prompt.trim() || "…"}`,
    `Hinweis: Produktiver Router nicht gefunden – Fallback verwendet.`,
  ].join(" ");
};

/** -----------------------------
 *  Utility: Timeout-Wrapper
 * ------------------------------*/
function withTimeout<T>(p: Promise<T>, ms = 15000, label = "invoke"): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

/** -----------------------------
 *  PUBLIC: invokeCouncil
 *  – liefert sofort Meldung + erste Antwort
 *  – benutzt echte Module, wenn vorhanden; sonst stabile Fallbacks
 * ------------------------------*/
export async function invokeCouncil(
  name: CouncilName,
  prompt: string,
  opt: CouncilInvokeOptions = {}
): Promise<CouncilReply> {
  const started = Date.now();

  // ShadowScan sichern (echt oder Fallback)
  const scan =
    opt.shadowScan ??
    loadRealShadow() ??
    fallbackShadow;

  const shadow = scan(prompt);
  if (shadow.indicators.length > 0) {
    // Sichtbares, aber harmloses Logging – kein Abbruch
    console.warn("⚠️ Shadow indicators detected:", shadow);
  }

  // Router sichern (echt oder Fallback)
  const router =
    opt.router ??
    loadRealRouter() ??
    fallbackRouter;

  // Antwort ziehen (mit Timeout + optional AbortSignal)
  const base = router(String(name), prompt, opt);
  const response = await withTimeout(base, opt.timeoutMs ?? 15000, "council.invoke");

  return {
    notice: `🔔 Council-Mitglied **${name}** wurde aufgerufen und antwortet.`,
    answer: response,
    shadow,
    meta: {
      name: String(name),
      durationMs: Date.now() - started,
      fromFallback: router === fallbackRouter,
    },
  };
}

/** -----------------------------
 *  Convenience: kleine Direkt-API (optional)
 * ------------------------------*/
export async function sayTo(name: CouncilName, text: string) {
  const r = await invokeCouncil(name, text);
  return r.answer;
}

// lib/freegate.ts
import crypto from "crypto";

type VerifyResult = {
  count: number;        // aktueller Count NACH Inkrement
  blocked: boolean;     // true, wenn Limit erreicht/überschritten
  cookie: string;       // Set-Cookie Wert (ohne "Set-Cookie:"-Headernamen)
};

const COOKIE_NAME = "fg";

function hmac(secret: string, payload: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function parseCookieHeader(header: string | null): Record<string, string> {
  const map: Record<string, string> = {};
  if (!header) return map;
  header.split(";").forEach((part) => {
    const [k, ...rest] = part.trim().split("=");
    if (!k) return;
    map[k] = rest.join("=");
  });
  return map;
}

/**
 * Format: value = "<count>:<sig>"
 * sig = HMAC(secret, `${count}|${uaHash}|${day}`)
 * - uaHash bindet grob an User-Agent
 * - day = YYYYMMDD (Daily-scope verhindert ewig wachsende Zähler)
 */
export function verifyAndBumpFreegate(opts: {
  cookieHeader: string | null;
  userAgent: string;
  freeLimit: number;      // z. B. 9
  secret: string;         // FREEGATE_SECRET
}): VerifyResult {
  const { cookieHeader, userAgent, freeLimit, secret } = opts;
  const cookies = parseCookieHeader(cookieHeader);
  const raw = cookies[COOKIE_NAME];

  const day = new Date();
  const yyyymmdd = `${day.getUTCFullYear()}${String(day.getUTCMonth()+1).padStart(2,"0")}${String(day.getUTCDate()).padStart(2,"0")}`;
  const uaHash = crypto.createHash("sha1").update(userAgent || "").digest("hex").slice(0, 16);

  let count = 0;
  if (raw) {
    const [countStr, sig] = raw.split(":");
    const n = Number(countStr);
    if (Number.isFinite(n) && n >= 0 && sig) {
      const expect = hmac(secret, `${n}|${uaHash}|${yyyymmdd}`);
      if (crypto.timingSafeEqual(Buffer.from(expect), Buffer.from(sig))) {
        count = n;
      }
    }
  }

  // Bump count by 1 for this request
  count = Math.max(0, count) + 1;

  const newSig = hmac(secret, `${count}|${uaHash}|${yyyymmdd}`);
  const value = `${count}:${newSig}`;

  // 30 Tage Haltbarkeit; httpOnly & sameSite=Lax
  const cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${30*24*60*60}; HttpOnly; SameSite=Lax`;

  const blocked = count > freeLimit; // d.h. ab 10 bei limit=9 blocken
  return { count, blocked, cookie };
}

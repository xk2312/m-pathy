// Light-Auth core helpers (Magic-Link + Session Tokens)
// Payment v1 – stateless HMAC tokens mit klaren TTLs.

import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;          // 15 Minuten
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;   // 30 Tage
export const AUTH_COOKIE_NAME = "m_auth";

type TokenKind = "magic" | "session";

interface BaseTokenPayload {
  kind: TokenKind;
  email: string;
  iat: number;        // Issued-at (ms seit Epoch)
  nonce?: string;     // Nur für Magic-Link – schützt gegen Replay
}

export interface MagicLinkPayload extends BaseTokenPayload {
  kind: "magic";
}

export interface SessionPayload extends BaseTokenPayload {
  kind: "session";
}

// -----------------------------------------------------
// Intern: Secret, Encoding, Signatur
// -----------------------------------------------------

function getAuthSecret(): string {
  const secret =
    process.env.MAGIC_LINK_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error(
      "Missing MAGIC_LINK_SECRET/AUTH_SECRET/NEXTAUTH_SECRET for auth token signing.",
    );
  }
  return secret;
}

function encodePayload(payload: BaseTokenPayload): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json, "utf8").toString("base64url");
}

function decodePayload(encoded: string): BaseTokenPayload | null {
  try {
    const json = Buffer.from(encoded, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as BaseTokenPayload;

    if (
      !parsed ||
      typeof parsed.email !== "string" ||
      typeof parsed.iat !== "number" ||
      (parsed.kind !== "magic" && parsed.kind !== "session")
    ) {
      return null;
    }

    parsed.email = parsed.email.trim().toLowerCase();
    return parsed;
  } catch {
    return null;
  }
}

function sign(encoded: string): string {
  const secret = getAuthSecret();
  return createHmac("sha256", secret).update(encoded).digest("base64url");
}

function constantTimeEqual(a: string, b: string): boolean {
  const abuf = Buffer.from(a);
  const bbuf = Buffer.from(b);
  if (abuf.length !== bbuf.length) return false;
  try {
    return timingSafeEqual(abuf, bbuf);
  } catch {
    return false;
  }
}

function signToken(payload: BaseTokenPayload): string {
  const encoded = encodePayload(payload);
  const mac = sign(encoded);
  return `${encoded}.${mac}`;
}

function verifyToken<T extends BaseTokenPayload>(
  token: string,
  expectedKind: TokenKind,
  maxAgeMs: number,
): T | null {
  if (!token) return null;

  const [encoded, mac] = token.split(".");
  if (!encoded || !mac) return null;

  const expectedMac = sign(encoded);
  if (!constantTimeEqual(mac, expectedMac)) return null;

  const payload = decodePayload(encoded);
  if (!payload) return null;
  if (payload.kind !== expectedKind) return null;

  const age = Date.now() - payload.iat;
  if (age < 0 || age > maxAgeMs) return null;

  return payload as T;
}

// -----------------------------------------------------
// Public API – Magic-Link
// -----------------------------------------------------

export function createMagicLinkToken(email: string): string {
  const now = Date.now();
  const payload: MagicLinkPayload = {
    kind: "magic",
    email: email.trim().toLowerCase(),
    iat: now,
    nonce: randomBytes(16).toString("hex"),
  };
  return signToken(payload);
}

export function verifyMagicLinkToken(token: string): MagicLinkPayload | null {
  return verifyToken<MagicLinkPayload>(token, "magic", MAGIC_LINK_TTL_MS);
}

// -----------------------------------------------------
// Public API – Session-Token (für Cookie m_auth)
// -----------------------------------------------------

export function createSessionToken(email: string): string {
  const now = Date.now();
  const payload: SessionPayload = {
    kind: "session",
    email: email.trim().toLowerCase(),
    iat: now,
  };
  return signToken(payload);
}

export function verifySessionToken(token: string): SessionPayload | null {
  return verifyToken<SessionPayload>(token, "session", SESSION_TTL_MS);
}

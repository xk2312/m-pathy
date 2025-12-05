// lib/ledgerIds.ts

const MAX_SAFE = Number.MAX_SAFE_INTEGER; // 9_007_199_254_740_991

export function ledgerUserIdFromEmail(email: string): string {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) {
    throw new Error("ledgerUserIdFromEmail: email required");
  }

  // einfacher, stabiler Hash innerhalb des sicheren Zahlenbereichs
  let hash = 5381; // DJB2-Seed
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    hash = (hash * 33 + code) % MAX_SAFE;
  }

  if (hash <= 0) {
    hash = (hash + MAX_SAFE) % MAX_SAFE;
    if (hash === 0) hash = 1;
  }

  return String(hash);
}

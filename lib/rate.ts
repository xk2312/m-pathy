// lib/rate.ts
let running = 0;
const queue: Array<() => void> = [];
const MAX = parseInt(process.env["CHAT_CONCURRENCY"] ?? "1", 10);

export async function withGate<T>(fn: () => Promise<T>): Promise<T> {
  if (running >= MAX) await new Promise<void>(r => queue.push(r));
  running++;
  try { return await fn(); }
  finally { running--; queue.shift()?.(); }
}

export async function retryingFetch(url: string, init: RequestInit, maxRetries = 5): Promise<Response> {
  let lastErr: any;
  for (let i = 0; i <= maxRetries; i++) {
    const res = await fetch(url, init);
    if (res.status !== 429 && res.status !== 503) return res;
    const raHeader = res.headers.get("retry-after");
    const raSec = raHeader ? parseFloat(raHeader) : NaN;
    const waitMs = Math.min(60000, (isNaN(raSec) ? 1 : raSec) * 1000 + i * 800);
    await new Promise(r => setTimeout(r, waitMs));
    lastErr = new Error(`rate_limited_${res.status}`);
  }
  throw lastErr ?? new Error("rate_limited");
}

// lib/exportChat.ts
// KANONISCHER CHAT-EXPORT (JSON = Truth, CSV = Ableitung)
// MEFL: klein, deterministisch, menschenlesbar

export type ExportMeta = {
  app: "m-pathy";
  format: "chat-history";
  version: "v1";
  exported_at: string; // ISO-8601 UTC
  count: number;
};

export type ExportMessage = {
  index: number;
  role: "system" | "user" | "assistant";
  content: string;
  format: "markdown";
  timestamp?: number;
  meta?: {
    status?: string;
    tokens_used?: number;
    balance_after?: number | null;
  };
  triketon?: {
    public_key: string;
    truth_hash: string;
    timestamp: string;
    version: string;
    hash_profile?: string;
    key_profile?: string;
    anchorStatus?: string;
  };
};

export type ChatExportV1 = {
  meta: ExportMeta;
  messages: ExportMessage[];
};

// ---------- Helpers ----------

function toStringSafe(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

// ---------- Builder (JSON = Truth) ----------

export function buildChatExport(messages: any[]): ChatExportV1 {
  const out: ExportMessage[] = [];

  let idx = 1;
  for (const m of Array.isArray(messages) ? messages : []) {
    if (!m || typeof m !== "object") continue;
    const role = m.role;
    if (role !== "system" && role !== "user" && role !== "assistant") continue;

    const content = toStringSafe(m.content);
    if (!content.trim()) continue; // leere Inhalte NICHT exportieren

    const entry: ExportMessage = {
      index: idx++,
      role,
      content,
      format: "markdown",
      timestamp: typeof m.ts === "number" ? m.ts : undefined,
    };

    // optionale Meta
    if (m.meta && typeof m.meta === "object") {
      entry.meta = {
        status: m.meta.status,
        tokens_used: m.meta.tokensUsed ?? m.meta.tokens_used,
        balance_after: m.meta.balanceAfter ?? m.meta.balance_after ?? null,
      };
    }

    // optionale Triketon-Daten
    if (m.triketon && typeof m.triketon === "object") {
      entry.triketon = {
        public_key: m.triketon.publicKey ?? m.triketon.public_key,
        truth_hash: m.triketon.truthHash ?? m.triketon.truth_hash,
        timestamp: m.triketon.timestamp,
        version: m.triketon.version ?? "v1",
        hash_profile: m.triketon.hashProfile ?? m.triketon.hash_profile,
        key_profile: m.triketon.keyProfile ?? m.triketon.key_profile,
        anchorStatus: m.triketon.anchorStatus,
      };
    }

    out.push(entry);
  }

  return {
    meta: {
      app: "m-pathy",
      format: "chat-history",
      version: "v1",
      exported_at: nowIso(),
      count: out.length,
    },
    messages: out,
  };
}

// ---------- CSV (Ableitung aus JSON) ----------

function escapeCSV(v: unknown): string {
  const s = toStringSafe(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function chatExportToCSV(exp: ChatExportV1): string {
  const header = [
    "index",
    "role",
    "content",
    "format",
    "timestamp",
    "status",
    "tokens_used",
    "balance_after",
    "triketon_public_key",
    "triketon_truth_hash",
    "triketon_timestamp",
  ];

  const rows = exp.messages.map((m) => [
    m.index,
    m.role,
    m.content,
    m.format,
    m.timestamp ?? "",
    m.meta?.status ?? "",
    m.meta?.tokens_used ?? "",
    m.meta?.balance_after ?? "",
    m.triketon?.public_key ?? "",
    m.triketon?.truth_hash ?? "",
    m.triketon?.timestamp ?? "",
  ]);

  return [
    header.join(","),
    ...rows.map((r) => r.map(escapeCSV).join(",")),
  ].join("\n");
}

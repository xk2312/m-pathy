import { NextResponse } from "next/server";
import { findTriketonAnchor } from "@/lib/triketonDb";
import { createHash } from "crypto";

type BulkVerifyItem = {
  text: string;
};

type BulkVerifyRequest = {
  publicKey: string;
  items: BulkVerifyItem[];
};

type BulkVerifyResult = {
  index: number;
  result: "TRUE" | "FALSE";
};

function isNonEmptyString(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

// 🔒 MUST match DB + single-verify normalization exactly
function normalizeForVerify(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BulkVerifyRequest>;

    const publicKey = body.publicKey;
    const items = body.items;

    if (!isNonEmptyString(publicKey) || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    // Hard limits (DoS / misuse guard)
    if (items.length === 0 || items.length > 100) {
      return NextResponse.json(
        { error: "Invalid batch size." },
        { status: 400 }
      );
    }

    const results: BulkVerifyResult[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item || !isNonEmptyString(item.text)) {
        results.push({ index: i, result: "FALSE" });
        continue;
      }

      if (item.text.length > 200_000) {
        results.push({ index: i, result: "FALSE" });
        continue;
      }

      const normalized = normalizeForVerify(item.text);
      const serverTruthHash = createHash("sha256")
        .update(normalized, "utf8")
        .digest("hex");

      const anchorExists = await findTriketonAnchor(publicKey, serverTruthHash);

      results.push({
        index: i,
        result: anchorExists ? "TRUE" : "FALSE",
      });
    }

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Bulk verification failed." },
      { status: 500 }
    );
  }
}

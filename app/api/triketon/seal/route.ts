/* app/api/triketon/seal/route.ts */
import { NextResponse } from "next/server";
import { insertTriketonAnchor } from "@/lib/triketonDb";
import { createHash } from "crypto";

type SealRequest = {
  intent: "seal";
  publicKey: string;
  text: string;

  // decoys / noise (explicitly tolerated, ignored)
  truthHash?: unknown;
  truthHash1?: unknown;
  truthHash2?: unknown;
  [key: string]: unknown;
};

type SealResponse = {
  result: "SEALED" | "IGNORED" | "ERROR";
  message: string;
};

function isNonEmptyString(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

// 🔒 canonical normalization (WRITE must match READ)
function normalizeForSeal(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SealRequest>;

    const intent = body.intent;
    const publicKey = body.publicKey;
    const text = body.text;

    // 🔒 intent guard
    if (intent !== "seal") {
      return NextResponse.json(
        { result: "ERROR", message: "Invalid intent." } satisfies SealResponse,
        { status: 400 },
      );
    }

    // 🔒 minimal input guard (ONLY what matters)
    if (!isNonEmptyString(publicKey) || !isNonEmptyString(text)) {
      return NextResponse.json(
        { result: "ERROR", message: "Invalid request." } satisfies SealResponse,
        { status: 400 },
      );
    }

    // 🔒 payload size guard (DoS safety)
    if (text.length > 200_000) {
      return NextResponse.json(
        { result: "ERROR", message: "Payload too large." } satisfies SealResponse,
        { status: 413 },
      );
    }

    // 🔒 server-authoritative truth hash
    const normalized = normalizeForSeal(text);
    const serverTruthHash = createHash("sha256")
      .update(normalized, "utf8")
      .digest("hex");

    // 🔒 append-only, idempotent insert
    const inserted = await insertTriketonAnchor(publicKey, serverTruthHash);

    const resp: SealResponse = inserted
      ? { result: "SEALED", message: "Anchor sealed successfully." }
      : { result: "IGNORED", message: "Anchor already exists." };

    // 🔒 never return hash
    return NextResponse.json(resp);
  } catch {
    return NextResponse.json(
      { result: "ERROR", message: "Seal failed." } satisfies SealResponse,
      { status: 500 },
    );
  }
}

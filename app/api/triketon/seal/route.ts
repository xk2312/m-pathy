/* app/api/triketon/seal/route.ts */
import { NextResponse } from "next/server";
import { insertTriketonAnchor } from "@/lib/triketonDb";

type SealRequest = {
  intent: "seal";
  publicKey: string;
  truthHash: string;
};

type SealResponse = {
  result: "SEALED" | "IGNORED" | "ERROR";
  message: string;
};

function isNonEmptyString(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SealRequest>;

    const intent = body.intent;
    const publicKey = body.publicKey;
    const truthHash = body.truthHash;

    // 🔒 intent guard
    if (intent !== "seal") {
      return NextResponse.json(
        { result: "ERROR", message: "Invalid intent." } satisfies SealResponse,
        { status: 400 },
      );
    }

    // 🔒 input guard
    if (!isNonEmptyString(publicKey) || !isNonEmptyString(truthHash)) {
      return NextResponse.json(
        { result: "ERROR", message: "Invalid request." } satisfies SealResponse,
        { status: 400 },
      );
    }

    // 🔒 append-only, idempotent insert
    const inserted = await insertTriketonAnchor(publicKey, truthHash);

    const resp: SealResponse = inserted
      ? { result: "SEALED", message: "Anchor sealed successfully." }
      : { result: "IGNORED", message: "Anchor already exists." };

    return NextResponse.json(resp);
  } catch {
    return NextResponse.json(
      { result: "ERROR", message: "Seal failed." } satisfies SealResponse,
      { status: 500 },
    );
  }
}

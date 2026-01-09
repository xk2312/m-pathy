import { NextResponse } from "next/server";
import { findTriketonAnchor } from "@/lib/triketonDb";
import { createHash } from "crypto";


type VerifyRequest = {
  publicKey: string;
  truthHash: string;
  text: string;
};

type VerifyResponse = {
  result: "TRUE" | "FALSE";
  message: string;
};

function isNonEmptyString(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

// 🔒 VERIFY NORMALIZATION (must match DB pipeline exactly)
function normalizeForVerify(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
}


export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<VerifyRequest>;

    const publicKey = body.publicKey;
    const truthHash = body.truthHash;
    const text = body.text;

    if (!isNonEmptyString(publicKey) || !isNonEmptyString(truthHash) || !isNonEmptyString(text)) {
      return NextResponse.json(
        { result: "FALSE", message: "Invalid request." } satisfies VerifyResponse,
        { status: 400 }
      );
    }

    // Guard: kein riesiger Payload (kein Text speichern, nicht loggen)
    if (text.length > 200_000) {
      return NextResponse.json(
        { result: "FALSE", message: "Payload too large." } satisfies VerifyResponse,
        { status: 413 }
      );
    }

    // 1) Server-TruthHash neu berechnen (identisch zur DB-Logik)
    const normalized = normalizeForVerify(text);
    const serverTruthHash = createHash("sha256")
      .update(normalized, "utf8")
      .digest("hex");

    // 2) Anchor muss exakt existieren (PublicKey-scoped)
    const anchorExists = await findTriketonAnchor(publicKey, serverTruthHash);

    const ok = anchorExists;


    const resp: VerifyResponse = ok
      ? { result: "TRUE", message: "Your content is authentic and unmodified." }
      : { result: "FALSE", message: "This content does not match the original hash anchor." };

    return NextResponse.json(resp);
  } catch {
    return NextResponse.json(
      { result: "FALSE", message: "Verification failed." } satisfies VerifyResponse,
      { status: 500 }
    );
  }
}

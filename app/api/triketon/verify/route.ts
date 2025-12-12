import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { findTriketonAnchor } from "@/lib/triketonDb";

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

async function sealWithTriketon(text: string): Promise<{ truth_hash: string; public_key?: string }> {
  return await new Promise((resolve, reject) => {
    const proc = spawn("python3", ["-m", "triketon.triketon2048", "seal", text, "--json"], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let out = "";
    let err = "";

    proc.stdout.on("data", (c) => (out += c.toString("utf-8")));
    proc.stderr.on("data", (c) => (err += c.toString("utf-8")));

    proc.on("close", (code) => {
      if (code !== 0) return reject(new Error(err || "triketon seal failed"));
      try {
        const parsed = JSON.parse(out) as { truth_hash?: unknown; public_key?: unknown };
        if (!isNonEmptyString(parsed.truth_hash)) return reject(new Error("triketon: truth_hash missing"));
        resolve({ truth_hash: parsed.truth_hash, public_key: isNonEmptyString(parsed.public_key) ? parsed.public_key : undefined });
      } catch (e) {
        reject(e);
      }
    });
  });
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

    // 1) TruthHash serverseitig neu rechnen (via Python Core)
    const recomputed = await sealWithTriketon(text);
    const hashMatches = recomputed.truth_hash === truthHash;

    // 2) Anchor in DB muss existieren
    const anchorExists = await findTriketonAnchor(publicKey, truthHash);

    const ok = hashMatches && anchorExists;

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

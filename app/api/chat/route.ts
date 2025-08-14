import { NextRequest, NextResponse } from "next/server";

/** Optional: auf Edge-Runtime laufen lassen (schneller, weniger cold starts) */
// export const runtime = "edge";

type Role = "system" | "user" | "assistant";
interface ChatMessage { role: Role; content: string }
interface ChatBody {
  messages: ChatMessage[];
  temperature?: number;
}

/** Env mit Fallback: API_KEY oder KEY */
const endpoint   = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const apiKey     = process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_OPENAI_KEY ?? "";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? "";
const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? "";

function assertEnv() {
  const missing: string[] = [];
  if (!endpoint)   missing.push("AZURE_OPENAI_ENDPOINT");
  if (!apiKey)     missing.push("AZURE_OPENAI_API_KEY|AZURE_OPENAI_KEY");
  if (!deployment) missing.push("AZURE_OPENAI_DEPLOYMENT");
  if (!apiVersion) missing.push("AZURE_OPENAI_API_VERSION");
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

export async function POST(req: NextRequest) {
  try {
    assertEnv();

    const body = (await req.json()) as ChatBody;

    if (!Array.isArray(body?.messages)) {
      return NextResponse.json(
        { error: "`messages` must be an array of { role, content }" },
        { status: 400 }
      );
    }

    const temperature = typeof body.temperature === "number" ? body.temperature : 0.7;

    const url =
      `${endpoint.replace(/\/+$/, "")}/openai/deployments/${deployment}` +
      `/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: body.messages,
        temperature,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("[AzureOpenAI Error]", response.status, errorText);
      return NextResponse.json({ error: errorText || "Upstream error" }, { status: response.status });
    }

    const data: any = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[AzureOpenAI] No content in response", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: "Azure OpenAI returned no message content" },
        { status: 502 }
      );
    }

    return NextResponse.json({ role: "assistant", content });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[API Error]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

const endpoint   = process.env.AZURE_OPENAI_ENDPOINT!;
const apiKey     = process.env.AZURE_OPENAI_API_KEY!;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION!;

type Role = "system" | "user" | "assistant";
interface ChatMessage { role: Role; content: string }

function assertEnv() {
  const missing = [];
  if (!endpoint) missing.push("AZURE_OPENAI_ENDPOINT");
  if (!apiKey) missing.push("AZURE_OPENAI_API_KEY");
  if (!deployment) missing.push("AZURE_OPENAI_DEPLOYMENT");
  if (!apiVersion) missing.push("AZURE_OPENAI_API_VERSION");
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

export async function POST(req: NextRequest) {
  try {
    assertEnv();

    const { messages, temperature = 0.7 } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "`messages` must be an array of chat messages" },
        { status: 400 }
      );
    }

    const url = `${endpoint.replace(/\/+$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[AzureOpenAI Error]", response.status, errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[AzureOpenAI] No content in response", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: "Azure OpenAI returned no message content" },
        { status: 502 }
      );
    }

    return NextResponse.json({ role: "assistant", content });
  } catch (err: any) {
    console.error("[API Error]", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

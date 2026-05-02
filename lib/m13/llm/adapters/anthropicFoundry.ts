import Anthropic from "@anthropic-ai/sdk";
import type {
  M13LlmAdapter,
  M13LlmRequest,
  M13LlmResponse,
  M13LlmRuntimeConfig,
  M13LlmUsage,
} from "../types";

function extractText(content: unknown): string {
  if (!Array.isArray(content)) return "";

  return content
    .map((part) => {
      if (
        part &&
        typeof part === "object" &&
        "type" in part &&
        (part as { type?: unknown }).type === "text" &&
        "text" in part &&
        typeof (part as { text?: unknown }).text === "string"
      ) {
        return (part as { text: string }).text;
      }

      return "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

function normalizeUsage(usage: any): M13LlmUsage {
  const inputTokens = Number(usage?.input_tokens ?? 0);
  const outputTokens = Number(usage?.output_tokens ?? 0);
  const cacheCreationInputTokens = Number(
    usage?.cache_creation_input_tokens ??
      usage?.cache_creation?.ephemeral_5m_input_tokens ??
      0
  );
  const cachedInputTokens = Number(usage?.cache_read_input_tokens ?? 0);

  const totalTokens =
    inputTokens +
    outputTokens +
    cacheCreationInputTokens +
    cachedInputTokens;

  return {
    inputTokens,
    outputTokens,
    cachedInputTokens,
    cacheCreationInputTokens,
    totalTokens,
    billableTokens: inputTokens + outputTokens + cacheCreationInputTokens,
  };
}

export const anthropicFoundryAdapter: M13LlmAdapter = {
  id: "anthropic_foundry",

  async call(
    config: M13LlmRuntimeConfig,
    request: M13LlmRequest
  ): Promise<M13LlmResponse> {
    const client = new Anthropic({
      apiKey: config.apiKey,
      baseURL: config.endpoint,
    });

    const systemMessages = [
      request.system,
      ...request.messages
        .filter((message) => message.role === "system")
        .map((message) => message.content),
    ]
      .filter(Boolean)
      .join("\n\n")
      .trim();

    const messages = request.messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role === "assistant" ? "assistant" as const : "user" as const,
        content: message.content,
      }));

    const response = await client.messages.create({
      model: config.deployment,
      max_tokens: request.maxTokens ?? config.maxTokens,
      temperature: request.temperature ?? config.temperature,
      ...(systemMessages ? { system: systemMessages } : {}),
      messages,
    });

    return {
      status: "ok",
      adapter: "anthropic_foundry",
      command: config.command,
      model: response.model ?? config.deployment,
      content: extractText(response.content),
      usage: normalizeUsage(response.usage),
      raw: response,
      stopReason: response.stop_reason ?? undefined,
    };
  },
};
import type {
  M13LlmAdapter,
  M13LlmRequest,
  M13LlmResponse,
  M13LlmRuntimeConfig,
  M13LlmUsage,
} from "../types";

function buildAzureOpenAIUrl(config: M13LlmRuntimeConfig): string {
  const endpoint = config.endpoint.trim().replace(/\/+$/, "");
  const apiVersion = config.apiVersion;

  if (!apiVersion) {
    throw new Error("Azure OpenAI API version missing");
  }

  if (/\/openai\/deployments\/[^/]+$/i.test(endpoint)) {
    return `${endpoint}/chat/completions?api-version=${apiVersion}`;
  }

  if (/\/openai$/i.test(endpoint)) {
    return `${endpoint}/deployments/${config.deployment}/chat/completions?api-version=${apiVersion}`;
  }

  return `${endpoint}/openai/deployments/${config.deployment}/chat/completions?api-version=${apiVersion}`;
}

function normalizeUsage(usage: any): M13LlmUsage {
  const promptTokens = Number(usage?.prompt_tokens ?? 0);
  const completionTokens = Number(usage?.completion_tokens ?? 0);
  const cachedInputTokens = Number(
    usage?.prompt_tokens_details?.cached_tokens ?? 0
  );

  const inputTokens = Math.max(0, promptTokens - cachedInputTokens);
  const outputTokens = completionTokens;
  const cacheCreationInputTokens = 0;
  const totalTokens = promptTokens + completionTokens;

  return {
    inputTokens,
    outputTokens,
    cachedInputTokens,
    cacheCreationInputTokens,
    totalTokens,
    billableTokens: inputTokens + outputTokens,
  };
}

export const azureOpenAIChatAdapter: M13LlmAdapter = {
  id: "azure_openai_chat",

  async call(
    config: M13LlmRuntimeConfig,
    request: M13LlmRequest
  ): Promise<M13LlmResponse> {
    const messages = [
      ...(request.system
        ? [{ role: "system" as const, content: request.system }]
        : []),
      ...request.messages,
    ];

    const response = await fetch(buildAzureOpenAIUrl(config), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature: request.temperature ?? config.temperature,
        max_tokens: request.maxTokens ?? config.maxTokens,
      }),
    });

    const raw = await response.json();

    if (!response.ok) {
      throw new Error(
        `Azure OpenAI call failed: ${response.status} ${JSON.stringify(raw)}`
      );
    }

    const content = String(raw?.choices?.[0]?.message?.content ?? "").trim();

    return {
      status: "ok",
      adapter: "azure_openai_chat",
      command: config.command,
      model: raw?.model ?? config.deployment,
      content,
      usage: normalizeUsage(raw?.usage),
      raw,
      stopReason: raw?.choices?.[0]?.finish_reason ?? undefined,
    };
  },
};
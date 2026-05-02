export type M13LlmCommand =
  | "reasoning"
  | "challenge"
  | "summary"
  | "fast";

export type M13LlmAdapterId =
  | "anthropic_foundry"
  | "azure_openai_chat";

export type M13LlmStatus =
  | "ok"
  | "error";

export interface M13LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface M13LlmRuntimeConfig {
  command: M13LlmCommand;
  adapter: M13LlmAdapterId;
  endpoint: string;
  apiKey: string;
  deployment: string;
  apiVersion?: string;
  maxTokens: number;
  temperature: number;
}

export interface M13LlmRequest {
  command: M13LlmCommand;
  system?: string;
  messages: M13LlmMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface M13LlmUsage {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
  cacheCreationInputTokens: number;
  totalTokens: number;
  billableTokens: number;
}

export interface M13LlmResponse {
  status: M13LlmStatus;
  adapter: M13LlmAdapterId;
  command: M13LlmCommand;
  model: string;
  content: string;
  usage: M13LlmUsage;
  raw: unknown;
  stopReason?: string;
}

export interface M13LlmAdapter {
  id: M13LlmAdapterId;
  call(
    config: M13LlmRuntimeConfig,
    request: M13LlmRequest
  ): Promise<M13LlmResponse>;
}
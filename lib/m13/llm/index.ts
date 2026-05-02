import { anthropicFoundryAdapter } from "./adapters/anthropicFoundry";
import { azureOpenAIChatAdapter } from "./adapters/azureOpenAIChat";
import { getM13LlmRuntimeConfig } from "./registry";
import type {
  M13LlmAdapter,
  M13LlmRequest,
  M13LlmResponse,
} from "./types";

const adapters: Record<string, M13LlmAdapter> = {
  anthropic_foundry: anthropicFoundryAdapter,
  azure_openai_chat: azureOpenAIChatAdapter,
};

export async function callM13Llm(
  request: M13LlmRequest
): Promise<M13LlmResponse> {
  const config = getM13LlmRuntimeConfig(request.command);
  const adapter = adapters[config.adapter];

  if (!adapter) {
    throw new Error(`No adapter registered for: ${config.adapter}`);
  }

  return adapter.call(config, request);
}

export type {
  M13LlmAdapter,
  M13LlmAdapterId,
  M13LlmCommand,
  M13LlmMessage,
  M13LlmRequest,
  M13LlmResponse,
  M13LlmRuntimeConfig,
  M13LlmStatus,
  M13LlmUsage,
} from "./types";
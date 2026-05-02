import type {
  M13LlmCommand,
  M13LlmRuntimeConfig,
} from "./types";

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required ENV: ${name}`);
  }

  return value.trim();
}

function readNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function readFloatEnv(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
}

export function getM13LlmRuntimeConfig(
  command: M13LlmCommand
): M13LlmRuntimeConfig {
  if (process.env.M13_LLM_ENABLED !== "true") {
    throw new Error("M13 LLM Gateway is disabled");
  }

  if (command === "reasoning") {
    return {
      command,
      adapter: "anthropic_foundry",
      endpoint: readRequiredEnv("M13_CLAUDE_SONNET_4_6_ENDPOINT"),
      apiKey: readRequiredEnv("M13_CLAUDE_SONNET_4_6_API_KEY"),
      deployment: readRequiredEnv("M13_CLAUDE_SONNET_4_6_DEPLOYMENT"),
      maxTokens: readNumberEnv("M13_REASONING_MAX_TOKENS", 1200),
      temperature: readFloatEnv("M13_REASONING_TEMPERATURE", 0.2),
    };
  }

  if (command === "challenge") {
    return {
      command,
      adapter: "anthropic_foundry",
      endpoint: readRequiredEnv("M13_CLAUDE_OPUS_4_6_ENDPOINT"),
      apiKey: readRequiredEnv("M13_CLAUDE_OPUS_4_6_API_KEY"),
      deployment: readRequiredEnv("M13_CLAUDE_OPUS_4_6_DEPLOYMENT"),
      maxTokens: readNumberEnv("M13_CHALLENGE_MAX_TOKENS", 1500),
      temperature: readFloatEnv("M13_CHALLENGE_TEMPERATURE", 0.2),
    };
  }

  if (command === "summary") {
    return {
      command,
      adapter: "azure_openai_chat",
      endpoint:
        process.env.M13_GPT_4_1_MINI_ENDPOINT?.trim() ||
        readRequiredEnv("AZURE_OPENAI_ENDPOINT"),
      apiKey:
        process.env.M13_GPT_4_1_MINI_API_KEY?.trim() ||
        readRequiredEnv("AZURE_OPENAI_API_KEY"),
      deployment:
        process.env.M13_GPT_4_1_MINI_DEPLOYMENT?.trim() ||
        readRequiredEnv("AZURE_OPENAI_DEPLOYMENT"),
      apiVersion:
        process.env.M13_GPT_4_1_MINI_API_VERSION?.trim() ||
        readRequiredEnv("AZURE_OPENAI_API_VERSION"),
      maxTokens: readNumberEnv("M13_SUMMARY_MAX_TOKENS", 1500),
      temperature: readFloatEnv("M13_SUMMARY_TEMPERATURE", 0.2),
    };
  }

  if (command === "fast") {
    return {
      command,
      adapter: "anthropic_foundry",
      endpoint: readRequiredEnv("M13_CLAUDE_HAIKU_4_5_ENDPOINT"),
      apiKey: readRequiredEnv("M13_CLAUDE_HAIKU_4_5_API_KEY"),
      deployment: readRequiredEnv("M13_CLAUDE_HAIKU_4_5_DEPLOYMENT"),
      maxTokens: readNumberEnv("M13_FAST_MAX_TOKENS", 500),
      temperature: readFloatEnv("M13_FAST_TEMPERATURE", 0.2),
    };
  }

  throw new Error(`M13 LLM command is not active yet: ${command}`);
}
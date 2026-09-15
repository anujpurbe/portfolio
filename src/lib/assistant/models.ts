const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai";
const DEFAULT_MODEL = "gemini-3.6-flash";
const DEFAULT_TIMEOUT_MS = 15000;

export type AIConfig = {
  baseURL: string;
  apiKey: string;
  model: string;
  timeoutMs: number;
};

// Server-side only. AI_BASE_URL / AI_MODEL / AI_TIMEOUT_MS override the
// defaults; AI_API_KEY is required for the AI tier to activate. The key is
// never exposed to the browser.
export function getAIConfig(): AIConfig {
  return {
    apiKey: process.env.AI_API_KEY ?? "",
    baseURL: (process.env.AI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, ""),
    model: process.env.AI_MODEL ?? DEFAULT_MODEL,
    timeoutMs:
      Number.parseInt(process.env.AI_TIMEOUT_MS ?? "", 10) || DEFAULT_TIMEOUT_MS,
  };
}

export function isAIConfigured(): boolean {
  return getAIConfig().apiKey.length > 0;
}
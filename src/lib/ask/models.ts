export type ModelProvider = {
  name: string;
  baseURL: string;
  apiKey: string;
  model: string;
  timeoutMs: number;
};

const geminiProvider: ModelProvider = {
  name: "gemini",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  apiKey: process.env.AI_API_KEY ?? "",
  model: "gemini-3.6-flash",
  timeoutMs: 30000,
};

export function getDefaultProvider(): ModelProvider {
  return geminiProvider;
}

export function isProviderConfigured(): boolean {
  return Boolean(geminiProvider.apiKey);
}

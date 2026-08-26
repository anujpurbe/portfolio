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
  timeoutMs: 45000,
};

const grokProvider: ModelProvider | null = process.env.GROK_API_KEY
  ? {
      name: "grok",
      baseURL: (process.env.GROK_BASE_URL ?? "https://api.x.ai/v1").replace(/\/$/, ""),
      apiKey: process.env.GROK_API_KEY,
      model: process.env.GROK_MODEL ?? "grok-2",
      timeoutMs: Number(process.env.AI_TIMEOUT_MS ?? 30000),
    }
  : null;

const providers = new Map<string, ModelProvider>();
providers.set("gemini", geminiProvider);
if (grokProvider) providers.set("grok", grokProvider);

export function getProvider(name: string): ModelProvider | undefined {
  return providers.get(name);
}

export function getDefaultProvider(): ModelProvider {
  return geminiProvider;
}

export function listProviders(): ModelProvider[] {
  return Array.from(providers.values());
}

export function isProviderConfigured(name: string): boolean {
  const p = providers.get(name);
  return Boolean(p?.apiKey);
}

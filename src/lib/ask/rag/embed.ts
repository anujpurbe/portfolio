const API_KEY = process.env.AI_API_KEY;
const BASE_URL = (
  process.env.AI_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta/openai"
).replace(/\/$/, "");

const EMBEDDING_MODEL = "text-embedding-004";

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!API_KEY || texts.length === 0) return [];

  try {
    const res = await fetch(`${BASE_URL}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: texts,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      console.error(`[rag] Embedding failed: HTTP ${res.status}`);
      return [];
    }

    const json = (await res.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };

    if (!json.data || !Array.isArray(json.data)) return [];

    return json.data.map((item) => item.embedding ?? []);
  } catch (error) {
    console.error("[rag] Embedding error:", (error as Error)?.message);
    return [];
  }
}

export async function embedText(text: string): Promise<number[] | null> {
  const results = await embedTexts([text]);
  return results[0] ?? null;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

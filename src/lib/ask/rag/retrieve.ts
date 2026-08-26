import type { RAGSearchResult } from "./types";
import { vectorStore } from "./store";
import { embedText } from "./embed";

export async function retrieve(
  query: string,
  topK = 3,
  minScore = 0.3,
): Promise<RAGSearchResult[]> {
  if (!vectorStore.isInitialized()) return [];

  const queryEmbedding = await embedText(query);
  if (!queryEmbedding) return [];

  return vectorStore.search(queryEmbedding, topK, minScore);
}

export function formatRAGContext(results: RAGSearchResult[]): string {
  if (results.length === 0) return "";

  const lines = results.map((r, i) => {
    const meta = r.chunk.metadata;
    const source = meta.title ?? meta.source;
    return `[${i + 1}] (${source}, relevance: ${Math.round(r.score * 100)}%)\n${r.chunk.content}`;
  });

  return `ADDITIONAL CONTEXT (retrieved from portfolio documents):\n\n${lines.join("\n\n---\n\n")}`;
}

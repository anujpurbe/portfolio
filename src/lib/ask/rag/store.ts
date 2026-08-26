import type { RAGChunk, RAGSearchResult } from "./types";
import { cosineSimilarity } from "./embed";

type StoreEntry = {
  chunk: RAGChunk;
  embedding: number[];
};

class VectorStore {
  private entries: StoreEntry[] = [];
  private initialized = false;

  isInitialized(): boolean {
    return this.initialized;
  }

  add(chunk: RAGChunk, embedding: number[]): void {
    this.entries.push({ chunk, embedding });
    this.initialized = true;
  }

  search(queryEmbedding: number[], topK: number, minScore: number): RAGSearchResult[] {
    if (this.entries.length === 0) return [];

    const scored = this.entries
      .map((entry) => ({
        chunk: entry.chunk,
        score: cosineSimilarity(queryEmbedding, entry.embedding),
      }))
      .filter((r) => r.score >= minScore)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  }

  size(): number {
    return this.entries.length;
  }

  clear(): void {
    this.entries = [];
    this.initialized = false;
  }
}

export const vectorStore = new VectorStore();

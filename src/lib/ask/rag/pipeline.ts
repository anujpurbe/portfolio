import { loadAllDocuments } from "./loader";
import { chunkAllDocuments } from "./chunker";
import { embedTexts } from "./embed";
import { vectorStore } from "./store";
import { retrieve, formatRAGContext } from "./retrieve";

let initPromise: Promise<void> | null = null;

async function initializeStore(): Promise<void> {
  if (vectorStore.isInitialized()) return;

  console.log("[rag] Loading documents...");
  const docs = await loadAllDocuments();
  console.log(`[rag] Loaded ${docs.length} documents`);

  const chunks = chunkAllDocuments(docs);
  console.log(`[rag] Created ${chunks.length} chunks`);

  if (chunks.length === 0) return;

  const batchSize = 20;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const texts = batch.map((c) => c.content);
    const embeddings = await embedTexts(texts);

    for (let j = 0; j < batch.length; j++) {
      if (embeddings[j] && embeddings[j].length > 0) {
        vectorStore.add(batch[j], embeddings[j]);
      }
    }
  }

  console.log(`[rag] Vector store ready with ${vectorStore.size()} entries`);
}

async function ensureInitialized(): Promise<void> {
  if (vectorStore.isInitialized()) return;
  if (!initPromise) {
    initPromise = initializeStore().catch((err) => {
      console.error("[rag] Init failed:", err);
      initPromise = null;
    });
  }
  await initPromise;
}

export async function buildRAGContext(query: string): Promise<string> {
  await ensureInitialized();
  if (!vectorStore.isInitialized()) return "";

  const results = await retrieve(query);
  return formatRAGContext(results);
}

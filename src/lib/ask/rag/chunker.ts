import type { RAGDocument, RAGChunk } from "./types";

const DEFAULT_CHUNK_SIZE = 500;
const DEFAULT_CHUNK_OVERLAP = 50;

function splitIntoChunks(
  text: string,
  chunkSize: number,
  chunkOverlap: number,
): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = "";

  for (const para of paragraphs) {
    if (para.trim().length === 0) continue;

    if (currentChunk.length + para.length + 2 > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.ceil(chunkOverlap / 6));
      currentChunk = overlapWords.join(" ") + "\n\n" + para;
    } else {
      currentChunk = currentChunk ? currentChunk + "\n\n" + para : para;
    }

    if (currentChunk.length > chunkSize * 1.5) {
      const mid = Math.floor(currentChunk.length / 2);
      const breakPoint = currentChunk.lastIndexOf("\n", mid) || currentChunk.indexOf(" ", mid);
      if (breakPoint > 0) {
        chunks.push(currentChunk.slice(0, breakPoint).trim());
        currentChunk = currentChunk.slice(breakPoint).trim();
      }
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((c) => c.length > 20);
}

export function chunkDocument(
  doc: RAGDocument,
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkOverlap = DEFAULT_CHUNK_OVERLAP,
): RAGChunk[] {
  const texts = splitIntoChunks(doc.content, chunkSize, chunkOverlap);
  return texts.map((content, i) => ({
    id: `${doc.id}::chunk-${i}`,
    documentId: doc.id,
    content,
    metadata: doc.metadata,
  }));
}

export function chunkAllDocuments(
  docs: RAGDocument[],
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkOverlap = DEFAULT_CHUNK_OVERLAP,
): RAGChunk[] {
  return docs.flatMap((doc) => chunkDocument(doc, chunkSize, chunkOverlap));
}

export type RAGDocument = {
  id: string;
  content: string;
  metadata: {
    source: string;
    type: "resume" | "project" | "journal" | "portfolio";
    title?: string;
    slug?: string;
  };
};

export type RAGChunk = {
  id: string;
  documentId: string;
  content: string;
  metadata: RAGDocument["metadata"];
};

export type RAGSearchResult = {
  chunk: RAGChunk;
  score: number;
};

export type RAGConfig = {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  minScore: number;
};

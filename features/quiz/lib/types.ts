import z from "zod";
import { createQuizSchema } from "./schemas";

export type CreateQuizSchemaType = z.infer<ReturnType<typeof createQuizSchema>>;

interface BaseGenerationContext {
  difficulty: string;
  totalQuestions: number;
}

export interface GenerateSingleChunkParams extends BaseGenerationContext {
  chunk: string;
  chunkIndex?: number;
  totalChunks?: number;
  pageCount?: number;
}

export interface GenerateMultipleChunksParams extends BaseGenerationContext {
  chunks: string[];
  pageCount: number;
}

export interface BuildPromptParams
  extends Pick<
    GenerateSingleChunkParams,
    "difficulty" | "chunkIndex" | "totalChunks" | "pageCount"
  > {
  content: string;
  questionsNeeded: number;
}

export interface PDFExtractionResult {
  fullText: string;
  chunks: string[];
  pageCount: number;
  characterCount: number;
  isChunked: boolean;
}

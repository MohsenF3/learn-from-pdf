import { Tables, TablesInsert } from "@/lib/supabase/database.types";
import z from "zod";
import { QUIZ_CONFIG } from "./config";
import { createQuizSchema } from "./schemas";

export type CreateQuizSchemaType = z.infer<ReturnType<typeof createQuizSchema>>;

// DATABASE TYPES (From Supabase)
export type QuizSessionDB = Tables<"quiz_sessions">;
export type QuizSessionInsert = TablesInsert<"quiz_sessions">;

// CORE TYPES
export type QuizDifficulty = (typeof QUIZ_CONFIG.DIFFICULTIES)[number];

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
}

// PDF TYPES
export interface PDFParseResult {
  text: string;
  numpages: number;
  numrender: number;
  info: Record<string, unknown>;
  metadata: Record<string, unknown>;
  version: string;
}

export interface PDFExtractionResult {
  fullText: string;
  chunks: string[];
  pageCount: number;
  characterCount: number;
  isChunked: boolean;
  pdfName: string;
}

// AI GENERATION TYPES
interface BaseGenerationParams {
  difficulty: QuizDifficulty;
  totalQuestions: number;
}

interface ChunkMetadata {
  chunkIndex: number;
  totalChunks: number;
  pageCount: number;
}

export interface GenerateSingleChunkParams
  extends BaseGenerationParams,
    Partial<ChunkMetadata> {
  chunk: string;
}

export interface GenerateMultipleChunksParams extends BaseGenerationParams {
  chunks: string[];
  pageCount: number;
}

export interface BuildPromptParams
  extends Partial<ChunkMetadata>,
    Pick<BaseGenerationParams, "difficulty"> {
  content: string;
  questionsNeeded: number;
}

// API RESPONSE TYPES
export interface SafeQuizQuestion extends Omit<QuizQuestion, "correctAnswer"> {
  id: string;
}

export interface QuizSession {
  sessionId: string;
  questions: SafeQuizQuestion[];
  totalQuestions: number;
  pdfName: string;
  difficulty: QuizDifficulty;
}

export interface QuizResultDetail {
  questionId: string;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  results: QuizResultDetail[];
}

export interface RateLimitInfo {
  canCreate: boolean;
  remainingQuizzes: number;
  limit: number;
  isLoggedIn: boolean;
}

export type QuizAnswers = Record<string, number>;

export interface QuestionWithAnswer extends QuizQuestion {
  userAnswer: number;
  isCorrect: boolean;
}

export interface QuizQuestionWithAnswers extends QuizQuestion {
  userAnswer: number;
}

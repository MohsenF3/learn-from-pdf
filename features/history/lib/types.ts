import {
  QuizDifficulty,
  QuizQuestionWithAnswers,
} from "@/features/quiz/lib/types";

export interface QuizHistoryConfig {
  language: string;
  difficulty: QuizDifficulty;
  pdfFileName: string;
  numQuestions: number;
}

export interface QuizHistoryData {
  config: QuizHistoryConfig;
  questions: QuizQuestionWithAnswers[];
}

export interface QuizHistoryDB {
  id: string;
  user_id: string;
  quiz_data: QuizHistoryData;
  score: number;
  total_questions: number;
  difficulty: QuizDifficulty;
  created_at: string;
}

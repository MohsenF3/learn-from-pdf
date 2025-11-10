export interface QuizQuestion {
  options: string[];
  question: string;
  correctAnswer: number;
}

export const QUIZ_DIFFICULTIES = ["simple", "medium", "hard"] as const;
export type QuizDifficulties = (typeof QUIZ_DIFFICULTIES)[number];

export interface QuizConfig {
  language: string;
  difficulty: QuizDifficulties;
  pdfFileName: string;
  numQuestions: number;
}

export interface QuizData {
  config: QuizConfig;
  questions: QuizQuestion[];
  selectedAnswers: number[];
}

export type QuizHistory = {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  difficulty: QuizDifficulties;
  created_at: string;
  quiz_data: QuizData;
};

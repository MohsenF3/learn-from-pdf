import { QuizDifficulty, QuizQuestion } from "../lib/types";

interface SessionMetadata {
  sessionId: string | null;
  sessionCreatedAt: number | null;
  pdfName: string | null;
  difficulty: QuizDifficulty | null;
}

interface QuizProgress {
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  currentAnswer: number | null;
}

interface QuizResults {
  score: number | null;
  isComplete: boolean;
  hasCelebrated: boolean;
}

export interface QuizState extends SessionMetadata, QuizProgress, QuizResults {
  questions: QuizQuestion[];
  isDemo: boolean;
}

export interface QuizActions {
  setSession: (
    sessionId: string,
    pdfName: string,
    difficulty: QuizDifficulty,
    questions: QuizQuestion[]
  ) => void;
  selectAnswer: (answer: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetQuiz: () => void;
  loadTestData: () => void;
  setCelebrated: () => void;
  isSessionValid: (quizId: string) => boolean;
}

export type QuizStore = QuizState & QuizActions;

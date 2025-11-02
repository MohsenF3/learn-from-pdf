import { QuizConfig, QuizQuestion } from "@/features/history/lib/types";
import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { DEMO_QUIZ_QUESTIONS } from "../lib/config";

interface QuizState {
  questions: QuizQuestion[];
  config: QuizConfig | null;
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  currentAnswer: number | null;
  score: number | null;
  isComplete: boolean;
  hasCelebrated: boolean;
}

interface QuizActions {
  setQuestions: (questions: QuizQuestion[]) => void;
  setConfig: (config: QuizConfig) => void;
  selectAnswer: (answer: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetQuiz: () => void;
  loadTestData: () => void;
  setCelebrated: () => void;
}

type QuizStore = QuizState & QuizActions;

const initialQuizState: QuizState = {
  questions: [],
  config: null,
  currentQuestion: 0,
  selectedAnswers: [],
  currentAnswer: null,
  score: null,
  isComplete: false,
  hasCelebrated: false,
};

export const useQuizStore = create<QuizStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialQuizState,
        setQuestions: (questions) =>
          set(
            produce((draft: QuizState) => {
              draft.questions = questions;
              draft.selectedAnswers = Array(questions.length).fill(null);
              draft.currentQuestion = 0;
              draft.currentAnswer = null;
              draft.score = null;
              draft.isComplete = false;
              draft.hasCelebrated = false;
            })
          ),
        setConfig: (config) => set({ config }),
        selectAnswer: (answer) => set({ currentAnswer: answer }),
        nextQuestion: () =>
          set(
            produce((draft: QuizState) => {
              const { currentAnswer, currentQuestion, questions } = get();
              if (!questions.length) return;
              if (currentAnswer !== null)
                draft.selectedAnswers[currentQuestion] = currentAnswer;
              if (currentQuestion < questions.length - 1) {
                draft.currentQuestion += 1;
                draft.currentAnswer =
                  draft.selectedAnswers[draft.currentQuestion] ?? null;
              } else {
                draft.score = draft.selectedAnswers.filter(
                  (a, i) => a === questions[i].correctAnswer
                ).length;
                draft.isComplete = true;
                console.log("finished");
              }
            })
          ),
        previousQuestion: () =>
          set(
            produce((draft: QuizState) => {
              const { currentAnswer, currentQuestion, selectedAnswers } = get();
              if (currentQuestion === 0) return;
              if (currentAnswer !== null)
                draft.selectedAnswers[currentQuestion] = currentAnswer;
              draft.currentQuestion -= 1;
              draft.currentAnswer =
                selectedAnswers[draft.currentQuestion] ?? null;
            })
          ),
        resetQuiz: () => {
          localStorage.removeItem("quiz-storage");
          set(initialQuizState, false, "resetQuiz");
        },
        loadTestData: () =>
          set(
            produce((draft: QuizState) => {
              draft.questions = DEMO_QUIZ_QUESTIONS;
              draft.selectedAnswers = Array(DEMO_QUIZ_QUESTIONS.length).fill(
                null
              );
              draft.currentQuestion = 0;
              draft.currentAnswer = null;
              draft.score = null;
              draft.isComplete = false;
              draft.hasCelebrated = false;
            })
          ),
        setCelebrated: () => set({ hasCelebrated: true }),
      }),
      {
        name: "quiz-storage",
        partialize: (state) => ({
          questions: state.questions,
          config: state.config,
          currentQuestion: state.currentQuestion,
          selectedAnswers: state.selectedAnswers,
          currentAnswer: state.currentAnswer,
          score: state.score,
          isComplete: state.isComplete,
          hasCelebrated: state.hasCelebrated,
        }),
      }
    )
  )
);

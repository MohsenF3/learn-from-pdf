import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { DEMO_QUIZ_QUESTIONS } from "../lib/config";
import { QuizState, QuizStore } from "./type";

const SESSION_EXPIRY_HOURS = 24;

const initialQuizState: QuizState = {
  // Session metadata
  sessionId: null,
  sessionCreatedAt: null,
  pdfName: null,
  difficulty: null,

  // Quiz progress
  currentQuestion: 0,
  selectedAnswers: [],
  currentAnswer: null,

  // Quiz results
  score: null,
  isComplete: false,
  hasCelebrated: false,

  // Quiz data
  questions: [],
  isDemo: false,
};

export const useQuizStore = create<QuizStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialQuizState,

        setSession: (sessionId, pdfName, difficulty, questions) =>
          set(
            produce((draft: QuizState) => {
              draft.sessionId = sessionId;
              draft.pdfName = pdfName;
              draft.difficulty = difficulty;
              draft.sessionCreatedAt = Date.now();
              draft.questions = questions;
              draft.selectedAnswers = Array(questions.length).fill(null);
              draft.currentQuestion = 0;
              draft.currentAnswer = null;
              draft.score = null;
              draft.isComplete = false;
              draft.hasCelebrated = false;
              draft.isDemo = false;
            }),
            false,
            "setSession"
          ),

        selectAnswer: (answer) =>
          set({ currentAnswer: answer }, false, "selectAnswer"),

        nextQuestion: () =>
          set(
            produce((draft: QuizState) => {
              const { currentAnswer, currentQuestion, questions } = get();
              if (!questions.length) return;

              if (currentAnswer !== null) {
                draft.selectedAnswers[currentQuestion] = currentAnswer;
              }

              if (currentQuestion < questions.length - 1) {
                draft.currentQuestion += 1;
                draft.currentAnswer =
                  draft.selectedAnswers[draft.currentQuestion] ?? null;
              } else {
                if (draft.isDemo) {
                  draft.score = draft.selectedAnswers.filter(
                    (a, i) => a === questions[i].correctAnswer
                  ).length;
                }
                draft.isComplete = true;
              }
            }),
            false,
            "nextQuestion"
          ),

        previousQuestion: () =>
          set(
            produce((draft: QuizState) => {
              const { currentAnswer, currentQuestion, selectedAnswers } = get();
              if (currentQuestion === 0) return;

              if (currentAnswer !== null) {
                draft.selectedAnswers[currentQuestion] = currentAnswer;
              }

              draft.currentQuestion -= 1;
              draft.currentAnswer =
                selectedAnswers[draft.currentQuestion] ?? null;
            }),
            false,
            "previousQuestion"
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
              draft.sessionId = null;
              draft.pdfName = null;
              draft.sessionCreatedAt = null;
              draft.difficulty = null;
              draft.isDemo = true;
            }),
            false,
            "loadTestData"
          ),

        setCelebrated: () =>
          set({ hasCelebrated: true }, false, "setCelebrated"),

        isSessionValid: (quizId: string) => {
          const state = get();

          if (state.isDemo && quizId === "demo") {
            return true;
          }

          if (state.sessionId !== quizId) {
            return false;
          }

          if (!state.sessionCreatedAt) {
            return false;
          }

          const hoursElapsed =
            (Date.now() - state.sessionCreatedAt) / (1000 * 60 * 60);

          return hoursElapsed <= SESSION_EXPIRY_HOURS;
        },
      }),
      {
        name: "quiz-storage",
        partialize: (state) => ({
          sessionId: state.sessionId,
          sessionCreatedAt: state.sessionCreatedAt,
          pdfName: state.pdfName,
          difficulty: state.difficulty,
          currentQuestion: state.currentQuestion,
          selectedAnswers: state.selectedAnswers,
          currentAnswer: state.currentAnswer,
          score: state.score,
          isComplete: state.isComplete,
          hasCelebrated: state.hasCelebrated,
          questions: state.questions,
          isDemo: state.isDemo,
        }),
      }
    ),
    {
      name: "QuizStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

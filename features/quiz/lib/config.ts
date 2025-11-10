import { QUIZ_DIFFICULTIES, QuizQuestion } from "@/features/history/lib/types";

export const DEMO_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswer: 3,
  },
];

export const QUIZ_CONFIG = {
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024,
    ACCEPTED_TYPES: ["application/pdf"] as const,
    ACCEPTED_EXTENSIONS: [".pdf"] as const,
  },
  QUESTIONS: {
    MIN: 1,
    MAX: 15,
    DEFAULT: 5,
  },
  DIFFICULTIES: QUIZ_DIFFICULTIES,
} as const;

export const DIFFICULTY_OPTIONS = QUIZ_DIFFICULTIES.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

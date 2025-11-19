import { QuizQuestion } from "./types";

const QUESTION_BANK: QuizQuestion[] = [
  // Geography
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "Which country is home to the Great Wall?",
    options: ["Japan", "China", "Korea", "Vietnam"],
    correctAnswer: 1,
  },
  {
    question: "What is the capital of Japan?",
    options: ["Osaka", "Tokyo", "Kyoto", "Hiroshima"],
    correctAnswer: 1,
  },
  {
    question: "Which is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctAnswer: 1,
  },

  // Science
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
  },
  {
    question: "How many bones are in the human body?",
    options: ["186", "206", "226", "246"],
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

  // Math
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
  {
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
  },
  {
    question: "What is 15 × 3?",
    options: ["35", "40", "45", "50"],
    correctAnswer: 2,
  },
  {
    question: "What is 100 ÷ 4?",
    options: ["20", "25", "30", "35"],
    correctAnswer: 1,
  },

  // Literature
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
    question: "Who is the author of 'Harry Potter'?",
    options: [
      "J.K. Rowling",
      "Stephen King",
      "George R.R. Martin",
      "Suzanne Collins",
    ],
    correctAnswer: 0,
  },
  {
    question: "Who wrote '1984'?",
    options: [
      "George Orwell",
      "Aldous Huxley",
      "Ray Bradbury",
      "Kurt Vonnegut",
    ],
    correctAnswer: 0,
  },
  {
    question: "Who wrote 'Pride and Prejudice'?",
    options: [
      "Charlotte Brontë",
      "Emily Brontë",
      "Jane Austen",
      "George Eliot",
    ],
    correctAnswer: 2,
  },

  // History
  {
    question: "In what year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
  },
  {
    question: "Who was the first President of the United States?",
    options: [
      "Thomas Jefferson",
      "George Washington",
      "John Adams",
      "James Madison",
    ],
    correctAnswer: 1,
  },
  {
    question: "In what year did the Titanic sink?",
    options: ["1910", "1911", "1912", "1913"],
    correctAnswer: 2,
  },
  {
    question: "Who discovered America in 1492?",
    options: [
      "Vasco da Gama",
      "Christopher Columbus",
      "Ferdinand Magellan",
      "Bartholomeu Dias",
    ],
    correctAnswer: 1,
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomQuestions(count: number): QuizQuestion[] {
  const shuffled = shuffleArray(QUESTION_BANK);
  return shuffled.slice(0, Math.min(count, QUESTION_BANK.length));
}

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

    FREE_USER_DAILY: 3,
    LOGGED_IN_DAILY: 10,
    MAX_QUESTIONS_FREE: 5,
    MAX_QUESTIONS_LOGGED_IN: 15,
  },
  DIFFICULTIES: ["simple", "medium", "hard"] as const,
} as const;

export const DIFFICULTY_OPTIONS = QUIZ_CONFIG.DIFFICULTIES.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export const ROUTES = {
  // Public
  PUBLIC: {
    HOME: "/",
    QUIZ_CREATE: "/quiz/create",
    QUIZ_DEMO: "/quiz/demo",
    QUIZ_TAKE: (quizId: string) => `/quiz/create/${quizId}`,
    QUIZ_RESULT: "/quiz/result",
    QUIZ_REVIEW: "/quiz/review",
  },

  // Auth flow
  AUTH: {
    LOGIN: "/auth/login",
    VERIFY: "/auth/verify",
  },

  // Protected (require login)
  PROTECTED: {
    HISTORY: "/history",
  },
} as const;

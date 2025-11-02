export const ROUTES = {
  // Public
  PUBLIC: {
    HOME: "/",
    QUIZ_CREATE: "/quiz/create",
    QUIZ_DEMO: "/quiz/demo",
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

export const ROUTES = {
  // Public
  PUBLIC: {
    HOME: "/",
    UPLOAD: "/upload",
  },

  // Auth flow
  AUTH: {
    LOGIN: "/auth/login",
    VERIFY: "/auth/verify",
  },

  // Protected (require login)
  PROTECTED: {
    PROFILE: "/profile",
    HISTORY: "/history",
  },
} as const;

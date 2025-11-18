"use client";

import { useEffect } from "react";
import { useQuizStore } from "../store/quiz-store";

export function ResetQuizOnMount() {
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  // Reset store when entering the page
  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

  return null;
}

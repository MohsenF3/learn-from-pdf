"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useQuizStore } from "../store/quiz-store";

export default function StartNewQuizButton() {
  const router = useRouter();

  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const handleStartNewQuiz = () => {
    resetQuiz();
    router.push(ROUTES.PUBLIC.QUIZ_CREATE);
  };

  return (
    <Button size="lg" onClick={handleStartNewQuiz}>
      Create New Quiz
    </Button>
  );
}

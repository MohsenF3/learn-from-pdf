"use client";

import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/features/quiz/store/quiz-store";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

export default function DemoQuizButton() {
  const router = useRouter();
  const loadTestData = useQuizStore((state) => state.loadTestData);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const handleClick = () => {
    // first reset the quiz
    resetQuiz();

    // then load the test data
    loadTestData();
    router.push(ROUTES.PUBLIC.QUIZ_DEMO);
  };

  return (
    <Button
      size="lg"
      variant="outline"
      className="h-12 px-8 text-base bg-transparent"
      onClick={handleClick}
    >
      Try Demo Quiz
    </Button>
  );
}

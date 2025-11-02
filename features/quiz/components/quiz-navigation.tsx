"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useQuizStore } from "../store/quiz-store";

export default function QuizNavigation() {
  const router = useRouter();
  const { questions, currentQuestion, currentAnswer } = useQuizStore(
    useShallow((s) => ({
      questions: s.questions,
      currentQuestion: s.currentQuestion,
      currentAnswer: s.currentAnswer,
    }))
  );

  const previousQuestion = useQuizStore((s) => s.previousQuestion);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const isLastStep = currentQuestion === questions.length - 1;

  const handleNextClick = () => {
    nextQuestion();

    if (isLastStep) {
      router.replace(ROUTES.PUBLIC.QUIZ_RESULT);
    }
  };

  return (
    <div className="flex gap-3 pt-4">
      <Button
        onClick={previousQuestion}
        disabled={currentQuestion === 0}
        variant="outline"
        className="flex-1 bg-transparent"
      >
        Previous
      </Button>
      <Button
        onClick={handleNextClick}
        disabled={currentAnswer === null}
        className="flex-1"
      >
        {isLastStep ? "Finish Quiz" : "Next Question"}
      </Button>
    </div>
  );
}

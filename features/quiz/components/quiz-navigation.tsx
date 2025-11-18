"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { submitQuizAnswers } from "../actions";
import { useQuizStore } from "../store/quiz-store";

export default function QuizNavigation() {
  const [isSubmitting, startSubmitting] = useTransition();
  const router = useRouter();

  const {
    questions,
    currentQuestion,
    currentAnswer,
    sessionId,
    isDemo,
    selectedAnswers,
  } = useQuizStore(
    useShallow((s) => ({
      questions: s.questions,
      currentQuestion: s.currentQuestion,
      currentAnswer: s.currentAnswer,
      sessionId: s.sessionId,
      isDemo: s.isDemo,
      selectedAnswers: s.selectedAnswers,
    }))
  );

  const previousQuestion = useQuizStore((s) => s.previousQuestion);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  const isLastStep = currentQuestion === questions.length - 1;
  const isFirstStep = currentQuestion === 0;

  const handleNextClick = () => {
    if (!isLastStep) {
      nextQuestion();
      return;
    }

    // Last question - different behavior based on demo or server
    if (isDemo) {
      handleDemoSubmit();
    } else {
      handleServerSubmit();
    }
  };

  const handleDemoSubmit = () => {
    nextQuestion();
    router.replace(ROUTES.PUBLIC.QUIZ_RESULT);
  };

  const handleServerSubmit = () => {
    if (!sessionId) {
      toast.error("Invalid quiz session");
      router.replace(ROUTES.PUBLIC.QUIZ_CREATE);
      resetQuiz();
      return;
    }

    startSubmitting(async () => {
      // Build answers object
      const answers: Record<string, number> = {};

      // Add all previous answers
      selectedAnswers.forEach((answer, index) => {
        if (answer !== null) {
          answers[`q_${index}`] = answer;
        }
      });

      // Add current answer
      if (currentAnswer !== null) {
        answers[`q_${currentQuestion}`] = currentAnswer;
      }

      // Submit to server
      const result = await submitQuizAnswers(sessionId, answers);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const { score, results } = result.data;

      // Update store with correct answers from server
      const questionsWithAnswers = questions.map((q, index) => ({
        ...q,
        correctAnswer: results[index].correctAnswer,
      }));

      // Update store with server response
      useQuizStore.setState({
        questions: questionsWithAnswers,
        selectedAnswers: results.map((r) => r.userAnswer),
        score,
        isComplete: true,
      });

      toast.success("Quiz submitted successfully!");
      router.push(ROUTES.PUBLIC.QUIZ_RESULT);
    });
  };

  return (
    <nav className="flex gap-3 pt-4" aria-label="Quiz navigation">
      <Button
        onClick={previousQuestion}
        disabled={isFirstStep || isSubmitting}
        variant="outline"
        className="flex-1"
        aria-label="Go to previous question"
        aria-disabled={isFirstStep || isSubmitting}
      >
        Previous
      </Button>

      <Button
        onClick={handleNextClick}
        disabled={currentAnswer === null || isSubmitting}
        className="flex-1"
        aria-label={
          isLastStep ? "Submit quiz" : `Go to question ${currentQuestion + 2}`
        }
        aria-disabled={currentAnswer === null || isSubmitting}
        aria-live="polite"
      >
        {isSubmitting ? (
          <>
            <span className="sr-only">Submitting your quiz</span>
            <span aria-hidden="true">Submitting...</span>
          </>
        ) : isLastStep ? (
          "Finish Quiz"
        ) : (
          "Next Question"
        )}
      </Button>
    </nav>
  );
}

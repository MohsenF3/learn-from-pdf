"use client";

import { ROUTES } from "@/lib/routes";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useShallow } from "zustand/shallow";
import { useQuizStore } from "../store/quiz-store";

interface QuizGuardProps extends React.PropsWithChildren {
  requireQuestions?: boolean;
  requireComplete?: boolean;
  validateQuizId?: string;
  redirectTo?: string;
  loadingMessage?: string;
}

export function QuizGuard({
  requireQuestions = true,
  requireComplete = true,
  validateQuizId = "",
  redirectTo = ROUTES.PUBLIC.HOME,
  loadingMessage = "Loading...",
  children,
}: QuizGuardProps) {
  const [isValid, setIsValid] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  const router = useRouter();

  const { questions, isComplete } = useQuizStore(
    useShallow((s) => ({
      questions: s.questions,
      isComplete: s.isComplete,
    }))
  );

  const isSessionValid = useQuizStore((s) => s.isSessionValid);

  React.useEffect(() => {
    // Wait for zustand persist to hydrate
    const timer = setTimeout(() => {
      const hasQuestions = questions.length > 0;

      // Security check: Validate quiz_id if provided
      let quizIdIsValid = true;
      if (validateQuizId) {
        quizIdIsValid = isSessionValid(validateQuizId);
      }

      // Check all requirements
      const meetsRequirements =
        (!requireQuestions || hasQuestions) &&
        (!requireComplete || isComplete) &&
        quizIdIsValid;

      if (!meetsRequirements) {
        router.replace(redirectTo);
      } else {
        setIsValid(true);
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [
    questions.length,
    isComplete,
    validateQuizId,
    isSessionValid,
    requireQuestions,
    requireComplete,
    redirectTo,
    router,
  ]);

  if (isChecking || !isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

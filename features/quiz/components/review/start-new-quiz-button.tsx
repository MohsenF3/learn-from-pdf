"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useQuizStore } from "../../store/quiz-store";

interface StartNewQuizButtonProps extends ButtonProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

export default function StartNewQuizButton({
  redirectTo,
  children,
  ...props
}: StartNewQuizButtonProps) {
  const router = useRouter();

  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const handleStartNewQuiz = () => {
    resetQuiz();
    router.push(redirectTo ?? ROUTES.PUBLIC.QUIZ_CREATE);
  };

  return (
    <Button size="lg" onClick={handleStartNewQuiz} {...props}>
      {children}
    </Button>
  );
}

"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useQuizStore } from "@/features/quiz/store/quiz-store";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

interface DemoButtonProps extends ButtonProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

export default function DemoButton({
  redirectTo,
  children,
  ...props
}: DemoButtonProps) {
  const router = useRouter();
  const loadTestData = useQuizStore((state) => state.loadTestData);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const handleTryDemo = () => {
    // first reset the quiz
    resetQuiz();

    // then load the test data
    loadTestData();
    router.push(redirectTo ?? ROUTES.PUBLIC.QUIZ_DEMO);
  };

  return (
    <Button onClick={handleTryDemo} {...props}>
      {children}
    </Button>
  );
}

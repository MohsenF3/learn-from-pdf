"use client";

import { Progress } from "@/components/ui/progress";
import { useShallow } from "zustand/shallow";
import { useQuizStore } from "../store/quiz-store";

export default function QuizProgress() {
  const { questions, currentQuestion } = useQuizStore(
    useShallow((s) => ({
      questions: s.questions,
      currentQuestion: s.currentQuestion,
    }))
  );

  const progress =
    questions.length > 0
      ? Math.round((currentQuestion / questions.length) * 100)
      : 0;

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <span>{progress}% Complete</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

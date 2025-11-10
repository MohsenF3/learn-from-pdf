"use client";

import QuestionReviewCard from "@/features/history/components/question-review-card";
import { useShallow } from "zustand/shallow";
import { useQuizStore } from "../../store/quiz-store";

export default function QuizReviewItems() {
  const { questions, selectedAnswers } = useQuizStore(
    useShallow((s) => ({
      questions: s.questions,
      selectedAnswers: s.selectedAnswers,
    }))
  );

  return (
    <div className="space-y-6">
      {questions.map((question, questionIndex) => {
        const userAnswer = selectedAnswers[questionIndex];
        if (userAnswer === null) return null;

        return (
          <QuestionReviewCard
            key={questionIndex}
            question={question}
            questionIndex={questionIndex}
            totalQuestions={questions.length}
            userAnswer={userAnswer}
          />
        );
      })}
    </div>
  );
}

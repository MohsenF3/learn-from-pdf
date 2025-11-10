"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import React from "react";
import { useShallow } from "zustand/shallow";
import { useConfetti } from "../../hooks/use-confetti";
import { getScoreInfo } from "../../lib/utils";
import { useQuizStore } from "../../store/quiz-store";
import QuizResultActions from "./quiz-result-actions";
import QuizResultSummary from "./quiz-result-summary";

interface ShowScoreProps {
  user: User | null;
}

export default function QuizResult({ user }: ShowScoreProps) {
  const { fireworks } = useConfetti();

  const { questions, score, hasCelebrated } = useQuizStore(
    useShallow((s) => ({
      questions: s.questions,
      score: s.score,
      hasCelebrated: s.hasCelebrated,
    }))
  );
  const setCelebrated = useQuizStore((s) => s.setCelebrated);

  const total = questions.length;
  const percentage = total > 0 ? (score! / total) * 100 : 0;
  const { emoji, message, colorClass } = getScoreInfo(percentage);

  React.useEffect(() => {
    if (hasCelebrated || total === 0 || percentage < 80) return;

    fireworks();
    setCelebrated();
  }, [fireworks, percentage, total, hasCelebrated, setCelebrated]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          <Card className="border-2 text-center">
            <CardHeader>
              <div className="mb-4 text-6xl">{emoji}</div>
              <CardTitle className="text-3xl">{message}</CardTitle>
              <CardDescription className="text-lg">
                Here are your quiz results
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <QuizResultSummary
                score={score ?? 0}
                total={total}
                percentage={percentage}
                colorClass={colorClass}
              />

              <QuizResultActions user={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

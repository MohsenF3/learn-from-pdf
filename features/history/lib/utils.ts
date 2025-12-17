// features/history/lib/utils.ts
import { QuizDifficulty } from "@/features/quiz/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { QuizHistoryDB } from "./types";

// STATISTICS & CALCULATIONS

export function calculateAverageScore(histories: QuizHistoryDB[]): number {
  if (histories.length === 0) return 0;
  const totalPercentage = histories.reduce(
    (acc, quiz) => acc + (quiz.score / quiz.total_questions) * 100,
    0
  );
  return totalPercentage / histories.length;
}

export function calculateBestScore(histories: QuizHistoryDB[]): number {
  if (histories.length === 0) return 0;
  return Math.max(...histories.map((q) => (q.score / q.total_questions) * 100));
}

export function formatPercentage(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

// CHART DATA TRANSFORMATIONS

export const DIFFICULTY_COLORS = {
  simple: "var(--color-chart-success)",
  medium: "var(--color-chart-warning)",
  hard: "var(--color-chart-danger)",
} as const;

export function getScoreOverTimeData(histories: QuizHistoryDB[]) {
  return [...histories]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((h) => ({
      date: format(new Date(h.created_at), "MMM dd"),
      scorePercentage:
        h.total_questions > 0
          ? Math.round((h.score / h.total_questions) * 100)
          : 0,
    }));
}
export function getAvgScoreByDifficulty(histories: QuizHistoryDB[]) {
  const map = histories.reduce((acc, h) => {
    const key = h.difficulty.toLowerCase();
    if (!acc[key]) acc[key] = { score: 0, total: 0 };
    acc[key].score += h.score;
    acc[key].total += h.total_questions;
    return acc;
  }, {} as Record<string, { score: number; total: number }>);

  const order = ["simple", "medium", "hard"];
  return order
    .filter((d) => map[d])
    .map((difficulty) => ({
      difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      averagePercentage:
        map[difficulty].total > 0
          ? Math.round((map[difficulty].score / map[difficulty].total) * 100)
          : 0,
      fill: DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS],
    }));
}

// UI HELPERS

export const getDifficultyVariant = (difficulty: QuizDifficulty) => {
  switch (difficulty) {
    case "simple":
      return "success";
    case "medium":
      return "warning";
    case "hard":
      return "destructive";
    default:
      return "default";
  }
};

export const getScoreColor = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  switch (true) {
    case percentage >= 80:
      return "text-success";
    case percentage >= 60 && percentage < 80:
      return "text-warning";
    case percentage < 60:
      return "text-destructive";
    default:
      return "text-primary";
  }
};

export const getOptionClasses = (
  isUserAnswer: boolean,
  isCorrectAnswer: boolean
): string => {
  return cn(
    "rounded-lg border-2 p-4 transition-colors",
    isCorrectAnswer && "border-success bg-success/10",
    isUserAnswer && !isCorrectAnswer && "border-destructive bg-destructive/10",
    !isUserAnswer && !isCorrectAnswer && "border-border"
  );
};

// DATE FORMATTING

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

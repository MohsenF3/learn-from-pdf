import { cn } from "@/lib/utils";
import { QuizDifficulties, QuizHistory } from "./types";

// Get average score % from quiz history
// calculateAverageScore([{ score: 8, total_questions: 10 }]) => 80
export function calculateAverageScore(histories: QuizHistory[]): number {
  if (histories.length === 0) return 0;
  const totalPercentage = histories.reduce(
    (acc, quiz) => acc + (quiz.score / quiz.total_questions) * 100,
    0
  );
  return totalPercentage / histories.length;
}

// Find highest score % across all attempts
// calculateBestScore([{ score: 7, total: 10 }, { score: 9, total: 10 }]) => 90
export function calculateBestScore(histories: QuizHistory[]): number {
  if (histories.length === 0) return 0;
  return Math.max(...histories.map((q) => (q.score / q.total_questions) * 100));
}

// Round percentage to decimal places
// formatPercentage(85.678, 1) => "85.7"
export function formatPercentage(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

export const getDifficultyVariant = (difficulty: QuizDifficulties) => {
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

// Format date to readable string
// formatDateTime("2025-10-30T10:30:00Z") => "October 30, 2025, 10:30 AM"
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

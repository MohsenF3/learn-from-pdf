import { ChartConfig } from "@/components/ui/chart";

export const scoreOverTimeConfig = {
  scorePercentage: {
    label: "Score %",
    color: "var(--color-chart-primary)",
  },
} satisfies ChartConfig;

export const difficultyBarConfig = {
  averagePercentage: {
    label: "Average Score %",
  },
  simple: {
    label: "Simple",
    color: "var(--color-chart-success)",
  },
  medium: {
    label: "Medium",
    color: "var(--color-chart-warning)",
  },
  hard: {
    label: "Hard",
    color: "var(--color-chart-danger)",
  },
} satisfies ChartConfig;

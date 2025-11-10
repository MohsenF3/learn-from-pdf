import { cn } from "@/lib/utils";

export interface QuizResultSummaryProps {
  score: number | null;
  total: number;
  percentage: number;
  colorClass: string;
}

export default function QuizResultSummary({
  score,
  total,
  percentage,
  colorClass,
}: QuizResultSummaryProps) {
  return (
    <div>
      <div className={cn("text-7xl font-bold", colorClass)}>
        {score}/{total}
      </div>
      <p className="mt-2 text-xl text-muted-foreground">
        {Math.round(percentage)}% Correct
      </p>
    </div>
  );
}

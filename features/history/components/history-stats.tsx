import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizHistoryDB } from "@/features/history/lib/types";
import {
  calculateAverageScore,
  calculateBestScore,
  formatPercentage,
} from "@/features/history/lib/utils";
import { FileText, Target, TrendingUp } from "lucide-react";

type HistoryStatsProps = {
  history: QuizHistoryDB[];
};

export default function HistoryStats({ history }: HistoryStatsProps) {
  const totalQuizzes = history.length;
  const averageScore = calculateAverageScore(history);
  const bestScore = calculateBestScore(history);

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuizzes}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(averageScore)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(bestScore, 0)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

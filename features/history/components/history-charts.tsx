import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizHistoryDB } from "@/features/history/lib/types";
import { getAvgScoreByDifficulty, getScoreOverTimeData } from "../lib/utils";
import DifficultyBarChart from "./difficulty-bar-chart";
import ScoreLineChart from "./score-line-chart";

interface HistoryChartsProps {
  histories: QuizHistoryDB[];
}

export default function HistoryCharts({ histories }: HistoryChartsProps) {
  const scoreData = getScoreOverTimeData(histories);
  const difficultyData = getAvgScoreByDifficulty(histories);

  return (
    <section className="mt-10 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Performance Analytics
        </h2>
        <p className="text-muted-foreground">
          Track your quiz performance and identify areas for improvement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Score Progress</CardTitle>
            <CardDescription>Your score percentage over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ScoreLineChart data={scoreData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Score by Difficulty</CardTitle>
            <CardDescription>
              Average performance per difficulty level
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <DifficultyBarChart data={difficultyData} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

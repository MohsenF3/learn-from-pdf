import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizHistoryDB } from "@/features/history/lib/types";
import {
  formatDateTime,
  getDifficultyVariant,
  getScoreColor,
} from "@/features/history/lib/utils";
import { cn } from "@/lib/utils";
import { Calendar, FileText } from "lucide-react";

interface HistoryItemCardProps {
  quiz: QuizHistoryDB;
}

export default function HistoryItemCard({ quiz }: HistoryItemCardProps) {
  const formattedDate = formatDateTime(quiz.created_at);
  const percentage = ((quiz.score / quiz.total_questions) * 100).toFixed(0);
  const scoreColor = getScoreColor(quiz.score, quiz.total_questions);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <span className="truncate">
                {quiz.quiz_data.config.pdfFileName}
              </span>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </CardDescription>
          </div>
          <Badge
            variant={getDifficultyVariant(quiz.difficulty)}
            className="shrink-0"
          >
            {quiz.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className={cn("text-2xl font-bold", scoreColor)}>
              {quiz.score}/{quiz.total_questions}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Percentage</p>
            <p className={cn("text-2xl font-bold", scoreColor)}>
              {percentage}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

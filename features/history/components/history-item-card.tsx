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

export interface HistoryItemCardProps {
  quiz: QuizHistoryDB;
}

export default function HistoryItemCard({ quiz }: HistoryItemCardProps) {
  const formattedDate = formatDateTime(quiz.created_at);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-[calc(100%-5rem)]">
            <CardTitle className="flex items-center gap-2 ">
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
          <Badge variant={getDifficultyVariant(quiz.difficulty)}>
            {quiz.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p
                className={cn(
                  "text-2xl font-bold",
                  getScoreColor(quiz.score, quiz.total_questions)
                )}
              >
                {quiz.score}/{quiz.total_questions}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Percentage</p>
              <p
                className={cn(
                  "text-2xl font-bold",
                  getScoreColor(quiz.score, quiz.total_questions)
                )}
              >
                {((quiz.score / quiz.total_questions) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

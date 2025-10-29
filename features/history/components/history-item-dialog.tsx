import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuizHistory } from "@/features/history/lib/types";
import { FileText } from "lucide-react";
import { formatDateTime } from "../lib/utils";
import HistoryItemCard from "./history-item-card";
import QuestionReviewCard from "./question-review-card";

export interface HistoryItemDialogProps {
  quiz: QuizHistory;
}

export default function HistoryItemDialog({ quiz }: HistoryItemDialogProps) {
  const formattedDate = formatDateTime(quiz.created_at);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <HistoryItemCard quiz={quiz} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quiz Review
          </DialogTitle>
          <DialogDescription>
            {quiz.quiz_data.config.pdfFileName} <br />
            {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {quiz.quiz_data.questions.map((question, questionIndex) => (
            <QuestionReviewCard
              key={questionIndex}
              question={question}
              questionIndex={questionIndex}
              totalQuestions={quiz.quiz_data.questions.length}
              userAnswer={quiz.quiz_data.selectedAnswers[questionIndex]}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

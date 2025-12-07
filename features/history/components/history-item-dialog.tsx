"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuizHistoryDB } from "@/features/history/lib/types";
import { formatDateTime } from "@/features/history/lib/utils";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useState } from "react";
import HistoryItemCard from "./history-item-card";
import QuestionReviewCard from "./question-review-card";

interface HistoryItemDialogProps {
  quiz: QuizHistoryDB;
}

export default function HistoryItemDialog({ quiz }: HistoryItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalQuestions = quiz.quiz_data.questions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  const handlePrevious = () => setCurrentIndex((p) => Math.max(0, p - 1));
  const handleNext = () =>
    setCurrentIndex((p) => Math.min(totalQuestions - 1, p + 1));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && !isFirst) handlePrevious();
    if (e.key === "ArrowRight" && !isLast) handleNext();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <HistoryItemCard quiz={quiz} />
        </div>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-5xl flex flex-col p-0 gap-0"
        onKeyDown={handleKeyDown}
      >
        <div className="border-b px-4 py-4 md:px-6">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              Quiz Review
            </DialogTitle>
            <DialogDescription className="mt-2 space-y-1">
              <span className="block font-medium text-foreground truncate">
                {quiz.quiz_data.config.pdfFileName}
              </span>
              <span className="block">{formatDateTime(quiz.created_at)}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <QuestionReviewCard
            question={quiz.quiz_data.questions[currentIndex]}
            questionIndex={currentIndex}
            totalQuestions={totalQuestions}
          />

          <nav className="flex gap-3 pt-4" aria-label="Question navigation">
            <Button
              onClick={handlePrevious}
              disabled={isFirst}
              variant="outline"
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button onClick={handleNext} disabled={isLast} className="flex-1">
              <span className="hidden sm:inline">Next Question</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4 sm:ml-2" />
            </Button>
          </nav>

          <div className="hidden sm:flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6">
            <kbd className="px-2 py-1 h-6 min-w-6 bg-muted border rounded font-mono font-semibold shadow-sm">
              ←
            </kbd>
            <kbd className="px-2 py-1 h-6 min-w-6 bg-muted border rounded font-mono font-semibold shadow-sm">
              →
            </kbd>
            <span className="font-medium">Navigate questions</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

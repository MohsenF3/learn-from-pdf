import { buttonVariants } from "@/components/ui/button";
import { QuizGuard } from "@/features/quiz/components/quiz-guard";
import QuizReviewHeader from "@/features/quiz/components/review/quiz-review-header";
import QuizReviewItems from "@/features/quiz/components/review/quiz-review-items";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quiz Review",
};

export default function QuizReviewPage() {
  return (
    <QuizGuard loadingMessage="Loading your quiz review...">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            <QuizReviewHeader />

            <QuizReviewItems />

            <div className="mt-8 text-center flex flex-col items-center gap-5">
              <p className="text-center text-lg text-muted-foreground">
                Great job completing your quiz! 🚀 Ready to challenge yourself
                with a new one?
              </p>
              <Link
                href={ROUTES.PUBLIC.QUIZ_CREATE}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" })
                )}
              >
                Create New Quiz
              </Link>
            </div>
          </div>
        </div>
      </main>
    </QuizGuard>
  );
}

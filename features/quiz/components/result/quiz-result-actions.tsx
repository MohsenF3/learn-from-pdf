"use client";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import StartNewQuizButton from "../review/start-new-quiz-button";

export interface QuizResultActionsProps {
  user: User | null;
}

export default function QuizResultActions({ user }: QuizResultActionsProps) {
  return (
    <div className="flex flex-col gap-3 pt-4">
      <Link
        href={ROUTES.PUBLIC.QUIZ_REVIEW}
        className={cn(
          buttonVariants({
            variant: "default",
            className: "w-full text-lg",
            size: "lg",
          })
        )}
      >
        Review Answers
      </Link>

      {/* show only for logged in users */}
      {user && (
        <StartNewQuizButton
          className="w-full text-lg bg-transparent"
          variant="outline"
          redirectTo={ROUTES.PROTECTED.HISTORY}
        >
          View Quiz History
        </StartNewQuizButton>
      )}

      <StartNewQuizButton
        className="w-full text-lg bg-transparent"
        variant="outline"
        redirectTo={ROUTES.PUBLIC.QUIZ_CREATE}
      >
        Start New Quiz
      </StartNewQuizButton>
    </div>
  );
}

"use client";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export interface QuizResultActionsProps {
  user: User | null;
}

export default function QuizResultActions({ user }: QuizResultActionsProps) {
  return (
    <div className="flex flex-col gap-3 pt-4">
      {/* TODO : change the result   */}
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
        <Link
          href={ROUTES.PROTECTED.HISTORY}
          className={buttonVariants({
            variant: "outline",
            className: "w-full text-lg bg-transparent",
            size: "lg",
          })}
        >
          View Quiz History
        </Link>
      )}

      <Link
        href={ROUTES.PUBLIC.QUIZ_CREATE}
        className={buttonVariants({
          variant: "outline",
          className: "w-full text-lg bg-transparent",
          size: "lg",
        })}
      >
        Start New Quiz
      </Link>
    </div>
  );
}

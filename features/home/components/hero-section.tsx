import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import DemoButton from "./demo-button";

export function HeroSection() {
  return (
    <div className="mb-20 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        AI-Powered Learning Platform
      </div>
      <h2 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground md:text-7xl">
        Transform Your PDFs into
        <span className="block gradient-text">Interactive Quizzes</span>
      </h2>
      <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
        Upload any PDF document and let our advanced AI generate personalized
        quiz questions to test your knowledge. Perfect for students, educators,
        and lifelong learners who want to master their material.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href={ROUTES.PUBLIC.QUIZ_CREATE}
          className={cn(
            buttonVariants({
              variant: "default",
              size: "lg",
              className: "h-12 px-8 text-base shadow-lg shadow-primary/25",
            })
          )}
        >
          Start Creating Quizzes
          <Sparkles className="ml-2 h-5 w-5" />
        </Link>

        <DemoButton
          size="lg"
          variant="outline"
          className="h-12 px-8 text-base bg-transparent"
        >
          Try Demo Quiz
        </DemoButton>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
        <div>
          <div className="text-3xl font-bold text-foreground md:text-4xl">
            10+
          </div>
          <div className="text-sm text-muted-foreground">
            Questions per Quiz
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground md:text-4xl">
            5MB
          </div>
          <div className="text-sm text-muted-foreground">Max File Size</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground md:text-4xl">
            3
          </div>
          <div className="text-sm text-muted-foreground">Difficulty Levels</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground md:text-4xl">
            AI
          </div>
          <div className="text-sm text-muted-foreground">
            Powered Generation
          </div>
        </div>
      </div>
    </div>
  );
}

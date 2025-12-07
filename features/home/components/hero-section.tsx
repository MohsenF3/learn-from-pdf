import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { BrainCircuit, FileUp, Globe, Sparkles } from "lucide-react"; // Added new icons
import Link from "next/link";
import DemoButton from "./demo-button";

export function HeroSection() {
  return (
    <div className="mb-20 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        <span>Now supporting 8+ Languages</span>
      </div>
      <h2 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground md:text-7xl">
        Transform PDFs into
        <span className="block gradient-text">Mastery Tools</span>
      </h2>
      <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
        Upload any PDF document in English, Spanish, Chinese, or more. Our
        advanced AI generates personalized quizzes instantly, helping you master
        your material.
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
          <div className="flex justify-center mb-2">
            <BrainCircuit className="h-6 w-6 text-primary/60" />
          </div>
          <div className="text-3xl font-bold text-foreground md:text-4xl">
            1-15
          </div>
          <div className="text-sm text-muted-foreground">
            Questions per Quiz
          </div>
        </div>
        <div>
          <div className="flex justify-center mb-2">
            <FileUp className="h-6 w-6 text-primary/60" />
          </div>
          <div className="text-3xl font-bold text-foreground md:text-4xl">
            5MB
          </div>
          <div className="text-sm text-muted-foreground">Max File Size</div>
        </div>
        <div>
          <div className="flex justify-center mb-2">
            <Globe className="h-6 w-6 text-primary/60" />
          </div>
          <div className="text-3xl font-bold text-foreground md:text-4xl">
            8
          </div>
          <div className="text-sm text-muted-foreground">
            Supported Languages
          </div>
        </div>
        <div>
          <div className="flex justify-center mb-2">
            <Sparkles className="h-6 w-6 text-primary/60" />
          </div>
          <div className="text-3xl font-bold text-foreground md:text-4xl">
            100%
          </div>
          <div className="text-sm text-muted-foreground">AI Generated</div>
        </div>
      </div>
    </div>
  );
}

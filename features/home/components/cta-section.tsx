import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  return (
    <div className="rounded-2xl border border-border/50 bg-linear-to-br from-primary/5 to-accent/5 p-8 text-center backdrop-blur-sm md:p-12">
      <h3 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
        Ready to Start Learning?
      </h3>
      <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
        Join thousands of learners who are using AI-powered quizzes to master
        their study materials faster and more effectively.
      </p>
      <Link href={ROUTES.PUBLIC.UPLOAD}>
        <Button
          size="lg"
          className="h-12 px-8 text-base shadow-lg shadow-primary/25"
        >
          Create Your First Quiz
          <Sparkles className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}

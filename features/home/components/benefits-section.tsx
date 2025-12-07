import { Award, BarChart3, CheckCircle, Clock } from "lucide-react";

export function BenefitsSection() {
  return (
    <div className="mb-20">
      <h3 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
        Why Choose Our Platform?
      </h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex gap-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              Deep Understanding
            </h4>
            <p className="text-sm text-muted-foreground">
              Don't just guess. Get immediate results with detailed explanations
              for every right (and wrong) answer to reinforce learning.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              Visual Analytics
            </h4>
            <p className="text-sm text-muted-foreground">
              Go beyond simple scores. Sign in to access interactive charts that
              visualize your learning curve and daily progress.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              Seconds, Not Hours
            </h4>
            <p className="text-sm text-muted-foreground">
              Stop manually writing flashcards. Our AI processes your PDF and
              generates a complete quiz in under 30 seconds.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              Gamified Learning
            </h4>
            <p className="text-sm text-muted-foreground">
              Stay motivated with difficulty tiers. Master the 'Simple' level
              before challenging yourself with 'Hard' questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

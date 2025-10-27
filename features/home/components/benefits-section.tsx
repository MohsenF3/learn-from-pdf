import { Award, CheckCircle, Clock, TrendingUp } from "lucide-react";

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
              Instant Feedback
            </h4>
            <p className="text-sm text-muted-foreground">
              Get immediate results with detailed explanations for each question
              to enhance your learning experience.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              Track Progress
            </h4>
            <p className="text-sm text-muted-foreground">
              Monitor your performance with detailed score breakdowns and see
              which areas need more focus.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">Save Time</h4>
            <p className="text-sm text-muted-foreground">
              No need to manually create questions. Our AI does the heavy
              lifting in seconds, not hours.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              Celebrate Success
            </h4>
            <p className="text-sm text-muted-foreground">
              Earn achievements and see confetti animations when you ace your
              quizzes. Learning should be fun!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

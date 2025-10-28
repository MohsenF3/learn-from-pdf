import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import React from "react";

const BENEFITS = [
  {
    title: "Up to 50 questions per quiz",
    description: "Free users limited to 10",
  },
  {
    title: "All difficulty levels",
    description: "Access medium and hard modes",
  },
  {
    title: "Quiz history & analytics",
    description: "Track your progress over time",
  },
];

export default function SignInBenefits() {
  return (
    <div className="mt-6 space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Benefits of signing in
          </span>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border p-4">
        {BENEFITS.map((benefit) => (
          <React.Fragment key={benefit.title}>
            <div className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>

            <Separator className="my-4" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

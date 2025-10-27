import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, FileText, Zap } from "lucide-react";

export function FeaturesCards() {
  return (
    <div className="mb-20">
      <h3 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
        Everything You Need to Learn Better
      </h3>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group border-2 transition-all hover:border-primary/50 hover:shadow-lg">
          <CardHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 transition-transform group-hover:scale-110">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl">Easy Upload</CardTitle>
            <CardDescription className="text-base">
              Simply drag and drop your PDF or click to browse. We support
              documents up to 5MB with instant processing.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group border-2 transition-all hover:border-primary/50 hover:shadow-lg">
          <CardHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 transition-transform group-hover:scale-110">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl">AI-Powered</CardTitle>
            <CardDescription className="text-base">
              Advanced AI analyzes your document content and generates relevant,
              contextual multiple-choice questions automatically.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group border-2 transition-all hover:border-primary/50 hover:shadow-lg">
          <CardHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 transition-transform group-hover:scale-110">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl">Fully Customizable</CardTitle>
            <CardDescription className="text-base">
              Choose the number of questions (up to 10) and difficulty level
              (simple, medium, hard) that matches your learning needs.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

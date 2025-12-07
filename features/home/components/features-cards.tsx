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
              Simply drag and drop your PDF. We handle files up to 5MB with
              instant processing, keeping your original formatting intact.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group border-2 transition-all hover:border-primary/50 hover:shadow-lg">
          <CardHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 transition-transform group-hover:scale-110">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl">Multi-Language AI</CardTitle>
            <CardDescription className="text-base">
              Our AI speaks your language. Generate questions in English,
              Spanish, French, German, Italian, Russian, Chinese, or Farsi.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group border-2 transition-all hover:border-primary/50 hover:shadow-lg">
          <CardHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 transition-transform group-hover:scale-110">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl">Smart Customization</CardTitle>
            <CardDescription className="text-base">
              Select your difficulty (Simple to Hard). Free users get 5
              questions per quiz, while signed-in users unlock up to 15
              questions.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

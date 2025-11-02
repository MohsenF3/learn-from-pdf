import QuizCard from "@/features/quiz/components/quiz-card";
import { QuizGuard } from "@/features/quiz/components/quiz-guard";
import QuizProgress from "@/features/quiz/components/quiz-progress";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Demo",
};

export default function QuizDemoPage() {
  return (
    <QuizGuard
      requireComplete={false}
      requireQuestions={false}
      loadingMessage="Preparing your quiz..."
    >
      <main className="min-h-screen bg-background">
        <div className="container px-4 py-8 md:py-12 mx-auto max-w-5xl">
          <QuizProgress />

          <QuizCard />
        </div>
      </main>
    </QuizGuard>
  );
}

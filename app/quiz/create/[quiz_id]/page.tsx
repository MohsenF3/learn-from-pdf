import QuizCard from "@/features/quiz/components/quiz-card";
import { QuizGuard } from "@/features/quiz/components/quiz-guard";
import QuizProgress from "@/features/quiz/components/quiz-progress";
import { ROUTES } from "@/lib/routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Take Quiz",
};

interface TakeQuizPageProps {
  params: Promise<{
    quiz_id: string;
  }>;
}

export default async function TakeQuizPage({ params }: TakeQuizPageProps) {
  const { quiz_id } = await params;

  if (!quiz_id) {
    redirect(ROUTES.PUBLIC.QUIZ_CREATE);
  }

  return (
    <QuizGuard
      requireComplete={false}
      validateQuizId={quiz_id}
      redirectTo={ROUTES.PUBLIC.QUIZ_CREATE}
      loadingMessage="Loading your quiz..."
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

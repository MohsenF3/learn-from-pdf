import CreateQuizCard from "@/features/quiz/components/create/create-quiz-card";
import LimitedAccessWarning from "@/features/quiz/components/create/limited-access-warning";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your own quiz",
};

export default function CreateQuizPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <LimitedAccessWarning />

          <CreateQuizCard />
        </div>
      </div>
    </main>
  );
}

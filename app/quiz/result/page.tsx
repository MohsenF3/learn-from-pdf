import { getUser } from "@/features/auth/lib/getUser";
import { QuizGuard } from "@/features/quiz/components/quiz-guard";
import QuizResult from "@/features/quiz/components/result/quiz-result";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Result",
};

export default async function QuizResultPage() {
  const user = await getUser();

  return (
    <QuizGuard loadingMessage="Loading your results...">
      <QuizResult user={user} />
    </QuizGuard>
  );
}

import { getUser } from "@/features/auth/lib/getUser";
import EmptyHistory from "@/features/history/components/empty-history";
import HistoryCharts from "@/features/history/components/history-charts";
import HistoryItems from "@/features/history/components/history-items";
import HistoryStats from "@/features/history/components/history-stats";
import { getUserQuizHistory } from "@/features/history/lib/queries";
import BackLink from "@/features/shared/components/back-link";
import ErrorDisplay from "@/features/shared/components/error-display";
import { ROUTES } from "@/lib/routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "History",
};

export default async function HistoryPage() {
  const user = await getUser();

  // check if user is logged in
  if (!user) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const history = await getUserQuizHistory(user.id);

  if (!history.success) {
    return (
      <ErrorDisplay
        message={history.error}
        retryLink={ROUTES.PROTECTED.HISTORY}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl min-h-svh">
      <div className="mb-8">
        <BackLink />
        <h1 className="text-4xl font-bold gradient-text">Your Quiz History</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and review past quizzes
        </p>
      </div>

      <div className="space-y-8">
        <HistoryStats history={history.data} />

        {history.data.length === 0 ? (
          <EmptyHistory />
        ) : (
          <>
            <HistoryCharts histories={history.data} />
            <HistoryItems histories={history.data} />
          </>
        )}
      </div>
    </div>
  );
}

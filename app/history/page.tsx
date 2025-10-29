import EmptyHistory from "@/features/history/components/empty-history";
import HistoryItems from "@/features/history/components/history-items";
import HistoryStats from "@/features/history/components/history-stats";
import { getHistory } from "@/features/history/lib/actions";
import BackLink from "@/features/shared/components/back-link";
import ErrorDisplay from "@/features/shared/components/error-display";
import { ROUTES } from "@/lib/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History",
};

export default async function HistoryPage() {
  const result = await getHistory();

  if (!result.success) {
    return (
      <ErrorDisplay
        message={result.error}
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

      <HistoryStats history={result.data} />

      {result.data.length === 0 ? (
        <EmptyHistory />
      ) : (
        <HistoryItems histories={result.data} />
      )}
    </div>
  );
}

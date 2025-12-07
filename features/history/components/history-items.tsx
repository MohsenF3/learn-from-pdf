import { QuizHistoryDB } from "@/features/history/lib/types";
import HistoryItemDialog from "./history-item-dialog";

interface HistoryItemsProps {
  histories: QuizHistoryDB[];
}

export default function HistoryItems({ histories }: HistoryItemsProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Quiz History</h2>
        <p className="text-muted-foreground">
          Review your past quizzes and detailed answers
        </p>
      </div>

      <div className="space-y-4">
        {histories.map((history) => (
          <HistoryItemDialog key={history.id} quiz={history} />
        ))}
      </div>
    </section>
  );
}

import { QuizHistory } from "@/features/history/lib/types";
import HistoryItemDialog from "./history-item-dialog";

interface HistoryItemsProps {
  histories: QuizHistory[];
}

export default function HistoryItems({ histories }: HistoryItemsProps) {
  return (
    <div className="space-y-4">
      {histories.map((history) => (
        <HistoryItemDialog key={history.id} quiz={history} />
      ))}
    </div>
  );
}

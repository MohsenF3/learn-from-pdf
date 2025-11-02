import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

export default function QuizPage() {
  return redirect(ROUTES.PUBLIC.QUIZ_CREATE);
}

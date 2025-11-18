import { QuizDifficulty } from "@/features/quiz/lib/types";
import { createClientFromServer } from "@/lib/supabase/server";
import { ActionResult } from "@/lib/types";
import { cache } from "react";
import { QuizHistoryData, QuizHistoryDB } from "./types";

export const getUserQuizHistory = cache(
  async (userId: string): Promise<ActionResult<QuizHistoryDB[]>> => {
    const supabase = await createClientFromServer();

    const { data, error } = await supabase
      .from("quiz_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return {
        success: false,
        error: "Failed to fetch quiz history",
      };
    }
    return {
      success: true,
      data: (data ?? []).map((row) => ({
        ...row,
        quiz_data: row.quiz_data as unknown as QuizHistoryData,
        difficulty: row.difficulty as QuizDifficulty,
      })),
    };
  }
);

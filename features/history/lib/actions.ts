"use server";

import { getUser } from "@/features/auth/lib/getUser";
import { ROUTES } from "@/lib/routes";
import { createClientFromServer } from "@/lib/supabase/server";
import { ActionResult } from "@/lib/types";
import { redirect } from "next/navigation";
import { QuizHistory } from "./types";

export async function getHistory(): Promise<ActionResult<QuizHistory[]>> {
  const user = await getUser();

  if (!user) {
    redirect(ROUTES.AUTH.LOGIN);
    // for satisfy typescript
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const supabase = await createClientFromServer();

  const { data, error } = await supabase
    .from("quiz_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data,
  };
}

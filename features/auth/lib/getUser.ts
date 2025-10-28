import { createClientFromServer } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClientFromServer();
  const { data } = await supabase.auth.getUser();

  return data.user;
}

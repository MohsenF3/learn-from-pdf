import { createClientFromServer } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClientFromServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  return data.user;
}

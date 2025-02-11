import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const userId = getRouterParam(event, "user_id") as string;

  const { data, error } = await client
    .from("saved_challenges")
    .select("challenges(*)")
    .eq("user_id", userId);

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  const challenges = data.map((item) => item.challenges);

  return challenges;
});

import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "user_id") as string;
  const client = await serverSupabaseClient<Database>(event);

  console.log("userId", userId);

  const { data, error } = await client
    .from("saved_challenges")
    .select("challenges(*)")
    .eq("user_id", userId);

  console.log("data", data);
  console.log("error", error);

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  const challenges = data.map((item) => item.challenges);

  return challenges;
});

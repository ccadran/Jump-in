import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const challengeId = getRouterParam(event, "challenge_id") as string;

  const { data, error } = await client
    .from("complete_challenges")
    .select("*")
    .eq("challenge_id", challengeId);

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  return data;
});

import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const challengeId = getRouterParam(event, "challenge") as string;

  console.log("challengeId", challengeId);

  const client = await serverSupabaseClient<Database>(event);
  const { count: savedCount, error } = await client
    .from("saved_challenges")
    .select("*", { count: "exact", head: true })
    .eq("challenge_id", challengeId);

  const { count: completeCount, error: error2 } = await client
    .from("complete_challenges")
    .select("*", { count: "exact", head: true })
    .eq("challenge_id", challengeId);

  console.log("data", savedCount);
  console.log("data2", completeCount);

  if (error || error2) {
    return createError({
      statusCode: 500,
      message: error?.message || error2?.message,
    });
  }

  return { savedCount: savedCount, completedCount: completeCount };
});

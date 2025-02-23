import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const { userId, challengeId } = await readBody(event);

  const client = await serverSupabaseClient<Database>(event);
  const { data, error } = await client
    .from("complete_challenges")
    .select()
    .eq("user_id", userId)
    .eq("challenge_id", challengeId);

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  const isComplete = data && data.length > 0; // ✅ Vérification correcte
  // Debug correct

  return isComplete;
});

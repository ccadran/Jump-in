import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const { userId, challengeId } = await readBody(event);

  const client = await serverSupabaseClient<Database>(event);
  const { data, error } = await client
    .from("saved_challenges")
    .delete()
    .match({ user_id: userId, challenge_id: challengeId });

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  return { message: "Utilisateur retiré de la guilde", data };
});

import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const { userId, challengeId } = await readBody(event);
  console.log(userId, challengeId);

  const client = await serverSupabaseClient<Database>(event);
  const { data, error } = await client.from("saved_challenges").insert([
    {
      user_id: userId,
      challenge_id: challengeId,
    },
  ]);

  console.log("____data____", data);

  console.log("____error____", error);

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  return { message: "Utilisateur ajouté à la guilde", data };
});

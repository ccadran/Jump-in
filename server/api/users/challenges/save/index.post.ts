import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const { userId, challenge_id } = await readBody(event);
  console.log(userId, challenge_id);

  const client = await serverSupabaseClient<Database>(event);
  const { data, error } = await client.from("saved_challenges").insert([
    {
      user_id: userId,
      challenge_id: challenge_id,
    },
  ]);

  console.log(data);
  console.log(error);

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  return { message: "Utilisateur ajouté à la guilde", data };
});

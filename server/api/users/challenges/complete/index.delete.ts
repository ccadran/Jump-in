import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const { userId, id } = await readBody(event);

  const client = await serverSupabaseClient<Database>(event);
  const { data, error } = await client
    .from("complete_challenges")
    .delete()
    .match({ user_id: userId, id: id });

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  return { message: "Utilisateur retiré de la guilde", data };
});

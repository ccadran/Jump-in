import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const { userId, guildId } = await readBody(event);

  const client = await serverSupabaseClient<Database>(event);
  const { data, error } = await client.from("user_guilds").insert([
    {
      user_id: userId,
      guild_id: guildId,
    },
  ]);

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  return { message: "Utilisateur ajouté à la guilde", data };
});

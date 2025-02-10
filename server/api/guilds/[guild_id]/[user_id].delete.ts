import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "user_id");
  const guildId = getRouterParam(event, "guild_id");

  const client = await serverSupabaseClient<Database>(event);
  const { data, error } = await client
    .from("user_guilds")
    .delete()
    .match({ user_id: userId, guild_id: guildId });

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  return { message: "Utilisateur retiré de la guilde", data };
});

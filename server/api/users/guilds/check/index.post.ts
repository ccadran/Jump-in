import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const { userId, guildId } = await readBody(event);

  const client = await serverSupabaseClient<Database>(event);
  const { data, error } = await client
    .from("user_guilds")
    .select()
    .eq("user_id", userId)
    .eq("guild_id", guildId);

  const isMember = data && data.length > 0;
  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }

  return isMember;
});

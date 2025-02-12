import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "user_id") as string;
  const client = await serverSupabaseClient<Database>(event);

  const { data: guilds, error: guildsError } = await client
    .from("user_guilds")
    .select("guild_id")
    .eq("user_id", userId);

  if (guildsError) {
    throw createError({ statusCode: 500, message: guildsError.message });
  }

  const guildIds = guilds.map((guild) => guild.guild_id);

  const { data: challenges, error } = await client
    .from("challenges")
    .select("*")
    .in("guild", guildIds)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return challenges ?? [];
});

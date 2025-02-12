import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "user_id") as string;
  const client = await serverSupabaseClient<Database>(event);

  // Récupérer les derniers challenges liés aux guildes de l'utilisateur en une seule requête
  const { data: guilds, error: guildsError } = await client
    .from("user_guilds")
    .select("guild_id")
    .eq("user_id", userId);

  if (guildsError) {
    throw createError({ statusCode: 500, message: guildsError.message });
  }

  const guildIds = guilds.map((guild) => guild.guild_id);

  console.log("___guildIds", guildIds);

  const { data: challenges, error } = await client
    .from("challenges")
    .select("id, name, cover, description, created_at,guild, guilds(name)")
    .in("guild", guildIds)
    .order("created_at", { ascending: false })
    .limit(10);

  console.log("___challenge", challenges);
  console.log("___error", error);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return challenges ?? [];
});

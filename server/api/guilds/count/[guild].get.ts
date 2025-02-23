import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    const guildId = getRouterParam(event, "guild");
    if (!guildId) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID de la guild manquant",
      });
    }

    const { count, error } = await client
      .from("user_guilds")
      .select("*", { count: "exact", head: true }) // head: true pour ne pas récupérer les données
      .eq("guild_id", guildId);

    if (error) throw error;

    return { userCount: count };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors du comptage des utilisateurs",
    });
  }
});

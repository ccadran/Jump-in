import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID du challenge manquant",
      });
    }

    const { data, error } = await client
      .from("challenges")
      .select()
      .eq("guild", id);

    if (error) throw error;

    return data;
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération du challenge",
    });
  }
});

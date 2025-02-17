import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID de la guild manquant",
      });
    }

    // Suppression de la guild
    const { data, error } = await client
      .from("guilds")
      .select()
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error deleting guild:", error);
    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la suppression de la guild",
    });
  }
});

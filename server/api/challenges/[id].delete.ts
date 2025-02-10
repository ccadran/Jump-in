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

    // Suppression du challenge
    const { data, error } = await client
      .from("challenges")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error deleting challenge:", error);
    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la suppression du challenge",
    });
  }
});

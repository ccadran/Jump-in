import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    const user_id = getRouterParam(event, "user_id");
    if (!user_id) {
      throw createError({
        statusCode: 400,
        statusMessage: "USER_ID manquant",
      });
    }

    // Suppression de la guild
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    console.log("data", data);
    console.log("error", error);

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

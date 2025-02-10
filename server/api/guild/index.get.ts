import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    const { data, error } = await client.from("guild").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des catégories",
    });
  }
});

import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);
    const { challengeData, created_by } = await readBody(event);

    const { data, error } = await client
      .from("challenges")
      .insert({
        name: challengeData.name,
        cover: challengeData.cover,
        description: challengeData.description,
        guild: challengeData.guild,
        created_by,
      })
      .select();

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Error inserting data:", error);
    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de l'insertion des données",
    });
  }
});

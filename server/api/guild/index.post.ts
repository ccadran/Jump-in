import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);
    const { guildData, owner_id } = await readBody(event);

    const { data, error } = await client
      .from("guild")
      .insert({
        name: guildData.name,
        cover: guildData.cover,
        description: guildData.description,
        owner_id,
      })
      .select();
    // console.log(data);

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

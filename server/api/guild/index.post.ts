import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);
    const body = await readBody(event);

    const { data, error } = await client
      .from("guild")
      .insert({
        name: body.name,
        cover: body.cover,
        description: body.description,
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

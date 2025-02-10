import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);
    const { userData, email, password } = await readBody(event);

    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
    });

    const { data, error } = await client
      .from("user")
      .insert({
        user_id: authData?.user?.id,
        first_name: userData.firstName,
        name: userData.name,
        username: userData.username,
        description: userData.description,
        profil_picture: userData.profilePicture,
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

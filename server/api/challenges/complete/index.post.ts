import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);
    const { completeChallenge, userId } = await readBody(event);

    console.log("___COMPLETE FORM", completeChallenge);

    const { data, error } = await client
      .from("complete_challenges")
      .insert({
        title: completeChallenge.title,
        cover: completeChallenge.cover,
        description: completeChallenge.description,
        challenge_id: completeChallenge.challenge,
        user_id: userId,
      })
      .select();

    console.log("User ID reçu:", userId);
    console.log("Challenge ID reçu:", completeChallenge.challenge);

    console.log(data);
    console.log(error);

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

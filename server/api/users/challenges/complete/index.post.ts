import { serverSupabaseClient } from "#supabase/server";
import { readMultipartFormData } from "h3"; // Import pour traiter FormData
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);
    const formData = await readMultipartFormData(event); // Lire FormData

    console.log("FormData:", formData);

    if (!formData) throw new Error("FormData is empty");

    const challengeData: any = {};
    let coverFile: File | null = null;

    for (const field of formData) {
      if (field.name === "cover" && field.data) {
        coverFile = new File([field.data], field.filename || "cover", {
          type: field.type,
        });
        console.log("coverFile", coverFile);
      } else {
        if (field.name) {
          challengeData[field.name] = field.data.toString();
          console.log("field.name", field.name, challengeData[field.name]);
        }
      }
    }

    let coverUrl: string | null = null;

    if (coverFile) {
      const fileName = `${Date.now()}-${coverFile.name}`;
      const filePath = `challenges/complete/${fileName}`; // Stockage dans un dossier spécifique

      console.log("___FILE___", coverFile);

      const { error: uploadError } = await client.storage
        .from("jump-in") // Le bucket 'jump-in'
        .upload(filePath, coverFile, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log("___uploadError___", uploadError);

      if (uploadError) throw uploadError;

      coverUrl = client.storage.from("jump-in").getPublicUrl(filePath)
        .data.publicUrl;
    }

    console.log("___challengeData___", challengeData);
    console.log("User ID final envoyé:", challengeData.userId);

    const { data, error } = await client
      .from("complete_challenges")
      .insert({
        title: challengeData.title,
        cover: coverUrl,
        description: challengeData.description,
        challenge_id: challengeData.challenge,
        user_id: challengeData.userId,
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

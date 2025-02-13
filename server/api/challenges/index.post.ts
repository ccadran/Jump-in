import { serverSupabaseClient } from "#supabase/server";
import { readMultipartFormData } from "h3"; // Import correct pour traiter FormData
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);
    const formData = await readMultipartFormData(event); // Lire FormData

    console.log("FormData:", formData);

    if (!formData) throw new Error("FormData is empty");

    // Extraire les données du FormData
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
      const filePath = `challenges/${fileName}`;

      console.log("___FILE___", coverFile);

      const { error: uploadError } = await client.storage
        .from("jump-in")
        .upload(filePath, coverFile, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log("___uploadError___", uploadError);

      if (uploadError) throw uploadError;

      coverUrl = client.storage.from("jump-in").getPublicUrl(filePath)
        .data.publicUrl;
    }

    console.log("___created_by___", challengeData.created_by);

    const { data, error } = await client
      .from("challenges")
      .insert({
        name: challengeData.name,
        cover: coverUrl,
        description: challengeData.description,
        guild: challengeData.guild,
        created_by: challengeData.created_by,
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

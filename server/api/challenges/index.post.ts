import { serverSupabaseClient } from "#supabase/server";
import { readMultipartFormData } from "h3";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);

    const formData = await readMultipartFormData(event);

    if (!formData) throw new Error("FormData is empty");

    const challengeData: any = {};
    let fileData: Buffer | null = null;
    let fileType: string | null = null;
    let fileName: string | null = null;

    // Stockez les données du fichier directement
    for (const field of formData) {
      if (field.name === "cover" && field.data) {
        fileData = field.data;
        fileType = field.type ?? null;
        fileName = field.filename ?? null;
        console.log("Cover file info:", {
          fileType,
          fileName,
          size: field.data.length,
        });
      } else {
        if (field.name) {
          challengeData[field.name] = field.data.toString();
          console.log("Field data:", {
            name: field.name,
            value: challengeData[field.name],
          });
        }
      }
    }

    let coverUrl: string | null = null;
    if (fileData) {
      const uniqueFileName = `${Date.now()}-${fileName || "cover"}`;
      const filePath = `challenges/${uniqueFileName}`;

      console.log("Préparation upload:", {
        filePath,
        fileType,
        fileSize: fileData.length,
      });

      const { error: uploadError } = await client.storage
        .from("jump-in")
        .upload(filePath, fileData, {
          contentType: fileType || "application/octet-stream",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      coverUrl = client.storage.from("jump-in").getPublicUrl(filePath)
        .data.publicUrl;
    }

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

    if (error) {
      throw error;
    }

    return { data };
  } catch (error: Error | any) {
    console.error("Erreur détaillée:", {
      message: error.message,
      stack: error.stack,
      // Si c'est une erreur Supabase
      supabaseError: error.error,
      statusCode: error.statusCode,
    });

    return createError({
      statusCode: 500,
      statusMessage: `Erreur: ${error.message}`,
      data: { error: error.message },
    });
  }
});

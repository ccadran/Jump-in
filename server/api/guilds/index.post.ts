import { serverSupabaseClient } from "#supabase/server";
import { readMultipartFormData } from "h3";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    console.log("=== Début du traitement ===");

    const client = await serverSupabaseClient<Database>(event);
    console.log("Supabase client initialisé");

    const formData = await readMultipartFormData(event);
    console.log("FormData reçue:", formData?.length, "champs");

    if (!formData) throw new Error("FormData is empty");

    const guildData: any = {};
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
          guildData[field.name] = field.data.toString();
          console.log("Field data:", {
            name: field.name,
            value: guildData[field.name],
          });
        }
      }
    }

    let coverUrl: string | null = null;
    if (fileData) {
      const uniqueFileName = `${Date.now()}-${fileName || "cover"}`;
      const filePath = `guilds/${uniqueFileName}`;

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
        console.error("Erreur upload:", uploadError);
        throw uploadError;
      }

      console.log("Upload réussi, génération URL publique");

      coverUrl = client.storage.from("jump-in").getPublicUrl(filePath)
        .data.publicUrl;

      console.log("URL générée:", coverUrl);
    }

    console.log("Préparation données guild:", guildData);

    const { data, error } = await client
      .from("guilds")
      .insert({
        name: guildData.name,
        cover: coverUrl || "",
        description: guildData.description,
        owner_id: guildData.owner_id,
      })
      .select();

    if (error) {
      console.error("Erreur insertion BD:", error);
      throw error;
    }

    console.log("Insertion réussie:", data);
    return { data };
  } catch (error: any) {
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

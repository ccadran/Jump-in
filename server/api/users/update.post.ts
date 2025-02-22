import { serverSupabaseClient } from "#supabase/server";
import { readMultipartFormData } from "h3";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    console.log("=== Début de la mise à jour ===");

    const client = await serverSupabaseClient<Database>(event);
    console.log("Supabase client initialisé");

    const formData = await readMultipartFormData(event);
    console.log("FormData reçue:", formData?.length, "champs");

    if (!formData) throw new Error("FormData is empty");

    const userData: Record<string, string> = {};
    let fileData: Buffer | null = null;
    let fileType: string | null = null;
    let fileName: string | null = null;

    // Stockez les données du fichier directement
    for (const field of formData) {
      if (field.name === "profilePicture" && field.data) {
        fileData = field.data;
        fileType = field.type ?? null;
        fileName = field.filename ?? null;
        console.log("Profile picture info:", {
          fileType,
          fileName,
          size: field.data.length,
        });
      } else if (field.name) {
        userData[field.name] = field.data.toString();
        console.log("Field data:", {
          name: field.name,
          value: userData[field.name],
        });
      }
    }

    const { userId, firstName, name, username, description } = userData;

    if (!userId) {
      console.error("User ID manquant");
      throw new Error("User ID is required");
    }

    let profilePictureUrl: string | null = null;
    if (fileData) {
      const uniqueFileName = `${Date.now()}-${fileName || "profile-picture"}`;
      const filePath = `users/${uniqueFileName}`;

      console.log("Préparation upload photo de profil:", {
        filePath,
        fileType,
        fileSize: fileData.length,
      });

      const { error: uploadError } = await client.storage
        .from("jump-in")
        .upload(filePath, fileData, {
          contentType: fileType || "application/octet-stream",
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Erreur upload photo:", uploadError);
        throw uploadError;
      }

      console.log("Upload réussi, génération URL publique");

      profilePictureUrl = client.storage.from("jump-in").getPublicUrl(filePath)
        .data.publicUrl;

      console.log("URL générée:", profilePictureUrl);
    }

    console.log("Préparation mise à jour utilisateur:", {
      userId,
      firstName,
      name,
      hasNewPicture: !!profilePictureUrl,
    });

    const { data, error } = await client
      .from("users")
      .update({
        first_name: firstName,
        name: name,
        username: username,
        description: description,
        ...(profilePictureUrl && { profil_picture: profilePictureUrl }),
      })
      .eq("user_id", userId)
      .select();

    if (error) {
      console.error("Erreur mise à jour utilisateur:", error);
      throw error;
    }

    console.log("Mise à jour utilisateur réussie:", data);
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

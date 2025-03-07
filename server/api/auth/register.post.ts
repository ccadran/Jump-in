import { serverSupabaseClient } from "#supabase/server";
import { readMultipartFormData } from "h3";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);

    const formData = await readMultipartFormData(event);

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

    const { data: authData, error: authError } = await client.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) {
      throw authError;
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
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      profilePictureUrl = client.storage.from("jump-in").getPublicUrl(filePath)
        .data.publicUrl;
    }

    console.log("Préparation données utilisateur:", {
      userId: authData.user?.id,
      firstName: userData.firstName,
      name: userData.name,
    });

    const { data, error } = await client
      .from("users")
      .insert({
        user_id: authData.user!.id,
        first_name: userData.firstName,
        name: userData.name,
        username: userData.username,
        description: userData.description,
        profil_picture: profilePictureUrl,
      })
      .select();

    if (error) {
      throw error;
    }

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

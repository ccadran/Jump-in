import { serverSupabaseClient } from "#supabase/server";
import { readMultipartFormData } from "h3";
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  try {
    // Lire les données envoyées (FormData)
    const formData = await readMultipartFormData(event);
    if (!formData) throw new Error("FormData is empty");

    const userData: Record<string, string> = {};
    let profilePictureFile: File | null = null;

    for (const field of formData) {
      if (field.name === "profilePicture" && field.data) {
        profilePictureFile = new File(
          [field.data],
          field.filename || "profile-picture",
          { type: field.type }
        );
      } else if (field.name) {
        userData[field.name] = field.data.toString();
      }
    }

    const { userId, firstName, name, username, description } = userData;

    if (!userId) {
      throw new Error("User ID is required");
    }

    let profilePictureUrl: string | null = null;
    if (profilePictureFile) {
      const fileName = `${Date.now()}-${profilePictureFile.name}`;
      const filePath = `users/${fileName}`;

      const { error: uploadError } = await client.storage
        .from("jump-in")
        .upload(filePath, profilePictureFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      profilePictureUrl = client.storage.from("jump-in").getPublicUrl(filePath)
        .data.publicUrl;
    }

    // Mise à jour de l'utilisateur dans la base de données
    const { data, error } = await client
      .from("users")
      .update({
        first_name: firstName,
        name: name,
        username: username,
        description: description,
        ...(profilePictureUrl && { profil_picture: profilePictureUrl }), // Ajout seulement si une nouvelle image est uploadée
      })
      .eq("user_id", userId)
      .select();

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error updating user:", error);
    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la mise à jour",
    });
  }
});

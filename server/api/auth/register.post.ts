import { serverSupabaseClient } from "#supabase/server";
import { readMultipartFormData } from "h3"; // Pour lire FormData
import type { Database } from "~/types/supabase";

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  try {
    // Lire les données du formulaire
    const formData = await readMultipartFormData(event);
    if (!formData) throw new Error("FormData is empty");

    // Extraire les données du FormData
    const userData: Record<string, string> = {};
    let profilePictureFile: File | null = null;

    for (const field of formData) {
      if (field.name === "profilePicture" && field.data) {
        // Créer un objet File pour la photo de profil
        profilePictureFile = new File(
          [field.data],
          field.filename || "profile-picture",
          {
            type: field.type,
          }
        );
      } else if (field.name) {
        // Stocker les autres champs dans userData
        userData[field.name] = field.data.toString();
      }
    }

    console.log("User Data:", userData);
    console.log("Profile Picture File:", profilePictureFile);

    const { email, password } = userData;

    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
    });

    // Gestion de l'upload de la photo de profil (si elle existe)
    let profilePictureUrl: string | null = null;
    if (profilePictureFile) {
      const fileName = `${Date.now()}-${profilePictureFile.name}`;
      const filePath = `users/${fileName}`; // Dossier spécifique pour les photos de profil

      // Upload du fichier dans Supabase Storage
      const { error: uploadError } = await client.storage
        .from("jump-in") // Votre bucket
        .upload(filePath, profilePictureFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Générer l'URL publique du fichier
      profilePictureUrl = client.storage.from("jump-in").getPublicUrl(filePath)
        .data.publicUrl;
    }

    // Créer l'utilisateur dans la table "users"
    const { data, error } = await client
      .from("users")
      .insert({
        user_id: authData.user!.id, // Assurez-vous que user_id est fourni
        first_name: userData.firstName,
        name: userData.name,
        username: userData.username,
        description: userData.description,
        profil_picture: profilePictureUrl, // URL de la photo de profil
      })
      .select();

    console.log("_____Data:", data);
    console.log("_____Error:", error);

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

<script lang="ts" setup>
const loading = ref(false);
const errorMsg = ref("");

const form = reactive({
  email: "",
  password: "",
  userData: {
    firstName: "",
    name: "",
    username: "",
    description: "",
    profilePicture: null as File | null, // Modifier pour accepter un fichier
  },
});

async function signIn() {
  try {
    loading.value = true;
    errorMsg.value = "";

    const { data } = useFetch("/api/auth/login", {
      method: "POST",
      body: {
        email: form.email,
        password: form.password,
      },
    });

    if (data.value) {
      navigateTo("/dashboard");
    }
  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
}

async function signUp() {
  try {
    loading.value = true;
    errorMsg.value = "";

    // Créer un FormData pour envoyer les données
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("firstName", form.userData.firstName);
    formData.append("name", form.userData.name);
    formData.append("username", form.userData.username);
    formData.append("description", form.userData.description);

    // Ajouter la photo de profil si elle existe
    if (form.userData.profilePicture) {
      formData.append("profilePicture", form.userData.profilePicture);
    }

    // Envoyer les données via FormData
    const { data } = useFetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    if (data.value) {
      navigateTo("/login");
    }
  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
}

async function signOut() {
  try {
    useFetch("/api/auth/logout", {
      method: "POST",
    });
    navigateTo("/login");
  } catch (error: any) {
    console.error("Logout error:", error);
  }
}

// Gérer l'upload de la photo de profil
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    form.userData.profilePicture = target.files[0];
  }
};
</script>

<template>
  <div>
    <form @submit.prevent="signUp">
      <input v-model="form.email" type="email" placeholder="Email" />
      <input
        v-model="form.password"
        type="password"
        placeholder="Mot de passe"
      />
      <input
        v-model="form.userData.firstName"
        type="text"
        placeholder="Prénom"
      />
      <input v-model="form.userData.name" type="text" placeholder="Nom" />
      <input
        v-model="form.userData.username"
        type="text"
        placeholder="Pseudo"
      />
      <input
        v-model="form.userData.description"
        type="text"
        placeholder="Description"
      />
      <!-- Remplacer l'input texte par un input fichier -->
      <input type="file" @change="handleFileUpload" />
      <button type="submit">S'inscrire</button>
    </form>

    <button @click="signOut">Se déconnecter</button>

    <p v-if="loading">Chargement...</p>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>

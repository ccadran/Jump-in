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
    profilePicture: "",
  },
});

async function signIn() {
  try {
    loading.value = true;
    errorMsg.value = "";

    const { data } = await useFetch("/api/auth/login", {
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

    const { data } = await useFetch("/api/auth/register", {
      method: "POST",
      body: {
        email: form.email,
        password: form.password,
        userData: form.userData,
      },
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
    await useFetch("/api/auth/logout", {
      method: "POST",
    });
    navigateTo("/login");
  } catch (error: any) {
    console.error("Logout error:", error);
  }
}
</script>

<template>
  <div>
    <form @submit="signUp">
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
      <input
        v-model="form.userData.profilePicture"
        type="text"
        placeholder="Photo de profil"
      />
      <button type="submit">S'inscrire</button>
    </form>

    <button @click="signOut">Se déconnecter</button>

    <p v-if="loading">Chargement...</p>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>

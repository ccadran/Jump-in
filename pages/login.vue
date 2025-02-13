<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useFetch, useRouter } from "#imports"; // Import nécessaire

const loading = ref(false);
const errorMsg = ref("");
const isLogin = ref(true); // Etat pour basculer entre la connexion et l'inscription

const form = reactive({
  email: "",
  password: "",
  userData: {
    firstName: "",
    name: "",
    username: "",
    description: "",
    profilePicture: null as File | null,
  },
});

const router = useRouter();

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
      router.push("/dashboard"); // Rediriger vers le tableau de bord après connexion
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

    const formDataToSend = new FormData();
    formDataToSend.append("email", form.email);
    formDataToSend.append("password", form.password);
    formDataToSend.append("firstName", form.userData.firstName);
    formDataToSend.append("name", form.userData.name);
    formDataToSend.append("username", form.userData.username);
    formDataToSend.append("description", form.userData.description);

    if (form.userData.profilePicture) {
      formDataToSend.append("profilePicture", form.userData.profilePicture);
    }

    const { data } = await useFetch("/api/auth/register", {
      method: "POST",
      body: formDataToSend,
    });

    if (data.value) {
      router.push("/login");
    }
  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
}

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    form.userData.profilePicture = target.files[0];
  }
};
</script>

<template>
  <div>
    <!-- Formulaire de connexion -->
    <form v-if="isLogin" @submit="signIn">
      <input v-model="form.email" type="email" placeholder="Email" />
      <input
        v-model="form.password"
        type="password"
        placeholder="Mot de passe"
      />
      <button type="submit">Se connecter</button>
    </form>

    <!-- Formulaire d'inscription -->
    <form v-if="!isLogin" @submit="signUp">
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
      <input type="file" @change="handleFileUpload" accept="image/*" />
      <button type="submit">S'inscrire</button>
    </form>

    <!-- Bouton pour basculer entre l'inscription et la connexion -->
    <p @click="toggleForm">
      {{
        isLogin
          ? "Vous n'avez pas de compte ? S'inscrire"
          : "Vous avez déjà un compte ? Se connecter"
      }}
    </p>

    <p v-if="loading">Chargement...</p>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>

<style lang="scss"></style>

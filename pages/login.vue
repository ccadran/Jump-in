<script lang="ts" setup>
const loading = ref(false);
const errorMsg = ref("");

const formIn = reactive({
  email: "",
  password: "",
});

async function signIn(e: Event) {
  e.preventDefault();
  try {
    loading.value = true;
    errorMsg.value = "";

    const { data } = useFetch("/api/auth/login", {
      method: "POST",
      body: {
        email: formIn.email,
        password: formIn.password,
      },
    });

    await navigateTo("/");
  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
}

const logUser = () => {
  const user = useSupabaseUser();
  console.log(user.value);
};

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

async function signUp() {
  try {
    loading.value = true;
    errorMsg.value = "";

    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("firstName", form.userData.firstName);
    formData.append("name", form.userData.name);
    formData.append("username", form.userData.username);
    formData.append("description", form.userData.description);

    if (form.userData.profilePicture) {
      formData.append("profilePicture", form.userData.profilePicture);
    }

    const { data } = useFetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    if (data.value) {
      // Réinitialiser les champs du formulaire
      form.email = "";
      form.password = "";
      form.userData.firstName = "";
      form.userData.name = "";
      form.userData.username = "";
      form.userData.description = "";
      form.userData.profilePicture = null;

      wantRegister.value = false;
      navigateTo("/login");
    }
  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
}

const wantRegister = ref(false);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    form.userData.profilePicture = target.files[0];
  }
};
</script>

<template>
  <div v-if="!wantRegister">
    <!-- Formulaire de connexion -->
    <form @submit="signIn">
      <input v-model="formIn.email" type="email" placeholder="Email" />
      <input
        v-model="formIn.password"
        type="password"
        placeholder="Mot de passe"
      />
      <button type="submit">Se connecter</button>
    </form>
  </div>

  <div v-if="wantRegister">
    <!-- Formulaire d'inscription -->
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
      <input type="file" @change="handleFileUpload" />
      <button type="submit">S'inscrire</button>
    </form>
  </div>

  <h1 @click="wantRegister = !wantRegister">
    {{ wantRegister ? "Retour à la connexion" : "S'inscrire" }}
  </h1>

  <p v-if="loading">Chargement...</p>
  <p v-if="errorMsg">{{ errorMsg }}</p>
</template>

<style lang="scss"></style>

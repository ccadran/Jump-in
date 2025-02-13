<script lang="ts" setup>
const loading = ref(false);
const errorMsg = ref("");

const form = reactive({
  email: "",
  password: "",
});
async function signIn(e: Event) {
  e.preventDefault();
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
</script>

<template>
  <div>
    <form @submit="signIn">
      <input v-model="form.email" type="email" placeholder="Email" />
      <input
        v-model="form.password"
        type="password"
        placeholder="Mot de passe"
      />
      <button type="submit">Se connecter</button>
    </form>
  </div>
  <h1 @click="logUser">USER</h1>

  <p v-if="loading">Chargement...</p>
  <p v-if="errorMsg">{{ errorMsg }}</p>
</template>

<style lang="scss"></style>

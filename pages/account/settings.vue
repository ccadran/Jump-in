<script lang="ts" setup>
definePageMeta({
  layout: "account",
});

const user = useSupabaseUser();
interface UserData {
  first_name: string;
  name: string;
  username: string;
  description: string;
}

const { data: userData } = useFetch<UserData>(`/api/users/${user.value?.id}`, {
  key: "userData",
});
console.log(userData);

const form = reactive({
  firstName: "",
  name: "",
  username: "",
  description: "",
  profilePicture: null as File | null, // Modifier pour accepter un fichier
});

watch(
  userData,
  (newUserData) => {
    if (newUserData) {
      form.firstName = newUserData.first_name || "";
      form.name = newUserData.name || "";
      form.username = newUserData.username || "";
      form.description = newUserData.description || "";
    }
  },
  { immediate: true }
);
async function updateUser() {
  try {
    // Créer un FormData pour envoyer les données
    const formData = new FormData();
    formData.append("userId", user.value?.id || "");
    formData.append("firstName", form.firstName);
    formData.append("name", form.name);
    formData.append("username", form.username);
    formData.append("description", form.description);

    // Ajouter la photo de profil si elle existe
    if (form.profilePicture) {
      formData.append("profilePicture", form.profilePicture);
    }

    const { data } = useFetch("/api/users/update", {
      method: "POST",
      body: formData,
    });

    if (data.value) {
      navigateTo("/login");
    }
  } catch (error: any) {}
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    form.profilePicture = target.files[0];
  }
};
</script>

<template>
  <button @click="$router.back()">Back</button>
  <form @submit.prevent="updateUser">
    <input v-model="form.firstName" type="text" placeholder="Prénom" />
    <input v-model="form.name" type="text" placeholder="Nom" />
    <input v-model="form.username" type="text" placeholder="Pseudo" />
    <input v-model="form.description" type="text" placeholder="Description" />

    <input type="file" @change="handleFileUpload" />
    <button type="submit">Update</button>
  </form>
</template>

<style lang="scss"></style>

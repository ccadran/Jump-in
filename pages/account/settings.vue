<script lang="ts" setup>
import type { UserData } from "~/types/api";

definePageMeta({
  layout: "account",
});

const user = useSupabaseUser();

const { data: userData } = useFetch<UserData>(`/api/users/${user.value?.id}`, {
  key: "userData",
});

console.log(userData.value);

const form = reactive({
  firstName: "",
  name: "",
  username: "",
  description: "",
  profilePicture: null as File | null,
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

    if (form.profilePicture) {
      formData.append("profilePicture", form.profilePicture);
    }

    const { data } = useFetch("/api/users/update", {
      method: "POST",
      body: formData,
    });
  } catch (error: any) {}
}

const logout = async () => {
  try {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
    navigateTo("/login");
  } catch (error) {
    console.error("Erreur de déconnexion", error);
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    form.profilePicture = target.files[0];
  }
};
</script>

<template>
  <div class="back" @click="$router.back()">
    <img src="/icons/back.svg" alt="" />
  </div>
  <div class="settings-page">
    <div class="global-hero">
      <h1>SETTINGS</h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde magni
        necessitatibus distinctio! Consectetur aut necessitatibus deleniti natus
        enim sapiente illo saepe voluptatem dignissimos, optio a.
      </p>
    </div>

    <form @submit.prevent="updateUser">
      <div class="form-part">
        <label for="">First name</label>
        <input v-model="form.firstName" type="text" placeholder="Prénom" />
      </div>
      <div class="form-part">
        <label for="">Name</label>
        <input v-model="form.name" type="text" placeholder="Nom" />
      </div>
      <div class="form-part">
        <label for="">Username</label>
        <input v-model="form.username" type="text" placeholder="Pseudo" />
      </div>
      <div class="form-part">
        <label for="">Description</label>
        <input
          v-model="form.description"
          type="text"
          placeholder="Description"
        />
      </div>
      <div class="form-part">
        <label for="">Profil picture</label>
        <div class="profil-picture-container">
          <img :src="userData?.profil_picture" alt="Profile picture" />
        </div>
        <input type="file" @change="handleFileUpload" />
      </div>
      <UiButton text="Update" type="submit" size="large" />
    </form>
    <UiButton
      text="Disconnect"
      size="large"
      color="red"
      class="disconnect"
      @click="logout"
    />
  </div>
</template>

<style lang="scss">
.settings-page {
  padding: 32px 20px 92px;

  form {
    margin-bottom: 12px;
    .form-part {
      > .profil-picture-container {
        height: 70px;
        width: 70px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>

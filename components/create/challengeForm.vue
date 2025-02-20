<script lang="ts" setup>
import type { Guilds } from "~/types/api";

const user = useSupabaseUser();

const formData = ref({
  name: "",
  cover: null as File | null,
  description: "",
  guild: "",
});

const { data: dataGuilds } = useFetch<Guilds[]>("/api/guilds", {
  key: "guilds",
});

const handleChallengeSubmit = async (e: Event) => {
  e.preventDefault();

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.value.name);
  formDataToSend.append("description", formData.value.description);
  formDataToSend.append("guild", formData.value.guild);
  formDataToSend.append("created_by", user.value?.id || "");

  console.log(user.value?.id);

  if (formData.value.cover) {
    formDataToSend.append("cover", formData.value.cover); // Ajouter le fichier
  }

  try {
    const response = await $fetch("/api/challenges", {
      method: "POST",
      body: formDataToSend,
    });
    console.log("Response", response);

    refreshNuxtData("challenges");

    formData.value = {
      name: "",
      cover: null,
      description: "",
      guild: "",
    };

    (document.querySelector('input[type="file"]') as HTMLInputElement).value =
      "";
  } catch (error) {
    console.error("Erreur:", error);
  }
};
const handleFileUpload = (event: Event) => {
  console.log("____test");

  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    formData.value.cover = target.files[0];
    console.log("File", formData.value.cover);
  }
};
</script>

<template>
  <form @submit="handleChallengeSubmit" class="challenge-form">
    <div class="form-part">
      <label for="">Guild</label>
      <select v-model="formData.guild" id="guild">
        <option value="" disabled selected>Select a guild</option>
        <option v-for="guild in dataGuilds" :key="guild.id" :value="guild.id">
          {{ guild.name }}
        </option>
      </select>
    </div>
    <div class="form-part">
      <label for="">Name</label>
      <input
        v-model="formData.name"
        type="text"
        placeholder="Name of the challenge"
      />
    </div>
    <div class="form-part">
      <label for="">Description</label>
      <input
        v-model="formData.description"
        type="text"
        placeholder="Description of the challenge"
      />
    </div>
    <div class="form-part">
      <label for="">Cover</label>
      <input type="file" @change="handleFileUpload" />
    </div>
    <UiButton text="Create challenge" type="submit" size="large" />
  </form>
</template>

<style lang="scss">
.challenge-form {
  display: flex;
  flex-direction: column;
  gap: 24px;

  > .cta {
    margin-top: 32px;
    margin-left: auto;
  }
}
</style>

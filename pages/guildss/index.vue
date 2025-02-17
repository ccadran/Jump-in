<script lang="ts" setup>
import type { Guilds } from "~/types/api";

const user = useSupabaseUser();

const formData = ref({
  name: "",
  cover: null as File | null,
  description: "",
});

const deleteGuild = async (id: string) => {
  try {
    const response = await fetch(`/api/guilds/${id}`, {
      method: "DELETE",
    });

    if (guilds.value) {
      guilds.value = guilds.value.filter((guild) => guild.id !== id);
    }
  } catch (error) {
    console.error(error);
  }
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  console.log("____formData", formData.value);

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.value.name);
  formDataToSend.append("description", formData.value.description);
  formDataToSend.append("owner_id", user.value?.id || "");

  if (formData.value.cover) {
    formDataToSend.append("cover", formData.value.cover); // Add the file
  }

  try {
    const response = await $fetch("/api/guilds", {
      method: "POST",
      body: formDataToSend,
    });
    console.log("Response", response);

    refreshNuxtData("guilds");

    formData.value = {
      name: "",
      cover: null,
      description: "",
    };

    (document.querySelector('input[type="file"]') as HTMLInputElement).value =
      "";
  } catch (error) {
    console.error("Erreur:", error);
  }
};

const { data: guilds, error } = useFetch<Guilds[]>("/api/guilds", {
  key: "guilds",
});

const joinGuild = async (guildId: string) => {
  try {
    const response = await $fetch(`/api/users/guilds`, {
      method: "POST",
      body: { userId: user.value!.id, guildId: guildId },
    });
    console.log("Ajouté à la guilde", response);
  } catch (error) {
    console.error("Erreur d'ajout", error);
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
  <form @submit="handleSubmit">
    <input v-model="formData.name" type="text" placeholder="Nom" />
    <input type="file" @change="handleFileUpload" />
    <input
      v-model="formData.description"
      type="text"
      placeholder="Description"
    />
    <button type="submit">Envoyer</button>
  </form>

  <div class="guilds">
    <div class="guild" v-for="guild in guilds" :key="guild.id">
      <h2>{{ guild.name }}</h2>
      <img :src="guild.cover" alt="cover" />
      <p>{{ guild.description }}</p>
      <h1 @click="joinGuild(guild.id)">Add to my guild</h1>

      <p @click="deleteGuild(guild.id)">Delete</p>
    </div>
  </div>
</template>

<style lang="scss">
.guild {
  > img {
    max-width: 300px;
  }
}
</style>

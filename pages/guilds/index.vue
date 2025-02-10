<script lang="ts" setup>
import type { Guilds } from "~/types/api";

const formData = ref({
  name: "",
  cover: "",
  description: "",
});
const user = useSupabaseUser();
const deleteGuild = async (id: string) => {
  try {
    const response = await fetch(`/api/guilds/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    if (guilds.value) {
      guilds.value = guilds.value.filter((guild) => guild.id !== id);
    }
  } catch (error) {
    console.error(error);
  }
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  console.log("formData", formData.value);

  try {
    const response = await $fetch("/api/guilds", {
      method: "POST",
      body: {
        owner_id: user.value?.id,
        guildData: formData.value,
      },
    });

    refreshNuxtData("guilds");

    formData.value = {
      name: "",
      cover: "",
      description: "",
    };
  } catch (error) {
    console.error("Erreur:", error);
  }
};

const { data: guilds, error } = useFetch<Guilds[]>("/api/guilds", {
  key: "guilds",
});

async function joinGuild(guildId: string) {
  try {
    const response = await $fetch(`/api/guilds/${guildId}/user`, {
      method: "POST",
      body: { user_id: user.value!.id },
    });
    console.log("Ajouté à la guilde", response);
  } catch (error) {
    console.error("Erreur d'ajout", error);
  }
}
</script>

<template>
  <form @submit="handleSubmit">
    <input v-model="formData.name" type="text" placeholder="Nom" />
    <input v-model="formData.cover" type="text" placeholder="Cover" />
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

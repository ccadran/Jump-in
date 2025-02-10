<script lang="ts" setup>
import type { Challenge } from "~/types/api";

const formData = ref({
  name: "",
  cover: "",
  description: "",
  guild: "",
});

const deleteChallenge = async (id: string) => {
  try {
    const response = await fetch(`/api/challenge/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    if (challenges.value) {
      challenges.value = challenges.value.filter(
        (challenge) => challenge.id !== id
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  console.log("formData", formData.value);

  try {
    const response = await $fetch("/api/challenge", {
      method: "POST",
      body: formData.value,
    });

    refreshNuxtData("challenges");

    formData.value = {
      name: "",
      cover: "",
      description: "",
      guild: "",
    };
  } catch (error) {
    console.error("Erreur:", error);
  }
};

const { data: challenges, error } = useFetch<Challenge[]>("/api/challenge", {
  key: "challenges",
});
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
    <input v-model="formData.guild" type="text" placeholder="Guilde" />
    <button type="submit">Envoyer</button>
  </form>

  <div class="challenges">
    <div v-for="challenge in challenges" :key="challenge.id">
      <h2>{{ challenge.name }}</h2>
      <img :src="challenge.cover" alt="cover" />
      <p>{{ challenge.description }}</p>
      <p>{{ challenge.guild }}</p>
      <p @click="deleteChallenge(challenge.id)">Delete</p>
    </div>
  </div>
</template>

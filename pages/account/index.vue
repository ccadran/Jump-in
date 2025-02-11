<script lang="ts" setup>
import type { Guilds } from "~/types/api";

const user = useSupabaseUser();

const { data, error } = await useFetch<Guilds[]>(
  `/api/users/guilds/${user.value!.id}`,
  {
    key: "guilds",
  }
);
const { data: savedChallenge } = await useFetch<Guilds[]>(
  `/api/users/challenges/save/${user.value!.id}`,
  {
    key: "saved_challenges",
  }
);

async function leaveGuild(guildId: string) {
  try {
    const response = await $fetch(`/api/users/guilds`, {
      method: "DELETE",
      body: { userId: user.value!.id, guildId: guildId },
    });
    console.log("Retiré de la guilde", response);
    refreshNuxtData("guilds");
  } catch (error) {
    console.error("Erreur de suppression", error);
  }
}
async function deleteChallengeSaved(challenge_id: string) {
  try {
    const response = await $fetch(`/api/users/challenges/save`, {
      method: "DELETE",
      body: { userId: user.value!.id, challenge_id: challenge_id },
    });

    refreshNuxtData("saved_challenges");
  } catch (error) {
    console.error("Erreur de suppression", error);
  }
}
</script>

<template>
  <div>
    <h1>Mon compte</h1>
    <h2>Mes guildes</h2>
    <ul>
      <li v-for="guild in data" :key="guild.id">
        <p>{{ guild.name }}</p>
        <button @click="leaveGuild(guild.id)">Quitter</button>
      </li>
    </ul>
    <ul>
      <li v-for="challenge in savedChallenge" :key="challenge.id">
        <p>{{ challenge.name }}</p>
        <button @click="deleteChallengeSaved(challenge.id)">Supprimer</button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss"></style>

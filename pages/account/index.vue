<script lang="ts" setup>
import type { Guilds } from "~/types/api";

const user = useSupabaseUser();
console.log("User", user.value);

const { data, error } = await useFetch<Guilds[]>(
  `/api/users/${user.value!.id}/guilds`,
  {
    key: "guilds",
  }
);

console.log(data.value);

async function leaveGuild(guildId: string) {
  try {
    const response = await useFetch(
      `/api/guilds/${guildId}/${user.value!.id}`,
      {
        method: "DELETE",
      }
    );
    console.log("Retiré de la guilde", response);
    refreshNuxtData("guilds");
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
  </div>
</template>

<style lang="scss"></style>

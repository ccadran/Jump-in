<script lang="ts" setup>
import type {
  Challenges,
  CompleteChallenges,
  Guilds,
  UserData,
} from "~/types/api";

const user = useSupabaseUser();

const { data, error } = useFetch<Guilds[]>(
  `/api/users/guilds/${user.value!.id}`,
  {
    key: "guilds",
  }
);
const { data: savedChallenge } = useFetch<Challenges[]>(
  `/api/users/challenges/save/${user.value!.id}`,
  {
    key: "saved_challenges",
  }
);

const { data: completeChallenges } = useFetch<CompleteChallenges[]>(
  `/api/users/challenges/complete/${user.value!.id}`,
  {
    key: "complete_challenges",
  }
);

const { data: userData } = useFetch<UserData>(`/api/users/${user.value!.id}`, {
  key: "user_data",
});

async function leaveGuild(guildId: string) {
  try {
    const response = await $fetch(`/api/users/guilds`, {
      method: "DELETE",
      body: { userId: user.value!.id, guildId: guildId },
    });

    refreshNuxtData("guilds");
  } catch (error) {}
}
async function deleteChallengeSaved(challenge_id: string) {
  try {
    const response = await $fetch(`/api/users/challenges/save`, {
      method: "DELETE",
      body: { userId: user.value!.id, challenge_id: challenge_id },
    });

    refreshNuxtData("saved_challenges");
  } catch (error) {}
}
async function deleteCompletedChallenge(id: string) {
  try {
    const response = await $fetch(`/api/users/challenges/complete`, {
      method: "DELETE",
      body: { userId: user.value!.id, id: id },
    });

    refreshNuxtData("complete_challenges");
  } catch (error) {}
}

const logout = async () => {
  try {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
    navigateTo("/login");
  } catch (error) {}
};
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
    <h2>Challenge saved</h2>
    <ul>
      <li v-for="challenge in savedChallenge" :key="challenge.id">
        <p>{{ challenge.name }}</p>
        <button @click="deleteChallengeSaved(challenge.id)">Supprimer</button>
      </li>
    </ul>
    <h2>Challenge complete</h2>
    <ul>
      <li v-for="challenge in completeChallenges" :key="challenge.id">
        <p>{{ challenge.title }}</p>
        <button @click="deleteCompletedChallenge(challenge.id)">
          Supprimer
        </button>
      </li>
    </ul>
    <img :src="userData!.profil_picture" alt="" />
    <button @click="logout">se déconnecter</button>
  </div>
</template>

<style lang="scss"></style>

<script lang="ts" setup>
import type { Challenges, Guilds } from "~/types/api";

const user = useSupabaseUser();
const route = useRoute();
const guildId = route.params.id;
const isMember = ref(false);

const { data: guildData, error } = await useFetch<Guilds>(
  `/api/guilds/${guildId}`,
  {
    key: "guild",
  }
);

const { data: challengesData, error: challengesError } = await useFetch<
  Challenges[]
>(`/api/guilds/challenge/${guildId}`, {
  key: "challenges",
});

const { data: countMember } = await useFetch(`/api/guilds/count/${guildId}`, {
  key: "countMember",
});

try {
  const response = await $fetch(`/api/users/guilds/check`, {
    method: "POST",
    body: { userId: user.value!.id, guildId: guildId },
  });
  isMember.value = typeof response === "boolean" ? response : false;
} catch (error) {
  console.error("Erreur de vérification d'adhésion", error);
}

const joinGuild = async (guildId: string) => {
  try {
    const response = await $fetch(`/api/users/guilds`, {
      method: "POST",
      body: { userId: user.value!.id, guildId: guildId },
    });
    console.log("Ajouté à la guilde", response);
    isMember.value = true;
  } catch (error) {
    console.error("Erreur d'ajout", error);
  }
};

async function leaveGuild(guildId: string) {
  try {
    const response = await $fetch(`/api/users/guilds`, {
      method: "DELETE",
      body: { userId: user.value!.id, guildId: guildId },
    });
    console.log("Retiré de la guilde", response);
    isMember.value = false;
    refreshNuxtData("guilds");
  } catch (error) {
    console.error("Erreur de suppression", error);
  }
}
</script>

<template>
  <div class="cover">
    <img :src="guildData?.cover" alt="" />
  </div>
  <div class="hero">
    <div class="header">
      <h1>{{ guildData!.name }}</h1>
      <UiButton
        v-if="!isMember"
        text="Join"
        color="blue"
        @click="joinGuild(guildData!.id)"
      />
      <UiButton
        v-if="isMember"
        text="Leave"
        color="blue"
        @click="leaveGuild(guildData!.id)"
      />
    </div>
    <p class="members">{{ `${countMember?.userCount} members` }}</p>
    <p>{{ guildData!.description }}</p>
    <div class="ranking-challenge">
      <a class="link" href="">Voir le classement</a>
      <UiButton text="New challenge +" />
    </div>
    <div class="filters">
      <input type="search" name="find" id="" />
      <p>Newest</p>
    </div>
  </div>
  <div class="challenges-container">
    <ChallengeCard v-for="challenge in challengesData" :data="challenge" />
  </div>
</template>

<style lang="scss">
.cover {
  height: 200px;
  width: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.hero {
  padding: 0 20px;
  margin-top: 18px;

  > .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  > .members {
    font-size: 10px;
    line-height: 100%;
    margin-bottom: 24px;
  }
  > .ranking-challenge {
    margin-top: 18px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  > .filters {
    margin-top: 24px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    & > input {
      border-radius: 8px;
      border: 1px solid var(--dark);
      width: 185px;
      height: 25px;
    }
  }
}
.challenges-container {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}
</style>

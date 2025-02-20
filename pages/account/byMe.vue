<script lang="ts" setup>
import type { Challenges, Guilds } from "~/types/api";
definePageMeta({
  layout: "account",
});
const user = useSupabaseUser();
const showMyGuilds = ref(true);

const handleSwitchChange = (side: "left" | "right") => {
  showMyGuilds.value = side === "left";
  searchQuery.value = "";
};

const { data: createdGuilds } = useFetch<Guilds[]>(
  `/api/users/guilds/created/${user.value?.id}`,
  {
    key: "createdGuilds",
  }
);

const { data: createdChallenge } = useFetch<Challenges[]>(
  `/api/users/challenges/created/${user.value?.id}`,
  {
    key: "createdChallenge",
  }
);
const handleGuildDelete = () => {
  refreshNuxtData("createdGuilds");
};
const handleChallengeDelete = () => {
  refreshNuxtData("createdChallenge");
};

const searchQuery = ref("");
const filteredGuilds = computed(() => {
  if (!searchQuery.value) return createdGuilds.value || [];
  return (createdGuilds.value || []).filter((guild) =>
    guild.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
const filteredChallenges = computed(() => {
  if (!searchQuery.value) return createdChallenge.value || [];
  return (createdChallenge.value || []).filter((challenge) =>
    challenge.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <NuxtLayout title="created by me" description="created by me page">
    <div class="byMe-page">
      <UiSwitch
        leftText="Guilds"
        rightText="Challenges"
        @switchChange="handleSwitchChange"
      />
      <div class="filters">
        <input v-model="searchQuery" type="search" name="find" />
        <p>Newest</p>
      </div>
      <div class="cards-container">
        <div v-if="showMyGuilds" class="guilds-container">
          <AccountCreatedGuildCard
            v-for="guild in filteredGuilds"
            :key="guild.id"
            :data="guild"
            @guildDeleted="handleGuildDelete"
          />
        </div>
        <div v-if="!showMyGuilds" class="challenges-container">
          <AccountCreatedChallengeCard
            v-for="challenge in filteredChallenges"
            :key="challenge.id"
            :data="challenge"
            @challengeDeleted="handleChallengeDelete"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss">
.byMe-page {
  > .cards-container {
    > .guilds-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    > .challenges-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
  }
}
</style>

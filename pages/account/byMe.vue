<script lang="ts" setup>
import type { Challenges, Guilds } from "~/types/api";
definePageMeta({
  layout: "account",
});
const user = useSupabaseUser();
const showMyGuilds = ref(true);

const handleSwitchChange = (side: "left" | "right") => {
  showMyGuilds.value = side === "left";
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
        <input type="search" name="find" id="" />
        <p>Newest</p>
      </div>
      <div class="cards-container">
        <div v-if="showMyGuilds" class="guilds-container">
          <AccountCreatedGuildCard
            v-for="guild in createdGuilds"
            :key="guild.id"
            :data="guild"
            @guildDeleted="handleGuildDelete"
          />
        </div>
        <div v-if="!showMyGuilds" class="challenges-container">
          <AccountCreatedChallengeCard
            v-for="challenge in createdChallenge"
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

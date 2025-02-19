<script lang="ts" setup>
import type { Challenges } from "~/types/api";

definePageMeta({
  layout: "account",
});
const user = useSupabaseUser();

const { data: userChallengesSaved } = useFetch<Challenges[]>(
  `/api/users/challenges/save/${user.value?.id}`,
  {
    key: "userChallengesSaved",
  }
);
</script>

<template>
  <NuxtLayout title="Challenge saved" description="Challenge saved page">
    <div class="saved-page">
      <div class="filters">
        <input type="search" name="find" id="" />
        <p>Newest</p>
      </div>
      <div class="saved-challenges-container">
        <AccountSavedChallengeCard
          v-for="challenge in userChallengesSaved"
          :key="challenge.id"
          :data="challenge"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss">
.saved-page {
  > .saved-challenges-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>

<script lang="ts" setup>
import type { Challenges } from "~/types/api";

definePageMeta({
  layout: "account",
});
const user = useSupabaseUser();
const searchQuery = ref("");

const { data: userChallengesSaved } = useFetch<Challenges[]>(
  `/api/users/challenges/save/${user.value?.id}`,
  {
    key: "userChallengesSaved",
  }
);

const filteredChallengesSaved = computed(() => {
  if (!searchQuery.value) return userChallengesSaved.value || [];
  return (userChallengesSaved.value || []).filter((challenge) =>
    challenge.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <NuxtLayout title="Challenge saved" description="Challenge saved page">
    <div class="saved-page">
      <div class="filters">
        <input v-model="searchQuery" type="search" name="find" />
        <p>Newest</p>
      </div>
      <div class="saved-challenges-container">
        <AccountSavedChallengeCard
          v-for="challenge in filteredChallengesSaved"
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

<script lang="ts" setup>
import type { CompleteChallenges } from "~/types/api";
definePageMeta({
  layout: "account",
});
const user = useSupabaseUser();
const searchQuery = ref("");

const { data: memberChallengeComplete } = useFetch<CompleteChallenges[]>(
  `/api/users/challenges/complete/${user.value?.id}`,
  {
    key: "memberChallengeComplete",
  }
);

const filteredChallengesComplete = computed(() => {
  if (!searchQuery.value) return memberChallengeComplete.value || [];
  return (memberChallengeComplete.value || []).filter((challenge) =>
    challenge.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <NuxtLayout
    title="Challenge completed"
    description="Challenge completed page"
  >
    <div class="completed-page">
      <div class="filters">
        <input v-model="searchQuery" type="search" name="find" />
        <p>Newest</p>
      </div>
      <div class="challenges-completed-container">
        <AccountCompletedChallengeCard
          v-for="challenge in filteredChallengesComplete"
          :key="challenge.id"
          :data="challenge"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss">
.completed-page {
  > .challenges-completed-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
}
</style>

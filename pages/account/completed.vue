<script lang="ts" setup>
import type { CompleteChallenges } from "~/types/api";
definePageMeta({
  layout: "account",
});
const user = useSupabaseUser();
const searchQuery = ref("");
const sortOrder = ref<"newest" | "oldest">("newest"); // Par défaut, tri du plus récent au plus ancien
const sortOptions = ref<HTMLElement | null>(null);

const { data: memberChallengeComplete } = useFetch<CompleteChallenges[]>(
  `/api/users/challenges/complete/${user.value?.id}`,
  {
    key: "memberChallengeComplete",
  }
);

const filteredChallengesComplete = computed(() => {
  let result = memberChallengeComplete.value || [];

  // Filtrage par nom
  if (searchQuery.value) {
    result = result.filter((guild) =>
      guild.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Tri par date de création
  return result.sort((a, b) => {
    return sortOrder.value === "newest"
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
});
const toggleSortOptions = () => {
  if (sortOptions.value) {
    sortOptions.value.classList.toggle("open");
  }
};
const switchSortValue = (value: "newest" | "oldest") => {
  sortOrder.value = value;
  toggleSortOptions();
};
</script>

<template>
  <NuxtLayout
    title="Challenge completed"
    description="Challenge completed page"
  >
    <div class="completed-page">
      <div class="filters">
        <input
          v-model="searchQuery"
          type="search"
          name="find"
          placeholder="Search..."
        />
        <div class="sort-results-container">
          <div class="sort-values" @click="toggleSortOptions">
            <p>{{ sortOrder === "newest" ? "Newest" : "Oldest" }}</p>
            <img src="/icons/chevron.svg" alt="Sort options" />
          </div>
          <div class="sorts-options" ref="sortOptions">
            <p
              @click="switchSortValue('oldest')"
              :class="{ active: sortOrder === 'oldest' }"
            >
              Oldest
            </p>
            <p
              @click="switchSortValue('newest')"
              :class="{ active: sortOrder === 'newest' }"
            >
              Newest
            </p>
          </div>
        </div>
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

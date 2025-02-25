<script lang="ts" setup>
import type { Challenges } from "~/types/api";

definePageMeta({
  layout: "account",
});
const user = useSupabaseUser();
const searchQuery = ref("");
const sortOrder = ref<"newest" | "oldest">("newest"); // Par défaut, tri du plus récent au plus ancien
const sortOptions = ref<HTMLElement | null>(null);

const { data: userChallengesSaved } = useFetch<Challenges[]>(
  `/api/users/challenges/save/${user.value?.id}`,
  {
    key: "userChallengesSaved",
  }
);

const filteredChallengesSaved = computed(() => {
  let result = userChallengesSaved.value || [];

  // Filtrage par nom
  if (searchQuery.value) {
    result = result.filter((guild) =>
      guild.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
const test = () => {
  console.log("test");
};
</script>

<template>
  <NuxtLayout
    title="Challenge saved"
    description="Here are the challenges you've saved? Complete them at your own pace and track your progress!"
  >
    <div class="saved-page">
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
      <div class="saved-challenges-container">
        <AccountSavedChallengeCard
          v-for="challenge in filteredChallengesSaved"
          :key="challenge.id"
          :data="challenge"
          @refresh="refreshNuxtData('userChallengesSaved')"
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

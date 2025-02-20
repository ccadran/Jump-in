<script lang="ts" setup>
import { ActivityCard, ChallengeCard } from "#components";
import type { Challenges } from "~/types/api";

const user = useSupabaseUser();
const searchQuery = ref("");
const sortOrder = ref<"newest" | "oldest">("newest"); // Par défaut, tri du plus récent au plus ancien
const sortOptions = ref<HTMLElement | null>(null);

const { data: activitiesData, error: activitiesError } = useFetch<Challenges[]>(
  `/api/activity/${user.value?.id}`,
  {
    key: "activities",
  }
);

const filteredActivities = computed(() => {
  let result = activitiesData.value || [];

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
</script>

<template>
  <div class="activity-page">
    <div class="global-hero">
      <h1>Home</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus eos
        rerum aliquam dignissimos nulla soluta quasi dolor totam similique. Eos
        repellendus veniam soluta veritatis quis!
      </p>
    </div>
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
    <div class="activity-challenges-container">
      <ActivityCard v-for="activity in filteredActivities" :data="activity" />
    </div>
  </div>
</template>

<style lang="scss">
.activity-page {
  padding: 0 20px;

  > .activity-challenges-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 32px;
  }
}
</style>

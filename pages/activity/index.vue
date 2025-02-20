<script lang="ts" setup>
import { ActivityCard, ChallengeCard } from "#components";
import type { Challenges } from "~/types/api";

const user = useSupabaseUser();
const searchQuery = ref("");

const { data: activitiesData, error: activitiesError } = useFetch<Challenges[]>(
  `/api/activity/${user.value?.id}`,
  {
    key: "activities",
  }
);

const filteredActivities = computed(() => {
  if (!searchQuery.value) return activitiesData.value || [];
  return (activitiesData.value || []).filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
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
      <input v-model="searchQuery" type="search" name="find" />
      <p>Newest</p>
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

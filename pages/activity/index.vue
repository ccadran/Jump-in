<script lang="ts" setup>
import { ActivityCard, ChallengeCard } from "#components";
import type { Challenges } from "~/types/api";

const user = useSupabaseUser();

const { data: activitiesData, error: activitiesError } = useFetch<Challenges[]>(
  `/api/activity/${user.value?.id}`,
  {
    key: "activities",
  }
);

console.log(activitiesData);
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
      <input type="search" name="find" id="" />
      <p>Newest</p>
    </div>
    <div class="activity-challenges-container">
      <ActivityCard v-for="activity in activitiesData" :data="activity" />
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

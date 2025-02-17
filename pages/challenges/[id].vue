<script lang="ts" setup>
import type { Challenges, CompleteChallenges } from "~/types/api";

const route = useRoute();
const challengeId = route.params.id;

const { data: challengeData, error } = await useFetch<Challenges>(
  `/api/challenges/${challengeId}`,
  {
    key: "challenge",
  }
);

const { data: challengesCompleteData, error: challengesCompleteError } =
  await useFetch<CompleteChallenges[]>(
    `/api/challenges/complete/${challengeId}`,
    {
      key: "challengesComplete",
    }
  );
console.log("____challengeData", challengeData);
</script>

<template>
  <div class="cover">
    <img :src="challengeData!.cover" alt="" />
  </div>
  <div class="hero">
    <div class="header">
      <h3>{{ challengeData!.name }}</h3>
      <p class="link">save it</p>
    </div>
    <div class="description">{{ challengeData!.description }}</div>
    <div class="data-complete">
      <p>24 complete - 53 save</p>
      <UiButton text="complete" color="blue" />
    </div>
    <div class="filters">
      <input type="search" name="find" id="" />
      <p>Newest</p>
    </div>
  </div>
  <div class="challenges-complete-container"></div>
</template>

<style lang="scss">
body {
  padding: 0;
}
.cover {
  width: 100%;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.hero {
  padding: 0 20px;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  > .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    // margin: 22px 0;
  }
  > .data-complete {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  > .filters {
    margin-top: 24px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    & > input {
      border-radius: 8px;
      border: 1px solid var(--dark);
      width: 185px;
      height: 25px;
    }
  }
}
.challenges-complete-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>

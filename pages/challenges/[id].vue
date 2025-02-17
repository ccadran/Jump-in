<script lang="ts" setup>
import type { Challenges } from "~/types/api";

const route = useRoute();
const challengeId = route.params.id;

const { data: challengeData, error } = await useFetch<Challenges>(
  `/api/challenges/${challengeId}`,
  {
    key: "challenge",
  }
);
console.log("____challengeData", challengeData);
</script>

<template>
  <div>
    <h1>PAGE D'UN CHALLENGE</h1>
  </div>
</template>

<style lang="scss"></style>

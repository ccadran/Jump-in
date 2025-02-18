<script lang="ts" setup>
import type { CompleteChallenges } from "~/types/api";

interface challengeCompleteCardProps {
  data: CompleteChallenges;
}
const props = defineProps<challengeCompleteCardProps>();
</script>

<template>
  <div class="challenge-complete-card">
    <div class="card-text">
      <h4 class="uppercase">
        {{ props.data.title }}
      </h4>
      <p>{{ props.data.description }}</p>
    </div>
    <div class="card-cover">
      <img :src="props.data.cover" alt="" />
    </div>
  </div>
</template>

<style lang="scss">
.challenge-complete-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 224px;
  padding: 12px 18px;
  border-radius: 24px;
  background-color: var(--grey);

  > .card-text {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  > .card-cover {
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    border-radius: 12px;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>

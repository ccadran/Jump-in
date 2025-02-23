<script lang="ts" setup>
import type { Challenges, CompleteChallenges } from "~/types/api";

interface challengeCompleteCardProps {
  data: CompleteChallenges;
}
const props = defineProps<challengeCompleteCardProps>();

const { data: challengeData } = useFetch<Challenges>(
  `/api/challenges/${props.data.challenge_id}`
);
</script>

<template>
  <div class="account-complete-card">
    <a :href="`/challenges/${props.data.challenge_id}`" class="link">{{
      challengeData?.name
    }}</a>
    <ChallengeCompleteCard :data="props.data" />
  </div>
</template>

<style lang="scss">
.account-complete-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  > .link {
    color: var(--blue);
    font-weight: 700;
    font-size: 14px;
  }
}
</style>

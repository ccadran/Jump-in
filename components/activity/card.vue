<script lang="ts" setup>
import { ChallengeCard } from "#components";
import type { Challenges, Guilds } from "~/types/api";

interface challengeCardProps {
  data: Challenges;
}

const props = defineProps<challengeCardProps>();
console.log(props.data.guild);
const { data: guildData } = useFetch<Guilds>(`/api/guilds/${props.data.guild}`);
console.log(guildData.value?.name);
</script>

<template>
  <div class="activity-card">
    <p class="guild-name">{{ guildData?.name }}</p>
    <ChallengeCard :data="props.data" />
  </div>
</template>

<style lang="scss">
.activity-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  > .guild-name {
    color: var(--blue);
    font-weight: 700;
    font-size: 14px;
    // text-transform: lowercase;
  }
}
</style>

<script lang="ts" setup>
import { ChallengeCard } from "#components";
import type { Challenges, Guilds } from "~/types/api";

interface challengeCardProps {
  data: Challenges;
}

const props = defineProps<challengeCardProps>();

const { data: guildData } = useFetch<Guilds>(`/api/guilds/${props.data.guild}`);
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

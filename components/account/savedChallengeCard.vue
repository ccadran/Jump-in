<script lang="ts" setup>
import { ChallengeCard } from "#components";
import type { Challenges, Guilds } from "~/types/api";

interface savedChallengeCardProps {
  data: Challenges;
}
const emit = defineEmits(["refresh"]);
const props = defineProps<savedChallengeCardProps>();

const { data: guildData } = useFetch<Guilds>(`/api/guilds/${props.data.guild}`);
const emitRefresh = () => emit("refresh");
</script>

<template>
  <div class="activity-card">
    <a :href="`/guilds/${props.data.guild}`" class="guild-name link">{{
      guildData?.name
    }}</a>
    <ChallengeCard :data="props.data" @refresh="emitRefresh" />
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
  }
}
</style>

<script lang="ts" setup>
import type { Guilds } from "~/types/api";

interface GuildCardProps {
  data: Guilds;
}

const props = defineProps<GuildCardProps>();
</script>

<template>
  <div class="member-guild-card">
    <div class="card-text">
      <h4 class="uppercase">{{ props.data.name }}</h4>
      <p>{{ props.data.description }}</p>
    </div>
    <div class="card-cta">
      <UiButton
        text="see more"
        :to="`/guilds/${props.data.id}`"
        color="white"
      />
    </div>
  </div>
</template>

<style lang="scss">
.member-guild-card {
  display: flex;
  width: 100%;
  padding: 12px 18px;
  border-radius: 16px;
  background-color: var(--blue);
  color: var(--white);
  height: 124px;

  > .card-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  > .card-cta {
    height: 100%;
    display: flex;
    align-items: end;
    width: fit-content;
  }
}
</style>

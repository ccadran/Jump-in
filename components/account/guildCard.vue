<script lang="ts" setup>
const user = useSupabaseUser();
import type { Guilds } from "~/types/api";

interface GuildCardProps {
  data: Guilds;
}
const emit = defineEmits(["guildLeaved"]);

const leaveGuild = async (guildId: string) => {
  try {
    const response = await $fetch(`/api/users/guilds`, {
      method: "DELETE",
      body: { userId: user.value!.id, guildId: guildId },
    });

    emit("guildLeaved", guildId);
  } catch (error) {}
};

const props = defineProps<GuildCardProps>();
</script>

<template>
  <div class="guild-card">
    <div class="card-text">
      <h4 class="uppercase">{{ props.data.name }}</h4>
      <p>{{ props.data.description }}</p>
    </div>
    <div class="card-cta">
      <p class="link" @click="leaveGuild(props.data.id)">Leave</p>
      <UiButton text="see more" :to="`/guilds/${props.data.id}`" color="blue" />
    </div>
  </div>
</template>

<style lang="scss">
.guild-card {
  display: flex;
  width: 100%;
  padding: 12px 18px;
  border-radius: 16px;
  background: var(--grey);
  color: var(--darj);
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
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>

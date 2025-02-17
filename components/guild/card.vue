<script lang="ts" setup>
const user = useSupabaseUser();
import type { Guilds } from "~/types/api";

interface GuildCardProps {
  data: Guilds;
}
const emit = defineEmits();

const joinGuild = async (guildId: string) => {
  try {
    const response = await $fetch(`/api/users/guilds`, {
      method: "POST",
      body: { userId: user.value!.id, guildId: guildId },
    });
    console.log("Ajouté à la guilde", response);
    emit("guildJoined", guildId);
  } catch (error) {
    console.error("Erreur d'ajout", error);
  }
};

const props = defineProps<GuildCardProps>();
</script>

<template>
  <div class="card">
    <div class="card-text">
      <h4 class="uppercase">{{ props.data.name }}</h4>
      <p>{{ props.data.description }}</p>
    </div>
    <div class="card-cta">
      <p class="link" @click="joinGuild(props.data.id)">Join</p>
      <UiButton text="see more" :to="`/guild/${props.data.id}`" color="blue" />
    </div>
  </div>
</template>

<style lang="scss">
.card {
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

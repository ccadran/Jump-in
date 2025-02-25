<script lang="ts" setup>
import type { Challenges } from "~/types/api";

interface challengeCardProps {
  data: Challenges;
}

const props = defineProps<challengeCardProps>();
const user = useSupabaseUser();
const isSaved = ref(false);
const emit = defineEmits(["refresh"]);

try {
  const response = await $fetch(`/api/users/challenges/save/check`, {
    method: "POST",
    body: { userId: user.value!.id, challengeId: props.data.id },
  });
  isSaved.value = typeof response === "boolean" ? response : false;
} catch (error) {}

const saveChallenge = async (challengeId: string) => {
  try {
    const response = await $fetch(`/api/users/challenges/save`, {
      method: "POST",
      body: { userId: user.value!.id, challengeId: challengeId },
    });
    emit("refresh");
    isSaved.value = true;
  } catch (error) {}
};

const unsaveChallenge = async (challengeId: string) => {
  try {
    const response = await $fetch(`/api/users/challenges/save`, {
      method: "DELETE",
      body: { userId: user.value!.id, challengeId: challengeId },
    });
    emit("refresh");
    isSaved.value = false;
  } catch (error) {}
};
</script>

<template>
  <div class="guild-card">
    <div class="card-text">
      <h4 class="uppercase">{{ props.data.name }}</h4>
      <p>{{ props.data.description }}</p>
    </div>
    <div class="card-cta">
      <p v-if="!isSaved" class="link" @click="saveChallenge(props.data.id)">
        save it
      </p>
      <p v-if="isSaved" class="link" @click="unsaveChallenge(props.data.id)">
        unsave it
      </p>
      <UiButton
        text="see more"
        :to="`/challenges/${props.data.id}`"
        color="blue"
      />
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

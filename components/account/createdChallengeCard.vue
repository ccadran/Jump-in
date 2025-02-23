<script lang="ts" setup>
import type { Challenges } from "~/types/api";

interface challengeCardProps {
  data: Challenges;
}

const props = defineProps<challengeCardProps>();
const emit = defineEmits(["challengeDeleted"]);

const user = useSupabaseUser();
const showModal = ref(false);
const toggleModal = () => {
  showModal.value = !showModal.value;
};

const deleteChallenge = async (challengeId: string) => {
  try {
    const response = await $fetch(`/api/challenges/${challengeId}`, {
      method: "DELETE",
    });
    emit("challengeDeleted", challengeId);
  } catch (error) {}
};
</script>

<template>
  <div class="challenge-card">
    <div class="card-text">
      <h4 class="uppercase">{{ props.data.name }}</h4>
      <p>{{ props.data.description }}</p>
    </div>
    <div class="card-cta">
      <img class="delete" src="/icons/cross.svg" @click="toggleModal" />

      <UiButton
        text="see more"
        :to="`/challenges/${props.data.id}`"
        color="blue"
      />
    </div>
  </div>
  <div v-if="showModal" class="confirmation">
    <div class="confirmation-text">
      <h4>Do you really want to delete the challenge ?</h4>
      <p>
        {{
          `All the challenges of the ${props.data.name} challenge will be deleted`
        }}
      </p>
    </div>
    <div class="confirmation-cta">
      <UiButton text="cancel" color="white" size="large" @click="toggleModal" />
      <UiButton
        text="delete"
        color="blue"
        size="large"
        @click="deleteChallenge(props.data.id)"
      />
    </div>
  </div>
  <div v-if="showModal" class="bluredBackground" ref="bluredBackground"></div>
</template>

<style lang="scss">
.challenge-card {
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
.confirmation {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--grey);
  padding: 24px;
  border-radius: 16px;
  width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 3;
  > .confirmation-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  > .confirmation-cta {
    display: flex;
    margin-top: 32px;
    gap: 24px;
  }
}
.bluredBackground {
  display: none;
  height: 100vh;
  width: 100vw;
  position: fixed;
  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  z-index: 2;
}
</style>

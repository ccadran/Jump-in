<script lang="ts" setup>
import type { Challenges, CompleteChallenges } from "~/types/api";

interface challengeCompleteCardProps {
  data: CompleteChallenges;
}
const user = useSupabaseUser();
const props = defineProps<challengeCompleteCardProps>();
const showModal = ref(false);
const toggleModal = () => {
  showModal.value = !showModal.value;
};
const emit = defineEmits(["challengeCompletedDeleted"]);

const { data: challengeData } = useFetch<Challenges>(
  `/api/challenges/${props.data.challenge_id}`
);
console.log("____challengeData", challengeData);

const deleteChallenge = async (challengeId: string) => {
  try {
    const response = await $fetch(`/api/users/challenges/complete`, {
      method: "DELETE",
      body: {
        userId: user.value?.id,
        id: props.data.id,
      },
    });
    emit("challengeCompletedDeleted", challengeId);
    showModal.value = false;

    console.log("Challenge delete", response);
  } catch (error) {
    console.error("Erreur de suppression", error);
  }
};
</script>

<template>
  <div class="account-complete-card">
    <a :href="`/challenges/${props.data.challenge_id}`" class="link">{{
      challengeData?.name
    }}</a>
    <div class="challenge-complete-card">
      <img class="delete" src="/icons/cross.svg" @click="toggleModal" />
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
  </div>
  <div v-if="showModal" class="confirmation">
    <div class="confirmation-text">
      <h4>Do you really want to delete this complete challenge ?</h4>
      <p>
        {{
          `Nobody will be able to see that you have completed the ${challengeData?.name} challenge`
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
.account-complete-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  > .link {
    color: var(--blue);
    font-weight: 700;
    font-size: 14px;
  }
  > .challenge-complete-card {
    display: flex;
    position: relative;
    flex-direction: column;
    gap: 12px;
    height: 224px;
    padding: 12px 18px;
    border-radius: 24px;
    background-color: var(--grey);
    > .delete {
      position: absolute;
      top: 12px;
      right: 18px;
    }
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
}
.bluredBackground {
  //   display: none;
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

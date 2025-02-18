<script lang="ts" setup>
import type { Challenges, CompleteChallenges } from "~/types/api";

const route = useRoute();
const challengeId = route.params.id;

const { data: challengeData, error } = await useFetch<Challenges>(
  `/api/challenges/${challengeId}`,
  {
    key: "challenge",
  }
);

const { data: challengesCompleteData, error: challengesCompleteError } =
  await useFetch<CompleteChallenges[]>(
    `/api/challenges/complete/${challengeId}`,
    {
      key: "challengesComplete",
    }
  );

const user = useSupabaseUser();

const formComplete = ref({
  title: "",
  cover: null as File | null,
  description: "",
});
const completeChallenge = async (e: Event) => {
  e.preventDefault();

  const formCompleteToSend = new FormData();
  formCompleteToSend.append("title", formComplete.value.title);
  formCompleteToSend.append("description", formComplete.value.description);
  formCompleteToSend.append("challenge", challengeData.value!.id || "");
  formCompleteToSend.append("userId", user.value?.id || "");

  if (formComplete.value.cover) {
    formCompleteToSend.append("cover", formComplete.value.cover);
  }

  try {
    const response = await $fetch("/api/users/challenges/complete", {
      method: "POST",
      body: formCompleteToSend,
    });

    showModal.value = false;
    refreshNuxtData("challengesComplete");

    formComplete.value = {
      title: "",
      cover: null,
      description: "",
    };

    (document.querySelector('input[type="file"]') as HTMLInputElement).value =
      "";
  } catch (error) {
    console.error("Erreur:", error);
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    formComplete.value.cover = target.files[0];
  }
};
const showModal = ref(false);
const filter = ref(null) as Ref<HTMLElement | null>;
const toggleModal = () => {
  showModal.value = !showModal.value;
  console.log("showModal", showModal.value);
  if (filter.value) {
    filter.value.style.display = showModal.value ? "block" : "none";
  }
};
</script>

<template>
  <div class="challenge-page">
    <div class="cover">
      <img :src="challengeData!.cover" alt="" />
    </div>
    <div class="hero">
      <div class="header">
        <div class="title-guild">
          <h3>{{ challengeData!.name }}</h3>
          <a :href="`/guilds/${challengeData!.guild}`" class="link"
            >Voir la guild</a
          >
        </div>
        <p class="link">save it</p>
      </div>
      <div class="description">{{ challengeData!.description }}</div>
      <div class="data-complete">
        <p>24 complete - 53 save</p>
        <UiButton text="complete" color="blue" @click="toggleModal" />
      </div>
      <div class="filters">
        <input type="search" name="find" id="" />
        <p>Newest</p>
      </div>
    </div>
    <div class="challenges-complete-container">
      <ChallengeCompleteCard
        v-for="challengeComplete in challengesCompleteData"
        :data="challengeComplete"
      />
    </div>
  </div>
  <div class="filter" ref="filter"></div>
  <div v-if="showModal" class="complete-challenge-modal">
    <img class="cross" src="/icons/cross.svg" alt="" @click="toggleModal" />
    <form class="form-complete-challenge" @submit="completeChallenge">
      <div class="form-part">
        <label for="">Title</label>
        <input v-model="formComplete.title" type="text" placeholder="Title" />
      </div>
      <div class="form-part">
        <label for="">Description</label>
        <input
          v-model="formComplete.description"
          type="text"
          placeholder="Description"
        />
      </div>
      <div class="form-part">
        <label for="">Cover</label>
        <input type="file" @change="handleFileUpload" />
      </div>

      <button type="submit">Envoyer</button>
    </form>
  </div>
</template>

<style lang="scss">
body {
  padding: 0;
}
.cover {
  width: 100%;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.hero {
  padding: 0 20px;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  > .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    // margin: 22px 0;
  }
  > .data-complete {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  > .filters {
    margin-top: 24px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    & > input {
      border-radius: 8px;
      border: 1px solid var(--dark);
      width: 185px;
      height: 25px;
    }
  }
}
.complete-challenge-modal {
  position: fixed;
  height: 40svh;
  z-index: 100;
  width: calc(100% - 40px);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--grey);
  top: 10svh;
  border-radius: 24px;
  padding: 20px;
  > .cross {
    cursor: pointer;
    margin-left: calc(100% - 20px);
  }
  > .form-complete-challenge {
    display: flex;
    flex-direction: column;
    gap: 24px;
    > .form-part {
      display: flex;
      flex-direction: column;
      gap: 4px;
      > label {
        font-weight: 700;
      }
      > input {
        padding: 8px;
        font-family: "Inter";
        border-radius: 8px;
        &::placeholder {
          opacity: 0.5;
        }

        &[type="file"] {
          padding: 0;
          border-radius: 0;
        }
      }
    }
  }
}
.filter {
  display: none;
  height: 100vh;
  width: 100vw;
  position: fixed;
  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.2);
  top: 0;
}
.challenges-complete-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
  padding: 0 20px;
}
</style>

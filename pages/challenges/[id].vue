<script lang="ts" setup>
import type { Challenges, CompleteChallenges } from "~/types/api";

const user = useSupabaseUser();
const route = useRoute();
const challengeId = route.params.id;
const showModal = ref(false);
const bluredBackground = ref(null) as Ref<HTMLElement | null>;
const isComplete = ref(false);
const searchQuery = ref("");
const sortOrder = ref<"newest" | "oldest">("newest"); // Par défaut, tri du plus récent au plus ancien
const sortOptions = ref<HTMLElement | null>(null);

const formComplete = ref({
  title: "",
  cover: null as File | null,
  description: "",
});

const { data: challengeData, error } = useFetch<Challenges>(
  `/api/challenges/${challengeId}`,
  {
    key: "challenge",
  }
);
const { data: challengesCompleteData, error: challengesCompleteError } =
  useFetch<CompleteChallenges[]>(`/api/challenges/complete/${challengeId}`, {
    key: "challengesComplete",
  });

const filteredChallengesComplete = computed(() => {
  let result = challengesCompleteData.value || [];

  // Filtrage par nom
  if (searchQuery.value) {
    result = result.filter((guild) =>
      guild.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Tri par date de création
  return result.sort((a, b) => {
    return sortOrder.value === "newest"
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
});
const { data: countComplete } = useFetch<{
  savedCount: number;
  completedCount: number;
}>(`/api/challenges/count/${challengeId}`, {
  key: "countComplete",
});
try {
  const response = await $fetch(`/api/users/challenges/complete/check`, {
    method: "POST",
    body: { userId: user.value!.id, challengeId: challengeId },
  });
  isComplete.value = typeof response === "boolean" ? response : false;
} catch (error) {
  console.error("Erreur de vérification de complétion", error);
}

const completeChallengeSubmit = async (e: Event) => {
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

    toggleModal();
    isComplete.value = true;
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

const toggleModal = () => {
  showModal.value = !showModal.value;
  if (bluredBackground.value) {
    bluredBackground.value.style.display = showModal.value ? "block" : "none";
  }
};

const toggleSortOptions = () => {
  if (sortOptions.value) {
    sortOptions.value.classList.toggle("open");
  }
};
const switchSortValue = (value: "newest" | "oldest") => {
  sortOrder.value = value;
  toggleSortOptions();
};
</script>

<template>
  <div class="challenge-page">
    <div class="back" @click="$router.back()">
      <img src="/icons/back.svg" alt="" />
    </div>
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
        <p>
          {{
            `${countComplete?.savedCount} save - ${countComplete?.completedCount} complete`
          }}
        </p>
        <UiButton
          text="complete"
          color="blue"
          @click="toggleModal"
          :disabled="isComplete ? true : false"
        />
      </div>
      <div class="filters">
        <input
          v-model="searchQuery"
          type="search"
          name="find"
          placeholder="Search..."
        />
        <div class="sort-results-container">
          <div class="sort-values" @click="toggleSortOptions">
            <p>{{ sortOrder === "newest" ? "Newest" : "Oldest" }}</p>
            <img src="/icons/chevron.svg" alt="Sort options" />
          </div>
          <div class="sorts-options" ref="sortOptions">
            <p
              @click="switchSortValue('oldest')"
              :class="{ active: sortOrder === 'oldest' }"
            >
              Oldest
            </p>
            <p
              @click="switchSortValue('newest')"
              :class="{ active: sortOrder === 'newest' }"
            >
              Newest
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="challenges-complete-container">
      <ChallengeCompleteCard
        v-for="challengeComplete in filteredChallengesComplete"
        :data="challengeComplete"
      />
    </div>
    <div v-if="showModal" class="complete-challenge-modal">
      <img class="cross" src="/icons/cross.svg" alt="" @click="toggleModal" />
      <form class="form-complete-challenge" @submit="completeChallengeSubmit">
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
        <UiButton text="Envoyer" color="blue" type="submit" size="large" />
      </form>
    </div>
    <div class="bluredBackground" ref="bluredBackground"></div>
  </div>
</template>

<style lang="scss">
body {
  padding: 0;
}
.challenge-page {
  > .cover {
    width: 100%;
    height: 200px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  > .hero {
    padding: 0 20px;
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    > .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    > .data-complete {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
  }
  > .complete-challenge-modal {
    position: fixed;
    height: auto;
    z-index: 100;
    width: calc(100% - 40px);
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--grey);
    top: 50%;
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
      margin-bottom: 32px;
    }
  }
  > .challenges-complete-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 32px;
    padding: 0 20px;
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
}
</style>

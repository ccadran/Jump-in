<script lang="ts" setup>
import type { Challenges, Guilds } from "~/types/api";

const user = useSupabaseUser();
const route = useRoute();
const guildId = route.params.id;
const isMember = ref(false);
const bluredBackground = ref(null) as Ref<HTMLElement | null>;
const showModal = ref(false);
const searchQuery = ref("");
const formNewChallenge = ref({
  name: "",
  cover: null as File | null,
  description: "",
});

const { data: guildData, error } = useFetch<Guilds>(`/api/guilds/${guildId}`, {
  key: "guild",
});

const { data: challengesData, error: challengesError } = useFetch<Challenges[]>(
  `/api/guilds/challenge/${guildId}`,
  {
    key: "challenges",
  }
);
const filteredChallenges = computed(() => {
  if (!searchQuery.value) return challengesData.value || [];
  return (challengesData.value || []).filter((challenge) =>
    challenge.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const { data: countMember } = useFetch<{ userCount: number }>(
  `/api/guilds/count/${guildId}`,
  {
    key: "countMember",
  }
);

try {
  const response = await $fetch(`/api/users/guilds/check`, {
    method: "POST",
    body: { userId: user.value!.id, guildId: guildId },
  });
  isMember.value = typeof response === "boolean" ? response : false;
} catch (error) {
  console.error("Erreur de vérification d'adhésion", error);
}

const joinGuild = async (guildId: string) => {
  try {
    const response = await $fetch(`/api/users/guilds`, {
      method: "POST",
      body: { userId: user.value!.id, guildId: guildId },
    });
    console.log("Ajouté à la guilde", response);
    isMember.value = true;
  } catch (error) {
    console.error("Erreur d'ajout", error);
  }
};

async function leaveGuild(guildId: string) {
  try {
    const response = await $fetch(`/api/users/guilds`, {
      method: "DELETE",
      body: { userId: user.value!.id, guildId: guildId },
    });
    console.log("Retiré de la guilde", response);
    isMember.value = false;
    refreshNuxtData("guilds");
  } catch (error) {
    console.error("Erreur de suppression", error);
  }
}

const toggleModal = () => {
  showModal.value = !showModal.value;
  if (bluredBackground.value) {
    bluredBackground.value.style.display = showModal.value ? "block" : "none";
  }
};

const newChallengeSubmit = async (e: Event) => {
  e.preventDefault();
  console.log("____formData", formNewChallenge.value);

  const formDataToSend = new FormData();
  formDataToSend.append("name", formNewChallenge.value.name);
  formDataToSend.append("description", formNewChallenge.value.description);
  formDataToSend.append("created_by", user.value?.id || "");
  formDataToSend.append("guild", String(guildId));

  if (formNewChallenge.value.cover) {
    formDataToSend.append("cover", formNewChallenge.value.cover); // Add the file
  }

  try {
    const response = await $fetch("/api/challenges", {
      method: "POST",
      body: formDataToSend,
    });
    console.log("Response", response);

    refreshNuxtData("guilds");

    formNewChallenge.value = {
      name: "",
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
  console.log("____test");

  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    formNewChallenge.value.cover = target.files[0];
    console.log("File", formNewChallenge.value.cover);
  }
};
</script>

<template>
  <div class="guild-page">
    <div class="cover">
      <img :src="guildData?.cover" alt="" />
    </div>
    <div class="hero">
      <div class="header">
        <h1>{{ guildData!.name }}</h1>
        <UiButton
          v-if="!isMember"
          text="Join"
          color="blue"
          @click="joinGuild(guildData!.id)"
        />
        <UiButton
          v-if="isMember"
          text="Leave"
          color="blue"
          @click="leaveGuild(guildData!.id)"
        />
      </div>
      <p class="members">{{ `${countMember?.userCount} members` }}</p>
      <p>{{ guildData!.description }}</p>
      <div class="ranking-challenge">
        <a class="link" href="">Voir le classement</a>
        <UiButton text="New challenge +" @click="toggleModal" />
      </div>
      <div class="filters">
        <input v-model="searchQuery" type="search" name="find" />
        <p>Newest</p>
      </div>
    </div>
    <div class="challenges-container">
      <ChallengeCard
        v-for="challenge in filteredChallenges"
        :data="challenge"
      />
    </div>
    <div v-if="showModal" class="new-challenge-modal">
      <img class="cross" src="/icons/cross.svg" alt="" @click="toggleModal" />
      <form class="form-complete-challenge" @submit="newChallengeSubmit">
        <div class="form-part">
          <label for="">Title</label>
          <input
            v-model="formNewChallenge.name"
            type="text"
            placeholder="Title"
          />
        </div>
        <div class="form-part">
          <label for="">Description</label>
          <input
            v-model="formNewChallenge.description"
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
  </div>
  <div class="bluredBackground" ref="bluredBackground"></div>
</template>

<style lang="scss">
.guild-page {
  > .cover {
    height: 200px;
    width: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  > .hero {
    padding: 0 20px;
    margin-top: 18px;

    > .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    > .members {
      font-size: 10px;
      line-height: 100%;
      margin-bottom: 24px;
    }
    > .ranking-challenge {
      margin-top: 18px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  > .challenges-container {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 24px;
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
      > .form-part {
        display: flex;
        flex-direction: column;
        gap: 4px;
        > label {
          font-weight: 700;
          font-size: 14px;
        }
        > input {
          padding: 8px;
          font-family: "Inter";
          border-radius: 8px;
          border: 0.25px solid var(--dark);
          background-color: var(--grey);
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

<script lang="ts" setup>
import type { Challenges, CompleteChallenges } from "~/types/api";

const user = useSupabaseUser();

const formData = ref({
  name: "",
  cover: "",
  description: "",
  guild: "",
});

const deleteChallenge = async (id: string) => {
  try {
    const response = await fetch(`/api/challenges/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    if (challenges.value) {
      challenges.value = challenges.value.filter(
        (challenge) => challenge.id !== id
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  console.log("formData", formData.value);

  try {
    const response = await $fetch("/api/challenges", {
      method: "POST",
      body: {
        challengeData: formData.value,
        created_by: user.value?.id,
      },
    });

    refreshNuxtData("challenges");

    formData.value = {
      name: "",
      cover: "",
      description: "",
      guild: "",
    };
  } catch (error) {
    console.error("Erreur:", error);
  }
};

const { data: challenges, error } = useFetch<Challenges[]>("/api/challenges", {
  key: "challenges",
});

const showForm = ref(false);
const formComplete = ref({
  title: "",
  cover: "",
  description: "",
  challenge: "",
});

const completeChallenge = async (e: Event) => {
  e.preventDefault();
  showForm.value = true;
  try {
    const response = await $fetch("/api/users/challenges/complete", {
      method: "POST",
      body: {
        completeChallenge: formComplete.value,
        userId: user.value?.id,
      },
    });

    refreshNuxtData("challenges");

    formComplete.value = {
      title: "",
      cover: "",
      description: "",
      challenge: "",
    };
  } catch (error) {
    console.error("Erreur:", error);
  }
};

const saveChallenge = async (id: string) => {
  console.log(user.value!.id);

  try {
    const response = await $fetch(`/api/users/challenges/save`, {
      method: "POST",
      body: { userId: user.value!.id, challenge_id: id },
    });
    savedChallenges.value.push(id);

    console.log("Challenge saved", response);
  } catch (error) {
    console.error("Error saving challenge", error);
  }
};

const savedChallenges = ref<string[]>([]);
const fetchSavedChallenges = async () => {
  if (!user.value) return;

  try {
    const response = await $fetch<Challenges[]>(
      `/api/users/challenges/save/${user.value.id}`,
      {}
    );
    console.log("Response", response);

    savedChallenges.value = response.map((challenge) => challenge.id);

    console.log("Saved challenges", savedChallenges.value);
  } catch (error) {
    console.error("Error fetching saved challenges", error);
  }
};

const removeFromSave = async (challenge_id: string) => {
  try {
    const response = await $fetch(`/api/users/challenges/save`, {
      method: "DELETE",
      body: { userId: user.value!.id, challenge_id: challenge_id },
    });

    savedChallenges.value = savedChallenges.value.filter(
      (savedChallenge) => savedChallenge !== challenge_id
    );

    console.log("Challenge removed", response);
  } catch (error) {
    console.error("Error removing challenge", error);
  }
};

const fetchCompleteChallenges = async (id: string) => {
  if (!user.value) return;

  try {
    const response = await $fetch<CompleteChallenges[]>(
      `/api/challenges/complete/${id}`
    );
    console.log("Complete challenges", response);
  } catch (error) {
    console.error("Error fetching complete challenges", error);
  }
};

onMounted(() => {
  fetchSavedChallenges();
});
</script>

<template>
  <form @submit="handleSubmit">
    <input v-model="formData.name" type="text" placeholder="Nom" />
    <input v-model="formData.cover" type="text" placeholder="Cover" />
    <input
      v-model="formData.description"
      type="text"
      placeholder="Description"
    />
    <input v-model="formData.guild" type="text" placeholder="Guilde" />
    <button type="submit">Envoyer</button>
  </form>

  <div class="challenges">
    <div v-for="challenge in challenges" :key="challenge.id">
      <h2>{{ challenge.name }}</h2>
      <img :src="challenge.cover" alt="cover" />
      <p>{{ challenge.description }}</p>
      <p @click="fetchCompleteChallenges(challenge.id)">Complete challenge</p>
      <p @click="deleteChallenge(challenge.id)">Delete</p>
      <p
        v-if="!savedChallenges.includes(challenge.id)"
        @click="saveChallenge(challenge.id)"
      >
        SAVE
      </p>
      <p v-else @click="removeFromSave(challenge.id)">ALREADY SAVED</p>
    </div>
  </div>
  <p @click="showForm = !showForm">SHOW COMPLETE FORM</p>
  <div class="complete">
    <form v-if="showForm" @submit="completeChallenge">
      <input v-model="formComplete.title" type="text" placeholder="Nom" />
      <input v-model="formComplete.cover" type="text" placeholder="Cover" />
      <input
        v-model="formComplete.description"
        type="text"
        placeholder="Description"
      />
      <input
        v-model="formComplete.challenge"
        type="text"
        placeholder="challenge"
      />
      <button type="submit">Envoyer</button>
    </form>
  </div>
</template>

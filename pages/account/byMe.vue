<script lang="ts" setup>
import type { Challenges, Guilds } from "~/types/api";
definePageMeta({
  layout: "account",
});

const user = useSupabaseUser();
const showMyGuilds = ref(true);
const searchQuery = ref("");
const sortOrder = ref<"newest" | "oldest">("newest"); // Par défaut, tri du plus récent au plus ancien
const sortOptions = ref<HTMLElement | null>(null);
const handleSwitchChange = (side: "left" | "right") => {
  showMyGuilds.value = side === "left";
  searchQuery.value = "";
};

// Fetch des guildes et challenges créés par l'utilisateur
const { data: createdGuilds } = useFetch<Guilds[]>(
  `/api/users/guilds/created/${user.value?.id}`,
  {
    key: "createdGuilds",
  }
);
const { data: createdChallenge } = useFetch<Challenges[]>(
  `/api/users/challenges/created/${user.value?.id}`,
  {
    key: "createdChallenge",
  }
);

const handleGuildDelete = () => {
  refreshNuxtData("createdGuilds");
};
const handleChallengeDelete = () => {
  refreshNuxtData("createdChallenge");
};

// Filtrage et tri des guildes
const filteredGuilds = computed(() => {
  let result = createdGuilds.value || [];

  // Filtrage par nom
  if (searchQuery.value) {
    result = result.filter((guild) =>
      guild.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Tri par date de création
  return result.sort((a, b) => {
    return sortOrder.value === "newest"
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
});

// Filtrage et tri des challenges
const filteredChallenges = computed(() => {
  let result = createdChallenge.value || [];

  // Filtrage par nom
  if (searchQuery.value) {
    result = result.filter((challenge) =>
      challenge.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Tri par date de création
  return result.sort((a, b) => {
    return sortOrder.value === "newest"
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
});

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
  <NuxtLayout title="created by me" description="created by me page">
    <div class="byMe-page">
      <UiSwitch
        leftText="Guilds"
        rightText="Challenges"
        thirdText="Completed"
        @switchChange="handleSwitchChange"
      />

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

      <div class="cards-container">
        <div v-if="showMyGuilds" class="guilds-container">
          <AccountCreatedGuildCard
            v-for="guild in filteredGuilds"
            :key="guild.id"
            :data="guild"
            @guildDeleted="handleGuildDelete"
          />
        </div>
        <div v-if="!showMyGuilds" class="challenges-container">
          <AccountCreatedChallengeCard
            v-for="challenge in filteredChallenges"
            :key="challenge.id"
            :data="challenge"
            @challengeDeleted="handleChallengeDelete"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss">
.byMe-page {
  > .cards-container {
    .guilds-container,
    .challenges-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
  }
}
</style>

<script lang="ts" setup>
import type { Guilds } from "~/types/api";

const user = useSupabaseUser();
const showMyGuilds = ref(true);
const searchQuery = ref("");
const sortOrder = ref<"newest" | "oldest">("newest"); // Par défaut, tri du plus récent au plus ancien
const sortOptions = ref<HTMLElement | null>(null);

const handleSwitchChange = (side: "left" | "right") => {
  showMyGuilds.value = side === "left";
};

const { data: allGuilds } = useFetch<Guilds[]>("/api/guilds", {
  key: "allGuilds",
});

const {
  data: userGuilds,
  error,
  status,
} = useFetch<Guilds[]>(`/api/users/guilds/${user.value!.id}`, {
  key: "userGuilds",
});
console.log({ userGuilds, error, status });

const handleGuildJoined = () => {
  refreshNuxtData("allGuilds");
  refreshNuxtData("userGuilds");
};

const otherGuilds = computed(() => {
  if (!allGuilds.value || !userGuilds.value) return [];
  return allGuilds.value.filter((guild) => {
    return !userGuilds.value?.find((userGuild) => userGuild.id === guild.id);
  });
});
const filteredOtherGuilds = computed(() => {
  let result = otherGuilds.value || [];

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

const filteredUserGuilds = computed(() => {
  let result = userGuilds.value || [];

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

onMounted(() => {
  refreshNuxtData("allGuilds");
  refreshNuxtData("userGuilds");
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
  <div class="home-page">
    <div class="header">
      <a href="/" class="logo">
        <img src="/logo.svg" alt="" />
      </a>
    </div>
    <div class="global-hero">
      <h1>Home</h1>
      <p>
        Explore and manage your guilds or discover new ones to join. Connect
        with like-minded people, take on exciting challenges, and engage with
        your community!
      </p>
    </div>
    <UiSwitch
      leftText="My guilds"
      rightText="Other guilds"
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
    <div class="guilds-container">
      <div v-if="showMyGuilds" class="guilds">
        <GuildMemberCard
          v-for="guild in filteredUserGuilds"
          :key="guild.id"
          :data="guild"
        />
      </div>
      <div v-else class="guilds">
        <GuildCard
          v-for="guild in filteredOtherGuilds"
          :key="guild.id"
          :data="guild"
          @guildJoined="handleGuildJoined"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.home-page {
  padding: 0 20px 92px;

  > .guilds-container {
    margin-top: 32px;
    > .guilds {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
  }
}
</style>

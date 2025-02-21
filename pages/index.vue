<script lang="ts" setup>
import type { Guilds } from "~/types/api";

const user = useSupabaseUser();
const showMyGuilds = ref(true);

const handleSwitchChange = (side: "left" | "right") => {
  showMyGuilds.value = side === "left";
  console.log("parentttt", showMyGuilds.value);
};

const { data: allGuilds } = useFetch<Guilds[]>("/api/guilds", {
  key: "allGuilds",
});

const { data: userGuilds, error } = useFetch<Guilds[]>(
  `/api/users/guilds/${user.value!.id}`,
  {
    key: "userGuilds",
  }
);
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

onMounted(() => {
  refreshNuxtData("allGuilds");
  refreshNuxtData("userGuilds");
});
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
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus eos
        rerum aliquam dignissimos nulla soluta quasi dolor totam similique. Eos
        repellendus veniam soluta veritatis quis!
      </p>
    </div>
    <UiSwitch
      leftText="My guilds"
      rightText="Other guilds"
      @switchChange="handleSwitchChange"
    />

    <div class="guilds-container">
      <div v-if="showMyGuilds" class="guilds">
        <GuildMemberCard
          v-for="guild in userGuilds"
          :key="guild.id"
          :data="guild"
        />
      </div>
      <div v-else class="guilds">
        <GuildCard
          v-for="guild in otherGuilds"
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

<script lang="ts" setup>
import type { Guilds } from "~/types/api";

const user = useSupabaseUser();
const showMyGuilds = ref(true);

const handleSwitchChange = (side: "left" | "right") => {
  showMyGuilds.value = side === "left";
  console.log("parentttt", showMyGuilds.value);
};

// Fetch user guilds (on the server-side)
const { data: allGuilds } = useFetch<Guilds[]>("/api/guilds", {
  key: "allGuilds",
});

// Fetch all guilds for the user
const { data: userGuilds, error } = await useFetch<Guilds[]>(
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
</script>

<template>
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
</template>

<style lang="scss">
body {
  padding: 0 20px;
}
.global-hero {
  margin: 32px 0 42px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.guilds-container {
  margin-top: 32px;
  > .guilds {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>

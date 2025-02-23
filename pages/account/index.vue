<script lang="ts" setup>
import type { Guilds } from "~/types/api";
definePageMeta({
  layout: "account",
});
const user = useSupabaseUser();

const { data: memberGuilds } = useFetch<Guilds[]>(
  `/api/users/guilds/${user.value?.id}`,
  {
    key: "memberGuilds",
  }
);

const handleGuildLeave = (guildId: string) => {
  refreshNuxtData("memberGuilds");
};
</script>

<template>
  <NuxtLayout title="Account" description="Account page">
    <div class="general-page">
      <div class="guilds-member">
        <h4>Your guilds</h4>
        <div class="guilds-member-container">
          <AccountGuildCard
            v-for="guild in memberGuilds"
            :key="guild.id"
            :data="guild"
            @guildLeaved="handleGuildLeave"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss">
.general-page {
  > .guilds-member {
    > h4 {
      margin-bottom: 24px;
    }
    > .guilds-member-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
  }
}
</style>

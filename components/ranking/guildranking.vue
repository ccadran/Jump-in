<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  topUsers: {
    type: Object,
    required: true,
  },
});

const guildUsers = computed(() => {
  const users = props.topUsers.users;

  if (!users || !Array.isArray(users)) return [];

  const sortedUsers = users
    .filter((user) => user && typeof user.challenges_completed === "number")
    .sort((a, b) => b.challenges_completed - a.challenges_completed)
    .slice(0, 3);

  if (sortedUsers.length === 0) return [];

  const maxChallenges = sortedUsers[0].challenges_completed;

  return sortedUsers.map((user) => {
    const relativeHeight =
      maxChallenges > 0
        ? Math.max(30, (user.challenges_completed / maxChallenges) * 80)
        : 30;

    return {
      username: user.username || "Unknown",
      challenges_completed: user.challenges_completed || 0,
      height: `${relativeHeight.toFixed(1)}%`, // Pour la hauteur CSS
    };
  });
});
</script>

<template>
  <div class="guild-ranking">
    <a :href="`/guilds/${props.topUsers.guild}`" class="guild-name link">{{
      topUsers.guild_name
    }}</a>
    <div class="ranking-container">
      <div class="diagram-container">
        <div
          v-for="(user, index) in guildUsers"
          :key="index"
          class="diagram"
          :style="{ height: user.height }"
        >
          <p>{{ user.challenges_completed }}</p>
          <span>{{ user.username }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.guild-ranking {
  margin-top: 20px;

  > .guild-name {
    font-weight: 700;
    color: var(--blue);
    margin-bottom: 14px;
  }

  .ranking-container {
    background-color: var(--grey);
    height: 240px;
    padding: 20px;
    border-radius: 12px;

    .diagram-container {
      background-color: var(--white);
      border: 0.25px solid black;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: end;
      border-radius: 8px;

      .diagram {
        width: 20%;
        background-color: var(--blue);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        position: relative;
        transition: height 0.5s ease;

        p {
          margin: 0;
          font-size: 14px;
          color: white;
        }

        span {
          font-size: 12px;
          position: absolute;
          top: -20px;
          color: black;
        }
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { ref, computed } from "vue";

const { data, error } = useFetch("/api/ranking");

const topUsers = computed(() => {
  const users = data.value as any;

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
      username: user.username,
      challenges_completed: user.challenges_completed,
      height: `${relativeHeight.toFixed(1)}%`,
    };
  });
});

const { data: topUsersByGuild } = useFetch("/api/ranking/guilds");
</script>

<template>
  <div class="ranking-page">
    <div class="header">
      <a href="/home" class="logo">
        <img src="/logo.svg" alt="" />
      </a>
    </div>
    <div class="global-hero">
      <h1>RANKING</h1>
      <p>
        Discover the top challengers! See the users who have completed the most
        challenges overall and explore rankings within each guild.
      </p>
    </div>
    <div class="rankings-container">
      <div class="top-users-ranking">
        <h4>Top users</h4>
        <div class="ranking-container">
          <div class="diagram-container">
            <div
              v-for="(user, index) in topUsers"
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
      <div class="top-users-guilds">
        <h4>Top users by guilds</h4>
        <RankingGuildranking
          v-for="topUsers in topUsersByGuild"
          :topUsers="topUsers"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.ranking-page {
  padding: 0 20px 92px;

  .rankings-container {
    .top-users-ranking {
      > h4 {
        margin-bottom: 18px;
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
    > .top-users-guilds {
      margin-top: 42px;
      > h4 {
        margin-bottom: 18px;
      }
    }
  }
}
</style>

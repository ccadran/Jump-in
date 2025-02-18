<script lang="ts" setup></script>

<template>
  <nav class="global-nav">
    <NuxtLink to="/"><img src="/icons/navHome.svg" alt="" /></NuxtLink>
    <NuxtLink to="/activity"
      ><img src="/icons/navActivity.svg" alt=""
    /></NuxtLink>
    <NuxtLink to="/create"><img src="/icons/navNew.svg" alt="" /></NuxtLink>
    <NuxtLink to="/ranking"
      ><img src="/icons/navRanking.svg" alt=""
    /></NuxtLink>
    <NuxtLink to="/account"
      ><img src="/icons/navAccount.svg" alt=""
    /></NuxtLink>
  </nav>
  <NuxtPage />
</template>

<style lang="scss">
.global-nav {
  position: fixed;
  bottom: 14px;
  width: calc(100% - 40px);
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  background-color: var(--light);
  border-radius: 24px;
  > a {
    height: 44px;
    width: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
  }
}
</style>

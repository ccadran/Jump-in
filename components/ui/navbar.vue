<script lang="ts" setup></script>

<template>
  <nav class="global-nav">
    <NuxtLink to="/" activeClass="active">
      <img src="/icons/navHome.svg" alt="" class="icon" />
      <img src="/icons/navHomeActive.svg" alt="" class="iconActive" />
    </NuxtLink>
    <NuxtLink to="/activity" activeClass="active">
      <img src="/icons/navActivity.svg" alt="" class="icon" />
      <img src="/icons/navActivityActive.svg" alt="" class="iconActive" />
    </NuxtLink>
    <NuxtLink to="/create" activeClass="active">
      <img src="/icons/navNew.svg" alt="" class="icon" />
      <img src="/icons/navNewActive.svg" alt="" class="iconActive" />
    </NuxtLink>
    <NuxtLink to="/ranking" activeClass="active">
      <img src="/icons/navRanking.svg" alt="" class="icon" />
      <img src="/icons/navRankingActive.svg" alt="" class="iconActive" />
    </NuxtLink>
    <NuxtLink to="/account" activeClass="active">
      <img src="/icons/navAccount.svg" alt="" class="icon" />
      <img src="/icons/navAccountActive.svg" alt="" class="iconActive" />
    </NuxtLink>
  </nav>
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
    > .iconActive {
      display: none;
    }
    &.active {
      background-color: var(--blue);
      > .iconActive {
        display: flex;
      }
      > .icon {
        display: none;
      }
    }
  }
}
</style>

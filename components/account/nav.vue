<script lang="ts" setup></script>

<template>
  <nav class="account-nav">
    <NuxtLink activeClass="active" class="nav-item" to="/account/"
      >general</NuxtLink
    >
    <NuxtLink activeClass="active" class="nav-item" to="/account/saved"
      >saved</NuxtLink
    >
    <NuxtLink activeClass="active" class="nav-item" to="/account/completed"
      >completed</NuxtLink
    >
    <NuxtLink activeClass="active" class="nav-item" to="/account/byMe"
      >by me
    </NuxtLink>
  </nav>
</template>

<style lang="scss">
.account-nav {
  margin-bottom: 32px;
  display: flex;
  width: 100%;

  justify-content: space-between;
  > .nav-item {
    background-color: var(--grey);
    padding: 6px 14px;
    border-radius: 24px;
    &.active {
      background-color: var(--blue);
      color: var(--white);
    }
  }
}
</style>

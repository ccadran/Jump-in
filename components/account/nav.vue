<script lang="ts" setup></script>

<template>
  <nav class="account-nav">
    <NuxtLink to="/account/byMe">Created by me</NuxtLink>
    <NuxtLink to="/account/saved">Challenges saved</NuxtLink>
    <NuxtLink to="/account/completed">Challenge completed</NuxtLink>
    <NuxtLink to="/account/">Home</NuxtLink>
  </nav>
</template>

<style lang="scss">
.account-nav {
  margin-bottom: 32px;
}
</style>

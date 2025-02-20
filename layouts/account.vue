<script lang="ts" setup>
interface accountLayoutProps {
  title: string;
  description: string;
}
const props = defineProps<accountLayoutProps>();
</script>

<template>
  <div class="account-page">
    <a href="/account/settings">
      <img src="/icons/setting.svg" alt="" />
    </a>
    <div class="global-hero">
      <h1>{{ props.title }}</h1>
      <p>{{ props.description }}</p>
    </div>
    <AccountNav />
    <slot />
  </div>
</template>

<style lang="scss">
.account-page {
  padding: 0 20px;
  .global-hero {
    height: 120px;
  }
}
</style>

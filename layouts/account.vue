<script lang="ts" setup>
interface accountLayoutProps {
  title: string;
  description: string;
}
const props = defineProps<accountLayoutProps>();
</script>

<template>
  <div class="global-hero">
    <h1>{{ props.title }}</h1>
    <p>{{ props.description }}</p>
  </div>
  <AccountNav />
  <div class="account-page">
    <slot />
  </div>
</template>

<style lang="scss">
.global-hero {
  padding: 0 20px;
  height: 120px;
}
</style>

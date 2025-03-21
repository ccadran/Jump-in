<script lang="ts" setup>
interface accountLayoutProps {
  title: string;
  description: string;
}
const props = defineProps<accountLayoutProps>();
</script>

<template>
  <div class="account-page">
    <div class="header">
      <a href="/home" class="logo">
        <img src="/logo.svg" alt="" />
      </a>

      <a href="/account/settings">
        <img src="/icons/setting.svg" alt="" />
      </a>
    </div>
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
  padding: 0 20px 92px;
  .header {
    display: flex;
    justify-content: space-between;

    margin-top: 16px;
    > .logo {
      margin: 0;
    }
  }
  .global-hero {
    height: 120px;
  }
}
</style>

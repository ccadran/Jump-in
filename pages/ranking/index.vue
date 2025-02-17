<script lang="ts" setup>
const { data, error } = useFetch("/api/ranking");

console.log(data);
</script>

<template>
  <div><h1>RANKINGS</h1></div>
</template>

<style lang="scss"></style>

<script lang="ts" setup>
const user = useSupabaseUser();
const { data, error } = useFetch(`/api/activity/${user.value!.id}`);

console.log(data);
</script>

<template>
  <div>
    <h1>Les last activity</h1>
  </div>
</template>

<style lang="scss"></style>

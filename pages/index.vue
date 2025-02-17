<script lang="ts" setup>
const showMyGuilds = ref(true);

const handleSwitchChange = (side: "left" | "right") => {
  showMyGuilds.value = side === "left";
  console.log("parentttt", showMyGuilds.value);
};
</script>

<template>
  <h1>Accueil</h1>
  <p>Toutes les guilds etc...</p>

  <div class="hero">
    <h1>Home</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus eos
      rerum aliquam dignissimos nulla soluta quasi dolor totam similique. Eos
      repellendus veniam soluta veritatis quis!
    </p>
  </div>
  <UiSwitch
    leftText="My guilds"
    rightText="Other guilds"
    @switchChange="handleSwitchChange"
  />
</template>

<style lang="scss"></style>

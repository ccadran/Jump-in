<script lang="ts" setup>
const showGuildForm = ref(true);

const handleSwitchChange = (side: "left" | "right") => {
  showGuildForm.value = side === "left";
};
</script>

<template>
  <div class="create-page">
    <div class="global-hero">
      <h1>NEW ONE</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet libero
        odio voluptatibus dolorum commodi, laborum harum. Doloremque facere sint
        quas nostrum adipisci ullam nisi magni.
      </p>
    </div>
    <UiSwitch
      leftText="Guild"
      rightText="Challenge"
      @switchChange="handleSwitchChange"
    />

    <div class="forms">
      <div v-if="showGuildForm" class="guild-form">
        <!-- <GuildForm /> -->
      </div>
      <div v-else class="challenge-form">
        <!-- <ChallengeForm /> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>

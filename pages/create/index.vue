<script lang="ts" setup>
import { CreateChallengeForm, CreateGuildForm } from "#components";

const showGuildForm = ref(true);
const user = useSupabaseUser();
const handleSwitchChange = (side: "left" | "right") => {
  showGuildForm.value = side === "left";
};
</script>

<template>
  <div class="create-page">
    <div class="header">
      <div class="header">
        <a href="/" class="logo">
          <img src="/logo.svg" alt="" />
        </a>
      </div>
    </div>
    <div class="global-hero">
      <h1>NEW ONE</h1>
      <p>
        Create your own guild or new challenges within your guilds. Shape the
        adventure and inspire others to take on new goals!
      </p>
    </div>
    <UiSwitch
      leftText="Guild"
      rightText="Challenge"
      @switchChange="handleSwitchChange"
    />

    <div class="forms">
      <div v-if="showGuildForm" class="guild-form-container">
        <CreateGuildForm />
      </div>
      <div v-else class="challenge-form-container">
        <CreateChallengeForm />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.create-page {
  padding: 0 20px 92px;
  > .global-hero {
    margin-bottom: 32px;
  }
  > .forms {
    margin-top: 32px;
  }
}
</style>

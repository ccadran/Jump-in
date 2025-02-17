<script lang="ts" setup>
import gsap from "gsap";

interface UiSwitchProps {
  leftText: string;
  rightText: string;
}
const props = defineProps<UiSwitchProps>();
const emit = defineEmits(["switchChange"]); // Déclarez l'émetteur

const switchSide = ref<"left" | "right">("left");
const backgroundOn = ref<HTMLDivElement | null>(null);

const toggleSwitch = (side: string) => {
  switchSide.value = side as "left" | "right";
  gsap.to(backgroundOn.value, {
    x: switchSide.value === "left" ? 0 : 130,
    duration: 0.3,
    ease: "power2.inOut",
  });
  emit("switchChange", switchSide.value);
};
</script>

<template>
  <div class="switch">
    <div
      @click="toggleSwitch('left')"
      class="switch-side"
      :class="switchSide == 'left' ? 'active' : ''"
    >
      <span>{{ props.leftText }}</span>
    </div>
    <div
      @click="toggleSwitch('right')"
      class="switch-side"
      :class="switchSide == 'right' ? 'active' : ''"
    >
      <span>{{ props.rightText }}</span>
    </div>
    <div ref="backgroundOn" class="background-on"></div>
  </div>
</template>

<style lang="scss">
.switch {
  display: flex;
  background-color: var(--grey);
  border-radius: 24px;
  width: 260px;
  position: relative;
  > .switch-side {
    width: 130px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dark);
    transition: all 0.3s ease-in-out;
    z-index: 1;
    &.active {
      color: var(--white);
    }
  }
  > .background-on {
    width: 130px;
    height: 100%;
    background-color: var(--blue);
    position: absolute;
    z-index: 0;
    border-radius: 24px;
  }
}
</style>

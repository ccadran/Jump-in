<script lang="ts" setup>
import gsap from "gsap";

interface UiSwitchProps {
  leftText: string;
  rightText: string;
  thirdText?: string;
}
const props = defineProps<UiSwitchProps>();
const emit = defineEmits(["switchChange"]);

const switchSide = ref<"left" | "right" | "third">("left");
const backgroundOn = ref<HTMLDivElement | null>(null);

const toggleSwitch = (side: string) => {
  switchSide.value = side as "left" | "right" | "third";
  let positionX = 0;
  switch (side) {
    case "left":
      positionX = 0;
      break;
    case "right":
      props.thirdText ? (positionX = 115) : (positionX = 130);
      break;
    case "third":
      props.thirdText ? (positionX = 230) : (positionX = 260);

      break;
  }
  gsap.to(backgroundOn.value, {
    x: positionX,
    duration: 0.3,
    ease: "power2.inOut",
  });
  emit("switchChange", switchSide.value);
};
</script>

<template>
  <div class="switch" :class="props.thirdText ? 'three-sides' : ''">
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
    <div
      v-if="props.thirdText"
      @click="toggleSwitch('third')"
      class="switch-side"
      :class="switchSide == 'third' ? 'active' : ''"
    >
      <span>{{ props.thirdText }}</span>
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
    padding: 6px 0;
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
  &.three-sides {
    width: 345px;
    > .switch-side {
      width: 115px;
    }
    > .background-on {
      width: 115px;
    }
  }
}
</style>

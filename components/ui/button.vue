<script lang="ts" setup>
interface UiButtonProps {
  text: string;
  to?: string;
  type?: "button" | "submit" | "reset";
  color?: "blue" | "white";
  disabled?: boolean; // Ajouter la propriété disabled
  size?: "small" | "medium" | "large";
}

const props = defineProps<UiButtonProps>();
</script>

<template>
  <a :href="props.to" class="cta" :class="props.size">
    <button :class="props.color" :disabled="props.disabled" :type="props.type">
      {{ props.text }}
    </button>
  </a>
</template>

<style lang="scss">
.cta.large {
  width: 100%;
  > button {
    width: 100%;
    font-size: 16px;
    padding: 10px;
  }
}
button {
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--blue);
  color: var(--white);
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  &.white {
    background: var(--white);
    color: var(--blue);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed; /* Empêcher le curseur de pointer */
  }
}
</style>

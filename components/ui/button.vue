<script lang="ts" setup>
interface UiButtonProps {
  text: string;
  to?: string;
  type?: "button" | "submit" | "reset";
  color?: "blue" | "white";
  disabled?: boolean; // Ajouter la propriété disabled
}

const props = defineProps<UiButtonProps>();
</script>

<template>
  <a :href="props.to">
    <button :class="props.color" :disabled="props.disabled">
      {{ props.text }}
    </button>
  </a>
</template>

<style lang="scss">
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

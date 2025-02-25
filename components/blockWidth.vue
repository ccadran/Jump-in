<script lang="ts" setup></script>

<template>
  <div class="block-width">
    <div class="modal">
      <div class="confirmation-text">
        <h4>This app is made for mobile width</h4>
        <p>
          This app is designed for larger screens. For the best experience,
          please use a device with a wider display. You can also use the
          inspector to reduce the width if needed.
        </p>
      </div>
    </div>
    <div class="background"></div>
  </div>
</template>

<style lang="scss">
.block-width {
  @media screen and (max-width: 540px) {
    display: none;
  }
  > .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--grey);
    padding: 24px;
    border-radius: 16px;
    width: 90vw;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 3;
    > .confirmation-text {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    > .confirmation-cta {
      display: flex;
      margin-top: 32px;
      gap: 24px;
    }
  }
  > .background {
    height: 100vh;
    width: 100vw;
    position: fixed;
    backdrop-filter: blur(3px);
    background: rgba(0, 0, 0, 0.6);
    top: 0;
    left: 0;
    z-index: 2;
  }
}
</style>

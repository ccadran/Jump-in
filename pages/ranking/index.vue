<script lang="ts" setup>
const { data, error } = useFetch("/api/ranking");

console.log(data);
</script>

<template>
  <div class="ranking-page">
    <div class="header">
      <a href="/" class="logo">
        <img src="/logo.svg" alt="" />
      </a>
    </div>
    <div class="global-hero">
      <h1>RANKING</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex dolorem
        neque, sapiente sed voluptatibus sequi fugiat ipsa? Consectetur
        corrupti, quidem provident cupiditate consequuntur dignissimos deserunt!
      </p>
    </div>
    <div class="rankings-container">
      <div class="top-users-ranking">
        <h4>Top users</h4>
        <div class="ranking-container">
          <div class="diagram-container">
            <div class="diagram">
              <div class="diagram-bar"></div>
              <p>number</p>
            </div>
            <div class="diagram">
              <div class="diagram-bar"></div>
              <p>number</p>
            </div>
            <div class="diagram">
              <div class="diagram-bar"></div>
              <p>number</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ranking-page {
  padding: 0 20px;
  > .rankings-container {
    > .top-users-ranking {
      > .ranking-container {
        background-color: var(--grey);
        height: 240px;
        padding: 20px;
        > .diagram-container {
          background-color: var(--white);
          border: 0.25px solid black;
          height: 100%;
          display: flex;
          justify-content: space-around;
          align-items: end;
          > .diagram {
            height: 70%;
            width: 10%;
            background-color: var(--blue);
          }
        }
      }
    }
  }
}
</style>

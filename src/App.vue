<template>
  <div id="app">
    <div class="app-content">
      <router-view />
    </div>
    <div class="footer-nav">
      <navigation></navigation>
    </div>
  </div>
</template>
<script>
import Navigation from "./views/Navigation.vue";

export default {
  components: {
    Navigation
  }
};
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.app-content {
  width: 100%;
  height: calc(100vh - 150px);
}
.footer-nav {
  width: 100%;
  height: 150px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.8);
}
#cesiumContainer {
  width: 100%;
  height: calc(100vh - 150px);
}
</style>

<!-- 3dtiles模型Inspector小部件 -->
<template>
  <div class="model-wrap">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global Cesium */
export default {
  components: {},

  data() {
    return {};
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    // 创建球
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      shadows: true // 开启阴影
    });
    this.scene = this.viewer.scene;
    // 将Cesium3DTilesInspector小部件添加到viewer中
    this.viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
    this.inpectorViewModel = this.viewer.cesium3DTilesInspector.viewModel;
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 添加3dtiles模型
    this.add3dtiles();
  },

  methods: {
    add3dtiles() {

      const tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(75343)
      });
      this.viewer.scene.primitives.add(tileset);
      tileset.readyPromise.then(tileset => {
        this.viewer.zoomTo(
          tileset,
          new Cesium.HeadingPitchRange(
            0.0,
            -0.5,
            tileset.boundingSphere.radius / 4.0
          )
        );
      });
    }
  }
};
</script>
<style lang="less" scoped></style>

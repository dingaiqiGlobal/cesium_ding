<!-- 3dtiles高度调整 -->
<template>
  <div class="model-wrap">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import { matrixTransform } from '../utils/MatrixTransform';
/* global Cesium */
export default {
  components: {},

  data() {
    return {
      rotateValue: 0,
      translationValue: 0,
      scaleValue: 0,
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      shadows: true // 开启阴影
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.viewer.scene.globe.depthTestAgainstTerrain = true; // 开启深度检测
    this.add3dTiles();
  },

  methods: {
    // 添加3dtiles
    add3dTiles() {
      // let m = new TilesTransform();
      // console.log(m.tilesTransform())
      this.tileset = new Cesium.Cesium3DTileset({
        url: "/data/3dtiles/Tileset/tileset.json"
      });
      this.tileset.readyPromise
        .then(tileset => {
          this.viewer.scene.primitives.add(tileset);
          tileset._root.transform = matrixTransform({
          });

          this.viewer.zoomTo(
            tileset,
            new Cesium.HeadingPitchRange(
              0,
              -0.5,
              tileset.boundingSphere.radius * 2.0
            )
          );
        })
        .otherwise(err => {
          console.log(err);
        });
    }

  }
};
</script>
<style lang="less" scoped>
.panel-wrap {
  z-index: 1;
  width: 300px;
  height: 60px;
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(42, 42, 42, 0.8);
  padding: 4px;
  border-radius: 4px;
  color: #fff;
  text-align: left;

  .title {
    margin-left: 5px;
  }

  .slider-wrap {
    width: 150px;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>

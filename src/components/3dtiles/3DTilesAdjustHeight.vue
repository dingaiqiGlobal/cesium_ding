<!-- 3dtiles高度调整 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="title">高度值</div>
      <div class="value">
        <a-slider v-model="heightValue" :min="-100" :max="100" :step="1" class="slider-wrap" @change="changeHeight" />
        <a-input size="small" v-model="heightValue" style="width: 40px" />
      </div>
    </div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global Cesium */
export default {
  components: {},

  data() {
    return {
      heightValue: 0
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
      this.tileset = new Cesium.Cesium3DTileset({
        url: "/data/3dtiles/Tileset/tileset.json"
      });
      this.tileset.readyPromise
        .then(tileset => {
          this.viewer.scene.primitives.add(tileset);
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
    },
    // 高度值变化修改对应的3dtiles模型高度
    changeHeight() {
      if (isNaN(this.heightValue)) {
        return;
      }
      // 将模型中心点Cartesian笛卡尔坐标转换为Cartographic弧度,为了获取中心点的经纬度
      //carographic制图的（世界坐标）
      const carographic = Cesium.Cartographic.fromCartesian(
        this.tileset.boundingSphere.center // 获取模型中心点
        //Cesium.Ellipsoid.WGS84,//可选
        //new Cesium.Cartographic()//可选
      );
      //从以弧度表示的经度和纬度值返回笛卡尔3位置，高度为0，此未获取模型中心表面的笛卡尔坐标值
      const surface = Cesium.Cartesian3.fromRadians(
        carographic.longitude,
        carographic.latitude,
        0.0
        //Cesium.Ellipsoid.WGS84,//可选
        //new Cesium.Cartesian3()//可选
      );
      // 改变模型高度后的位置
      const offset = Cesium.Cartesian3.fromRadians(
        carographic.longitude,
        carographic.latitude,
        this.heightValue
        //Cesium.Ellipsoid.WGS84,//可选
        //new Cesium.Cartesian3()//可选
      );
      // 计算高度为0跟改变高度后的两个笛卡尔式分量差(抬高坐标的平移分量)
      const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      );
      this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(
        translation
        //new Cesium.Matrix4()//可选
      );
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

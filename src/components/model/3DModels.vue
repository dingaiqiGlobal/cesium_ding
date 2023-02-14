<!-- 加载一些glb跟gltf小模型 -->
<template>
  <div class="model-wrap">
    <div class="select-wrap">
      <a-select v-dark default-value="Aircraft" style="width: 220px" @change="handleChange">
        <a-select-option v-for="(item, index) in selectData" :value="index" :key="index">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global  Cesium*/

export default {
  components: {},

  data() {
    return {
      selectData: [
        {
          name: "Aircraft",
          urlName: "Cesium_Air.glb",
          height: 5000.0
        },
        {
          name: "Drone",
          urlName: "CesiumDrone.glb",
          height: 150
        },
        {
          name: "Ground Vehicle",
          urlName: "GroundVehicle.glb",
          height: 0
        },
        {
          name: "Hot Air Balloon",
          urlName: "CesiumBalloon.glb",
          height: 1000
        },
        {
          name: "Milk Truck",
          urlName: "CesiumMilkTruck.glb",
          height: 0
        },
        {
          name: "skinned Character",
          urlName: "Cesium_Man.glb",
          height: 0
        },
        {
          name: "Draco Compressed Model",
          urlName: "DracoCompressed/CesiumMilkTruck.gltf",
          height: 0
        },
        {
          name: "KTX2 Compressed Balloon",
          urlName: "CesiumBalloonKTX2.glb",
          height: 1000
        }
      ]
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      infoBox: false, //是否弹出右上角的信息框
      selectionIndicator: false, // 是否可点击地图上的数据
      shadows: true, // 是否开启阴影
      shouldAnimate: true // 是否开启动画 （下面的模型中有的是带动画的，需要开启此属性才会启动动画）
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.handleChange(0);
  },

  methods: {
    handleChange(index) {
      const item = this.selectData[index];
      this.viewer.entities.removeAll(); // 清除全部的实体
      // 度转换为Cartesian3
      let position = Cesium.Cartesian3.fromDegrees(
        -123.0744619,
        44.0403706,
        item.height
      );
      let heading = Cesium.Math.toRadians(135); // 摇头 角度
      let pitch = 0; // 点头角度
      let roll = 0; // 翻滚角度
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      // 位置跟三个方向的角度计算出方向
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      const entity = this.viewer.entities.add({
        name: item.name,
        position: position,
        orientation: orientation,
        model: {
          uri: `/data/model/${item.urlName}`,
          mininumPixelSize: 128,
          maxinumScale: 20000
        }
      });
      this.viewer.trackedEntity = entity; // 定位到实体
    }
  },
  beforeDestroy() {
    this.viewer.entities.removeAll(); // 清除全部的实体
    this.viewer.destroy();
  }
};
</script>
<style lang="less" scoped>
.select-wrap {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1;
}
</style>

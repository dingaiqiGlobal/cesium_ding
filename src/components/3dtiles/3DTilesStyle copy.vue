<!-- 3dtiles样式修改
示例说明：如何使用3dtiles样式语言来设置各个要素（如建筑物）的 样式
 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="select-wrap">
        <a-select v-dark default-value="Color By Building Material" style="width: 250px; margin-right: 10px" size="small"
          @change="changeStyle">
          <a-select-option v-for="(item, index) in selectData" :value="item.name" :key="index">
            {{ item.name }}
          </a-select-option>
        </a-select>
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
      selectData: [
        {
          name: "Color By Building Material"
        },
        {
          name: "Color By Distance To Selected Location"
        },
        {
          name: "Highlight Residential Buildings"
        },
        {
          name: "Show Office Buildings Only"
        },
        {
          name: "Show Apartment Buildings Only"
        }
      ]
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: Cesium.createWorldTerrain() // 开启全球地形
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 注册事件处理器
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    // 添加3dtiles
    this.add3dtiles();
    // 设置初始化视角
    this.viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-122.3472, 47.598, 370),
      orientation: {
        heading: Cesium.Math.toRadians(10),
        pitch: Cesium.Math.toRadians(-10)
      }
    });
  },

  methods: {
    // 添加3dtiles
    add3dtiles() {
      // 添加osm build
      this.osmBuildingsTileset = Cesium.createOsmBuildings();
      this.viewer.scene.primitives.add(this.osmBuildingsTileset);
      this.changeStyle("Color By Building Material");
    },
    changeStyle(type) {
      const style = this.getStyleByType(type);
      this.osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle(style);
    },
    getStyleByType(type) {
      let style = "";
      switch (type) {
        case "Color By Building Material":
          style = {
            defines: {
              material: "${feature['building:material']}"
            },
            color: {
              conditions: [
                ["${material} === null", "color('white')"],
                ["${material} === 'glass'", "color('skyblue', 0.5)"],
                ["${material} === 'concrete'", "color('grey')"],
                ["${material} === 'brick'", "color('indianred')"],
                ["${material} === 'stone'", "color('lightslategrey')"],
                ["${material} === 'metal'", "color('lightgrey')"],
                ["${material} === 'steel'", "color('lightsteelblue')"],
                ["true", "color('white')"] // This is the else case
              ]
            }
          };
          break;
        case "Color By Distance To Selected Location":
          // 默认选取一个点
          style = this.colorByDistanceToCoordinate(47.62051, -122.34931);
          //注册鼠标点击事件
          this.clickEvent();
          break;
        case "Highlight Residential Buildings":
          style = {
            color: {
              conditions: [
                [
                  "${feature['building']} === 'apartments' || ${feature['building']} === 'residential'",
                  "color('cyan', 0.9)"
                ],
                ["true", "color('white')"]
              ]
            }
          };
          break;
        case "Show Office Buildings Only":
          style = {
            show: "${feature['building']} === 'office'"
          };
          break;
        case "Show Apartment Buildings Only":
          style = {
            show: "${feature['building']} === 'apartments'"
          };
          break;
        default:
          break;
      }
      return style;
    },
    clickEvent() {
      const self = this;
      this.handler.setInputAction(movement => {
        // 点击后取消viewer追踪的entity，即不显示infobox弹框
        self.viewer.selectedEntity = undefined;
        const pickedBuilding = self.viewer.scene.pick(movement.position);
        if (pickedBuilding) {
          const pickedLatitude = pickedBuilding.getProperty("cesium#latitude");
          const pickedLongitude = pickedBuilding.getProperty(
            "cesium#longitude"
          );
          const style = self.colorByDistanceToCoordinate(
            pickedLatitude,
            pickedLongitude
          );
          self.osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle(style);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 根据距离点位的距离模型显示不同的颜色
    colorByDistanceToCoordinate(pickedLatitude, pickedLongitude) {
      let result = {
        defines: {
          distance:
            "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(" +
            pickedLongitude +
            "," +
            pickedLatitude +
            "))"
        },
        color: {
          conditions: [
            ["${distance} > 0.014", "color('blue')"],
            ["${distance} > 0.010", "color('green')"],
            ["${distance} > 0.006", "color('yellow')"],
            ["${distance} > 0.0001", "color('red')"],
            ["true", "color('white')"]
          ]
        }
      };
      return result;
    }
  }
};
</script>
<style lang="less" scoped>
.panel-wrap {
  z-index: 1;
  position: fixed;
  top: 20px;
  left: 20px;
}
</style>

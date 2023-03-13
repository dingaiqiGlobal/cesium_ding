<!-- 3dtiles的一些操作(inspector小部件) -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="select-wrap">
        <a-select v-dark default-value="Tileset" style="width: 220px; margin-right: 10px" size="small"
          @change="add3dTiles">
          <a-select-option v-for="(item, index) in selectData" :value="item.urlName" :key="index">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-checkbox v-dark v-model="showShadows" @change="changeShadows">
          阴影
        </a-checkbox>
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
      showShadows: true,
      selectData: [
        {
          name: "Tileset",
          urlName: "Tileset"
        },
        {
          name: "Translucent/半透明",
          urlName: "BatchedTranslucent"
        },
        {
          name: "Translucent/Opaque/半透明/透明",
          urlName: "BatchedTranslucentOpaqueMix"
        },
        {
          name: "Multi-color/多色",
          urlName: "BatchedColors"
        },
        {
          name: "Request Volume/请求总量",
          urlName: "TilesetWithViewerRequestVolume"
        },
        {
          name: "Batched/批量表",
          urlName: "BatchedWithBatchTable"
        },
        {
          name: "Instanced/实例",
          urlName: "InstancedWithBatchTable"
        },
        {
          name: "Instanced/Orientation/实例/目标",
          urlName: "InstancedOrientation"
        },
        {
          name: "Composite/复合",
          urlName: "Composite"
        },
        {
          name: "PointCloud/点云",
          urlName: "PointCloudRGB"
        },
        {
          name: "PointCloudConstantColor/点云常规颜色",
          url: "PointCloudConstantColor"
        },
        {
          name: "PointCloudNormals/点云法线",
          urlName: "PointCloudNormals"
        },
        {
          name: "PointCloudBatched/点云批量表",
          urlName: "PointCloudBatched"
        },
        {
          name: "PointCloudDraco/点云德拉古",
          urlName: "PointCloudDraco"
        }
      ]
    };
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
    this.viewer.clock.currentTime = new Cesium.JulianDate(2457522.154792); //设置时间
    // 添加3dtiles模型
    this.add3dTiles("Tileset");
    // 初始化注册事件
    this.initEvent();
  },

  methods: {
    // 添加3dtiles模型
    add3dTiles(url) {
      if (this.tileset) {
        this.viewer.scene.primitives.remove(this.tileset);
      }
      this.tileset = new Cesium.Cesium3DTileset({
        url: "/data/3dtiles/" + url + "/tileset.json"
      });
      this.viewer.scene.primitives.add(this.tileset);
      this.tileset.readyPromise
        .then(tileset => {
          // 将当前添加的模型赋值给inpector小部件
          this.inpectorViewModel.tileset = tileset;
          // 定位到
          //console.log(100.0 - tileset.boundingSphere.radius);
          this.viewer.zoomTo(
            tileset,
            new Cesium.HeadingPitchRange(
              0,
              -2.0,
              Math.max(100.0 - tileset.boundingSphere.radius, 0.0)
            )
          );
          // 获取模型的属性信息
          const properties = tileset.properties;
          // 如果模型有属性信息并且属性信息内有Height字段
          if (Cesium.defined(properties) && Cesium.defined(properties.Height)) {
            // 根据属性Height不同改不对应的模型颜色
            tileset.style = new Cesium.Cesium3DTileStyle({
              color: {
                conditions: [
                  ["${Height} >= 83", "color('purple', 0.5)"],
                  ["${Height} >= 80", "color('red')"],
                  ["${Height} >= 70", "color('orange')"],
                  ["${Height} >= 12", "color('yellow')"],
                  ["${Height} >= 7", "color('lime')"],
                  ["${Height} >= 1", "color('cyan')"],
                  ["true", "color('blue')"]
                ]
              }
            });
          }
        })
        .otherwise(err => {
          throw err;
        });
    },
    // 注册事件
    initEvent() {
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
      // 鼠标左键单击事件，控制台输出属性信息
      handler.setInputAction(() => {
        // 获取当前所点击的的feature
        const feature = this.inpectorViewModel.feature;
        if (Cesium.defined(feature)) {
          const propertyNames = feature.getPropertyNames();
          const length = propertyNames.length;
          for (let i = 0; i < length; ++i) {
            const propertyName = propertyNames[i];
            console.log(propertyName + ":" + feature.getProperty(propertyName));
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // 鼠标中间单击事件
      handler.setInputAction(() => {
        var feature = this.inpectorViewModel.feature;
        if (Cesium.defined(feature)) {
          feature.show = false;
        }
      }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
    },
    // 是否显示阴影
    changeShadows(e) {
      this.viewer.shadows = e.target.checked;
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

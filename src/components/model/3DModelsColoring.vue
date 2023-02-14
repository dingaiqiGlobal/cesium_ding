<!-- 动态修改小模型的颜色 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="model-color">
        <div class="title">模型颜色</div>
        <div class="content">
          <div class="row">
            <div class="name">模式：</div>
            <div class="value">
              <a-select
                v-dark
                v-model="viewModel.colorBlendMode"
                style="width: 120px"
                size="small"
                @change="changeAllParams"
              >
                <a-select-option
                  v-for="(item, index) in viewModel.colorBlendModes"
                  :value="item"
                  :key="index"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="row">
            <div class="name">颜色：</div>
            <div class="value">
              <a-select
                v-dark
                v-model="viewModel.color"
                style="width: 120px"
                size="small"
                @change="changeAllParams"
              >
                <a-select-option
                  v-for="(item, index) in viewModel.colors"
                  :value="item"
                  :key="index"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="row">
            <div class="name">透明度：</div>
            <div class="value">
              <a-slider
                size="small"
                style="width: 120px;vertical-align: middle;"
                :min="0"
                :max="1"
                :step="0.01"
                v-model="viewModel.alpha"
                @change="changeAllParams"
              />
              <a-input
                size="small"
                v-model="viewModel.alpha"
                style="width: 40px"
              />
            </div>
          </div>
          <div class="row">
            <div class="name">混合值：</div>
            <div class="value">
              <a-slider
                size="small"
                style="width: 120px;vertical-align: middle;"
                v-model="viewModel.colorBlendAmount"
                :disabled="!viewModel.colorBlendAmountEnabled"
                @change="changeAllParams"
              />
              <a-input
                size="small"
                v-model="viewModel.colorBlendAmount"
                :disabled="!viewModel.colorBlendAmountEnabled"
                style="width: 40px"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="model-Silhouette">
        <div class="title">轮廓颜色</div>
        <div class="content">
          <div class="row">
            <div class="name">颜色：</div>
            <div class="value">
              <a-select
                v-dark
                v-model="viewModel.silhouetteColor"
                style="width: 120px"
                size="small"
                @change="changeAllParams"
              >
                <a-select-option
                  v-for="(item, index) in viewModel.silhouetteColors"
                  :value="item"
                  :key="index"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="row">
            <div class="name">透明度：</div>
            <div class="value">
              <a-slider
                size="small"
                style="width: 120px;vertical-align: middle;"
                :min="0"
                :max="1"
                :step="0.01"
                v-model="viewModel.silhouetteAlpha"
                @change="changeAllParams"
              />
              <a-input
                size="small"
                v-model="viewModel.silhouetteAlpha"
                style="width: 40px"
              />
            </div>
          </div>
          <div class="row">
            <div class="name">宽度：</div>
            <div class="value">
              <a-slider
                size="small"
                style="width: 120px;vertical-align: middle;"
                :min="0"
                :max="10"
                :step="0.01"
                v-model="viewModel.silhouetteSize"
                @change="changeAllParams"
              />
              <a-input
                size="small"
                v-model="viewModel.silhouetteSize"
                style="width: 40px"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <a-select
          v-dark
          default-value="Aircraft"
          style="width: 130px"
          size="small"
          @change="handleChange"
        >
          <a-select-option
            v-for="(item, index) in selectData"
            :value="index"
            :key="index"
          >
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
      viewModel: {
        color: "Red",
        colors: ["White", "Red", "Green", "Blue", "Yellow", "Gray"],
        alpha: 1.0,
        colorBlendMode: "Highlight",
        colorBlendModes: ["Highlight", "Replace", "Mix"],
        colorBlendAmount: 0.5,
        colorBlendAmountEnabled: false,
        silhouetteColor: "Red",
        silhouetteColors: ["Red", "Green", "Blue", "Yellow", "Gray"],
        silhouetteAlpha: 1.0,
        silhouetteSize: 2.0
      },
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
        }
      ]
    };
  },

  computed: {},

  mounted() {
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
    modeChange() {},
    // 切换模型
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
      this.entity = this.viewer.entities.add({
        name: item.name,
        position: position,
        orientation: orientation,
        model: {
          uri: `/data/model/${item.urlName}`,
          mininumPixelSize: 128,
          maxinumScale: 20000
        }
      });
      this.viewer.trackedEntity = this.entity; // 定位到实体
      this.changeAllParams();
    },
    // 模型参数修改
    changeAllParams() {
      if (this.viewModel.colorBlendMode === "Mix") {
        this.colorBlendAmountEnabled = true;
      } else {
        this.colorBlendAmountEnabled = false;
      }
      const model = this.entity.model;
      // 模型的颜色混合模式
      model.colorBlendMode =
        Cesium.ColorBlendMode[this.viewModel.colorBlendMode.toUpperCase()];
      // 模型颜色、透明度
      let color = Cesium.Color[this.viewModel.color.toUpperCase()];
      color = Cesium.Color.fromAlpha(color, parseFloat(this.viewModel.alpha));
      model.color = color;
      // 模型混合模式下 的混合值
      model.colorBlendAmount = parseFloat(this.viewModel.colorBlendAmount);
      // 轮廓颜色、透明度
      let silhouetteColor =
        Cesium.Color[this.viewModel.silhouetteColor.toUpperCase()];
      silhouetteColor = Cesium.Color.fromAlpha(
        silhouetteColor,
        parseFloat(this.viewModel.silhouetteAlpha)
      );
      model.silhouetteColor = silhouetteColor;
      // 轮廓大小
      model.silhouetteSize = parseFloat(this.viewModel.silhouetteSize);
    }
  },
  beforeDestroy() {
    this.viewer.entities.removeAll(); // 清除全部的实体
    this.viewer.destroy();
  }
};
</script>
<style lang="less" scoped>
.panel-wrap {
  z-index: 1;
  width: 330px;
  height: 345px;
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(42, 42, 42, 0.8);
  padding: 4px;
  border-radius: 4px;
  color: #fff;
  text-align: left;
  padding: 8px;
  .content {
    font-size: 12px;
    .row {
      margin: 5px 0;
      .name {
        width: 100px;
      }
      div {
        display: inline-block;
      }
    }
  }
}
</style>

<!-- 泛光 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <a-checkbox
        v-dark
        size="small"
        v-model="viewModel.show"
        @change="updatePostProcess"
      >
        Bloom
      </a-checkbox>
      <a-checkbox
        v-dark
        size="small"
        v-model="viewModel.glowOnly"
        @change="updatePostProcess"
      >
        Glow only
      </a-checkbox>
      <div class="row">
        <div class="name">Contrast：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="-255"
            :max="255"
            :step="0.01"
            v-model="viewModel.contrast"
            @change="updatePostProcess"
          />
          <a-input
            size="small"
            v-model="viewModel.contrast"
            style="width: 40px"
          />
        </div>
      </div>
      <div class="row">
        <div class="name">Brightness：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="-1"
            :max="1"
            :step="0.01"
            v-model="viewModel.brightness"
            @change="updatePostProcess"
          />
          <a-input
            size="small"
            v-model="viewModel.brightness"
            style="width: 40px"
          />
        </div>
      </div>
      <div class="row">
        <div class="name">Delta：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="1"
            :max="5"
            :step="0.01"
            v-model="viewModel.delta"
            @change="updatePostProcess"
          />
          <a-input size="small" v-model="viewModel.delta" style="width: 40px" />
        </div>
      </div>
      <div class="row">
        <div class="name">Sigma：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="1"
            :max="10"
            :step="0.01"
            v-model="viewModel.sigma"
            @change="updatePostProcess"
          />
          <a-input size="small" v-model="viewModel.sigma" style="width: 40px" />
        </div>
      </div>
      <div class="row">
        <div class="name">Step Size：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="0"
            :max="7"
            :step="0.01"
            v-model="viewModel.stepSize"
            @change="updatePostProcess"
          />
          <a-input
            size="small"
            v-model="viewModel.blurStstepSizepSize"
            style="width: 40px"
          />
        </div>
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
        show: true,
        glowOnly: false,
        contrast: 128,
        brightness: -0.3,
        delta: 1.0,
        sigma: 3.78,
        stepSize: 5.0
      }
    };
  },

  computed: {},

  mounted() {
    // 创建球
    this.viewer = new Cesium.Viewer("cesiumContainer");
    // 去掉版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 添加小模型
    const numberOfBalloons = 13; // 定义模型的数量值
    const lonIncrement = 0.00025; // 定义模型的经纬增量值
    const initialLon = -122.99875; // 初始化模型经度
    const lat = 44.0503706; // 模型纬度
    const height = 100.0; // 模型高度
    const url = "/data/model/CesiumBalloon.glb"; // 模型地址
    for (let i = 0; i < numberOfBalloons; ++i) {
      const lon = initialLon + i * lonIncrement;
      this.createModel(url, lon, lat, height);
    }
    // 视角定位
    const target = Cesium.Cartesian3.fromDegrees(
      initialLon + lonIncrement,
      lat,
      height + 7.5
    );
    const offset = new Cesium.Cartesian3(
      -37.048378684557974,
      -24.852967044804245,
      4.352023653686047
    );
    this.viewer.scene.camera.lookAt(target, offset);
  },

  methods: {
    // 创建模型 glb
    createModel(url, x, y, height) {
      const position = Cesium.Cartesian3.fromDegrees(x, y, height);
      this.viewer.entities.add({
        name: url,
        position,
        model: {
          uri: url
        }
      });
    },
    // 泛光参数更新
    updatePostProcess() {
      const bloom = this.viewer.scene.postProcessStages.bloom;
      bloom.enabled = Boolean(this.viewModel.show); // 是否启用泛光效果
      bloom.uniforms.glowOnly = Boolean(this.viewModel.glowOnly); //  仅看泛光
      bloom.uniforms.contrast = Number(this.viewModel.contrast); // 对比度
      bloom.uniforms.brightness = Number(this.viewModel.brightness); // 亮度
      bloom.uniforms.delta = Number(this.viewModel.delta); //
      bloom.uniforms.sigma = Number(this.viewModel.sigma);
      bloom.uniforms.stepSize = Number(this.viewModel.stepSize);
    }
  }
};
</script>
<style lang="less" scoped>
.panel-wrap {
  z-index: 1;
  width: 330px;
  height: 270px;
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(42, 42, 42, 0.8);
  padding: 4px;
  border-radius: 4px;
  color: #fff;
  text-align: left;
  padding: 8px;
  font-size: 12px;
  .row {
    margin: 5px 0;
    .name {
      width: 120px;
    }
    div {
      display: inline-block;
    }
  }
}
</style>

<!-- 3dtiles事件交互 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="title">右键单击操作：</div>
      <div class="value">
        <a-radio-group v-dark v-model="rightValue" size="small">
          <a-radio v-for="(item, index) in rightData" :key="index" :value="item.value">
            {{ item.name }}
          </a-radio>
        </a-radio-group>
      </div>
      <div class="title">中键单击操作：</div>
      <div class="value">
        <a-radio v-dark checked>隐藏要素</a-radio>
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
      rightValue: "annotate",
      rightData: [
        {
          name: "标签信息",
          value: "annotate"
        },
        {
          name: "属性输出",
          value: "properties"
        },
        {
          name: "定位要素",
          value: "zoom"
        }
      ]
    };
  },

  computed: {},

  mounted() {
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: Cesium.createWorldTerrain() // 添加全球地形
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 是否支持拾取坐标
    if (!this.viewer.scene.pickPositionSupported) {
      window.alert("浏览器不支持拾取位置");
    }
    this.viewer.scene.globe.depthTestAgainstTerrain = true; // 开启深度检测
    // 初始化定义并添加标签集合
    this.annotations = this.viewer.scene.primitives.add(
      new Cesium.LabelCollection()
    );
    // 定义初始位置
    const initialPosition = Cesium.Cartesian3.fromDegrees(
      -74.01881302800248,
      40.69114333714821,
      753
    );
    // 定义初始方向
    const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
      21.27879878293835,
      -21.34390550872461,
      0.0716951918898415
    );
    // 定位到
    this.viewer.scene.camera.setView({
      destination: initialPosition,
      orientation: initialOrientation,
      endTransform: Cesium.Matrix4.IDENTITY
    });
    // 添加3dtiles
    this.add3dtiles();
    // 初始化右键事件
    this.initRightEvent();
  },

  methods: {
    // 添加3dtiles
    add3dtiles() {
      this.tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(75343)
      });
      this.viewer.scene.primitives.add(this.tileset);
      // 设置meta信息
      this.tileset.style = new Cesium.Cesium3DTileStyle({
        meta: {
          description: "'Building ${BIN} has height ${Height}'"
        }
      });
    },
    // 初始化右键事件
    initRightEvent() {
      // 定义事假处理器
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
      // 鼠标右键单击事件
      handler.setInputAction(movement => {
        // 获取点击的feature
        const feature = this.viewer.scene.pick(movement.position);
        // 如果没选中feature时 返回
        if (!Cesium.defined(feature)) {
          return;
        }
        // 根据界面上单选框的值 走对应的方法
        if (this.rightValue === "annotate") {
          // 标签显示信息
          this.annotate(movement, feature);
        } else if (this.rightValue === "properties") {
          // 控制台打印属性信息
          this.printProperties(movement, feature);
        } else if (this.rightValue === "zoom") {
          // 定位到当前feature
          this.zoom(movement, feature);
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      // 鼠标中建单击事件
      handler.setInputAction(movement => {
        // 获取选中的feature
        const feature = this.viewer.scene.pick(movement.position);
        if (!Cesium.defined(feature)) {
          return;
        }
        // 隐藏选中的feature
        feature.show = false;
      }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
    },
    // 标签显示信息
    annotate(movement) {
      // 如果支持选中位置
      if (this.viewer.scene.pickPositionSupported) {
        // 获取点击的位置坐标 类型为（Cartesian3）
        const cartesian = this.viewer.scene.pickPosition(movement.position);
        if (Cesium.defined(cartesian)) {
          // 笛卡尔坐标转弧度
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          // 根据弧度获取当前位置的高度，保留2位小数
          const height = cartographic.height.toFixed(2) + "m";
          // 添加到标签集合中
          this.annotations.add({
            position: cartesian, // 位置
            text: height, // 文本
            showBackground: true, // 是否显示背景
            font: "14px monospace", // 字体
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //设置水平对齐方式，此为向左对齐
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 设置垂直对齐方式，与底部对齐
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          });
        }
      }
    },
    // 打印属性信息
    printProperties(movement, feature) {
      console.log("Properties:");
      // 获取所有的属性名称数组
      const propertyNames = feature.getPropertyNames();
      const length = propertyNames.length;
      for (let i = 0; i < length; ++i) {
        const propertyName = propertyNames[i];
        console.log(propertyName + ":" + feature.getProperty(propertyName));
      }
      // 打印meta描述信息
      console.log(
        "Description:" + this.tileset.style.meta.description.evaluate(feature)
      );
    },
    // 定位到feature元素
    zoom(movement, feature) {
      // 获取经度属性值（经纬度转弧度）
      const longitude = Cesium.Math.toRadians(feature.getProperty("Longitude"));
      // 获取纬度属性值
      const latitude = Cesium.Math.toRadians(feature.getProperty("Latitude"));
      // 获取高度属性值
      const height = feature.getProperty("Height");
      // 获取位置弧度制, 高度为一半
      const positionCartographic = new Cesium.Cartographic(
        longitude,
        latitude,
        height * 0.5
      );
      // 弧度转笛卡尔坐标
      const position = this.viewer.scene.globe.ellipsoid.cartographicToCartesian(
        positionCartographic
      );
      // 获取当前相机
      const camera = this.viewer.scene.camera;
      // 获取heading（航向角摇头方向)
      const heading = camera.heading;
      // 获取拍提成（俯仰角即点头方向）
      const pitch = camera.pitch;
      const offset = this.offsetFromHeadingPitchRange(
        heading,
        pitch,
        height * 2
      );
      const transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      Cesium.Matrix4.multiplyByPoint(transform, offset, position);
      camera.flyTo({
        destination: position,
        orientation: {
          heading: heading,
          pitch: pitch
        },
        easingFunction: Cesium.EasingFunction.QUADRATIC_OUT
      });
    },
    offsetFromHeadingPitchRange(heading, pitch, range) {
      pitch = Cesium.Math.clamp(
        pitch,
        -Cesium.Math.PO_OVER_TWO,
        Cesium.Math.PI_OVER_TWO
      );
      heading = Cesium.Math.zeroToTwoPi(heading) - Cesium.Math.PI_OVER_TWO;
      const pitchQuat = Cesium.Quaternion.fromAxisAngle(
        Cesium.Cartesian3.UNIT_Y,
        -pitch
      );
      const headingQuat = Cesium.Quaternion.fromAxisAngle(
        Cesium.Cartesian3.UNIT_Z,
        -heading
      );
      const rotQuat = Cesium.Quaternion.multiply(
        headingQuat,
        pitchQuat,
        headingQuat
      );
      const rotMatrix = Cesium.Matrix3.fromQuaternion(rotQuat);
      const offset = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_X);
      Cesium.Matrix3.multiplyByVector(rotMatrix, offset, offset);
      Cesium.Cartesian3.negate(offset, offset);
      Cesium.Cartesian3.multiplyByScalar(offset, range, offset);
      return offset;
    }
  }
};
</script>
<style lang="less" scoped>
.panel-wrap {
  z-index: 1;
  width: 150px;
  height: 160px;
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
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .value {
    margin-left: 15px;
  }
}
</style>

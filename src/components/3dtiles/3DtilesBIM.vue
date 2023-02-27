<!-- 3dtiles BIM -->
<template>
  <div class="model-wrap">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global  Cesium*/
export default {
  components: {},

  data() {
    return {
      elementMap: [], // 存储全部的feature
      selectedFeature: null // 已经选中的feature
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer");
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.scene = this.viewer.scene;
    // 添加BIM模型
    this.tileset = this.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(8564)
      })
    );
    this.tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE; // 模型颜色修改为替换模式
    this.tileset.readyPromise
      .then(tileset => {
        // 定位到
        this.viewer.zoomTo(
          tileset,
          new Cesium.HeadingPitchRange(
            0.5, // 摇头方向
            -0.2, // 点头方向
            tileset.boundingSphere.radius * 4.0 // 距离模型中心点的距离
          )
        );
      })
      .otherwise(err => {
        console.log(err);
      });
    // 事件注册
    this.heighLightEvent();
    this.$notification["warning"]({
      message: "鼠标触摸模型高亮选中单体",
      duration: null,
      top: "50px"
    });
  },

  methods: {
    // 初始化事件注册（BIM模型全部加载完成、卸载BIM、鼠标移动）
    heighLightEvent() {
      const self = this;
      const handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
      // 鼠标移动事件
      handler.setInputAction(movement => {
        // 点击模型获取选中的feature
        const feature = self.scene.pick(movement.endPosition);
        // 重置高亮
        self.unselectFeature(this.selectedFeature);
        // instanceof 判断某个变量是否是某个对象的实例
        if (feature instanceof Cesium.Cesium3DTileFeature) {
          // 设置高亮
          self.selectFeature(feature);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      // 模型加载完成事件
      self.tileset.tileLoad.addEventListener(tile => {
        // 根据tile去获取content再根据content获取feature。 loadFeature是一个回调函数
        self.processTileFeatures(tile, self.loadFeature);
      });
    },
    processTileFeatures(tile, callback) {
      const content = tile.content; // 表示实际有效加载的tile，而不是json文件里面内容元数据 Cesium3DTileContent
      const innerContents = content.innerContents; // 获取子content
      if (Cesium.defined(innerContents)) {
        const length = innerContents.length;
        for (let i = 0; i < length; ++i) {
          this.processContentFeatures(innerContents[i], callback);
        }
      } else {
        this.processContentFeatures(content, callback);
      }
    },
    processContentFeatures(content, callback) {
      const featuresLength = content.featuresLength; // 获取content内feature的长度
      for (let i = 0; i < featuresLength; ++i) {
        const feature = content.getFeature(i); // content根据索引值获取feature
        callback(feature);
      }
    },
    loadFeature(feature) {
      const element = this.getElement(feature); // 获取feature的element， element相当于id值
      let features = this.elementMap[element]; // 获取索引值为element对应的feature
      if (!Cesium.defined(features)) {
        features = [];
        this.elementMap[element] = features;
      }
      features.push(feature); // elementMap 已经添加element对应下的feature
    },
    getElement(feature) {
      return parseInt(feature.getProperty("element"), 10);
    },
    // 重置高亮
    unselectFeature(feature) {
      if (!Cesium.defined(feature)) {
        return;
      }
      //在此tileset中，每个要素都有一个“element”属性，它是一个全局ID
      const element = feature.getProperty("element");
      this.setElementColor(element, Cesium.Color.WHITE);
    },
    //设置高亮
    selectFeature(feature) {
      const element = feature.getProperty("element"); // feature获取属性element的值
      this.setElementColor(element, Cesium.Color.YELLOW); // 高亮颜色设置
      this.selectedFeature = feature; // 当前选中的feature
    },
    // 跟选中feature设置高亮色
    setElementColor(element, color) {
      const featuresToColor = this.elementMap[element];
      const length = featuresToColor.length;
      for (let i = 0; i < length; ++i) {
        const feature = featuresToColor[i];
        feature.color = Cesium.Color.clone(color, feature.color);
      }
    }
  },
  beforeDestroy() {
    this.viewer.destroy();
    this.$notification.destroy();
  }
};
</script>
<style lang="less" scoped>

</style>

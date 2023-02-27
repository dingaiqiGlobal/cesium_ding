<!-- 模型平面裁剪 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="select-wrap">
        <a-select v-dark default-value="Model" style="width: 120px; margin-right: 10px" size="small"
          @change="loadTileOrModel">
          <a-select-option v-for="(item, index) in selectData" :value="item.name" :key="index">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-checkbox v-dark v-model="debugBoundingVolumesEnabled" @change="changeBound">
          显示边界框
        </a-checkbox>
        <a-checkbox v-dark v-model="edgeStylingEnabled" @change="changeStyle">
          开启边缘样式
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
      selectData: [
        { name: "BIM" },
        { name: "Point Clound" },
        { name: "Instanced" },
        { name: "Model" }
      ],
      edgeStylingEnabled: true,//启用边缘样式
      debugBoundingVolumesEnabled: false,//包围
      clippingPlanes: null,//裁切平面
      planeEntities: [],
      targetY: 0
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    // 创建球
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      infoBox: false,
      selectionIndicator: false
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 先创建裁剪平面，然后用鼠标上下拖动平面去裁剪模型
    // 加载模型（3dtiles模型或者glb小模型）
    this.loadTileOrModel("Model"); // 初始化加载BIM模型
    this.initEvent(); // 初始化事件（鼠标按下、移动、抬起）
  },

  methods: {
    // 模型切换
    loadTileOrModel(type) {
      this.reset(); // 重置
      let url = "";
      switch (type) {
        case "BIM":
          url = Cesium.IonResource.fromAssetId(8564);
          this.loadTileset(url);
          break;
        case "Point Clound":
          url = Cesium.IonResource.fromAssetId(16421);
          this.loadTileset(url);
          break;
        case "Instanced":
          url = "/data/3dtiles/InstancedOrientation/tileset.json";
          this.loadTileset(url);
          break;
        case "Model":
          url = "/data/model/Cesium_Air.glb";
          this.loadModel(url);
          break;
        default:
          break;
      }
    },
    createPlaneUpdateFunction(plane) {
      const self = this;
      return function () {
        plane.distance = self.targetY;
        return plane;
      };
    },
    // 加载3dtiles模型
    loadTileset(url) {
      const self = this;
      this.createClipPlane(); // 创建裁剪平面
      // 添加3dtiles
      this.tileset = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url,
          clippingPlanes: this.clippingPlanes // 裁切平面
        })
      );
      this.tileset.debugShowBoundingVolume = this.debugBoundingVolumesEnabled; // 是否显示包围盒
      this.tileset.readyPromise
        .then(tileset => {
          const boundingSphere = tileset.boundingSphere;
          const radius = boundingSphere.radius; // 模型边界半径
          this.viewer.zoomTo(
            //
            tileset,
            new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4.0)
          );
          /**
           * 重要
           */
          // 裁剪平面初始定位在模型根变换处
          // 应用一个附加矩阵使剪裁平面在边界球体中心居中
          if (!Cesium.Matrix4.equals(tileset.root.transform, Cesium.Matrix4.IDENTITY)) {//将此矩阵与所提供的矩阵进行组件比较，如果相等则返回true，否则返回false
            // 获取3dtiles模型矩阵的平移部分 结果为Cartesian3
            const transformCenter = Cesium.Matrix4.getTranslation(tileset.root.transform, new Cesium.Cartesian3());
            // 转成弧度
            const transformCartographic = Cesium.Cartographic.fromCartesian(transformCenter);
            // 获取球体中心
            const boundingSphereCartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
            //球体的高度 - 模型平移部分的高度
            const height = boundingSphereCartographic.height - transformCartographic.height;
            //指定相对于剪裁平面原始坐标系的附加变换的4x4变换矩阵(Cartesian3创建一个Matrix4实例)。
            this.clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, height));
          }
          for (let i = 0; i < this.clippingPlanes.length; ++i) {
            const plane = this.clippingPlanes.get(i); // 获取裁剪平面
            const planeEntity = this.viewer.entities.add({
              // 添加裁剪平面实体
              position: boundingSphere.center, // 位置在边界球体中心
              plane: {
                dimensions: new Cesium.Cartesian2(radius * 2.5, radius * 2.5), //平面大小
                material: Cesium.Color.WHITE.withAlpha(0.1),
                plane: new Cesium.CallbackProperty( //随着时间变化修改平面的高度值
                  self.createPlaneUpdateFunction(plane),
                  false // false表示每次值都是变化的
                ),
                outline: true,
                outlineColor: Cesium.Color.WHITE
              }
            });
            this.planeEntities.push(planeEntity);
          }
        })
        .otherwise(err => {
          console.log(err);
        });
    },
    // 加载glb小模型
    loadModel(url) {
      this.createClipPlane(); // 创建裁剪平面
      const position = Cesium.Cartesian3.fromDegrees(
        // 平面位置
        -123.0744619,
        44.0503706,
        300.0
      );
      const heading = Cesium.Math.toRadians(135.0);
      const pitch = 0.0;
      const roll = 0.0;
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        // 模型方向
        position,
        hpr
      );
      const entity = this.viewer.entities.add({
        // 添加小模型
        name: url,
        position: position,
        orientation: orientation,
        model: {
          uri: url,
          scale: 8,
          mininumPixeSize: 100.0,
          clippingPlanes: this.clippingPlanes
        }
      });
      this.viewer.trackedEntity = entity;
      for (let i = 0; i < this.clippingPlanes.length; ++i) {
        const plane = this.clippingPlanes.get(i);
        const planeEntity = this.viewer.entities.add({
          position: position,
          plane: {//平面设置
            dimensions: new Cesium.Cartesian2(300, 300),//尺寸
            material: Cesium.Color.WHITE.withAlpha(0.1),//材质
            plane: new Cesium.CallbackProperty(
              this.createPlaneUpdateFunction(plane)
            ),
            outline: true,
            outlineColor: Cesium.Color.WHITE
          }
        });
        this.planeEntities.push(planeEntity);//??
      }
    },
    createClipPlane() {
      // 要实现平面裁剪，首先需要创建裁切平面集合ClippingPlaneCollection
      this.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [
          // planes 用于在每个平面的外部选择性地禁用渲染的对象数组。
          //new Cesium.ClippingPlane(normal, distance)  nomal平面的法线方向，distance：原点到屏幕的最短距离。
          // 平面法向所在坐标系是以正东方为X轴正方形，正北方为Y轴正方向，正上面为Z轴正方向的坐标系
          // 下面代码的意思是：创建了一个法向为正下方、且经过原点的裁切平面。
          new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0.0)
        ],
        edgeWidth: this.edgeStylingEnabled ? true : false //裁剪对象的边缘
      });
    },
    // 是否显示3dtiles模型的包围盒
    changeBound() {
      this.tileset.debugShowBoundingVolume = this.debugBoundingVolumesEnabled;
    },
    //是否添加裁剪边缘
    changeStyle() {
      let edgeWidth = this.edgeStylingEnabled ? true : false;
      this.clippingPlanes.edgeWidth = edgeWidth;
    },
    // 初始化用到的事件
    initEvent() {
      const self = this;
      // 注册鼠标按下事件
      const downHandler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      // 当鼠标按下是选中裁剪平面
      downHandler.setInputAction(movement => {
        const pickedObject = this.viewer.scene.pick(movement.position);
        // 如果有选中裁剪平面实体
        if (
          Cesium.defined(pickedObject) &&
          Cesium.defined(pickedObject.id) &&
          Cesium.defined(pickedObject.id.plane)
        ) {
          self.selectedPlane = pickedObject.id.plane;
          self.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05); //设置平面材料
          self.selectedPlane.outlineColor = Cesium.Color.WHITE;
          self.viewer.scene.screenSpaceCameraController.enableInputs = false; // 禁用地球随鼠标拖动
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      // 鼠标先上释放平面
      const upHandler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      upHandler.setInputAction(() => {
        if (Cesium.defined(self.selectedPlane)) {
          self.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
          self.selectedPlane.outlineColor = Cesium.Color.WHITE;
          self.selectedPlane = undefined;
        }
        self.viewer.scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
      // 鼠标移动更新平面
      const moveHandler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      // 鼠标移动更新Y值
      moveHandler.setInputAction(movement => {
        if (Cesium.defined(self.selectedPlane)) {
          let deltaY = movement.startPosition.y - movement.endPosition.y;
          self.targetY += deltaY;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    reset() {
      this.viewer.entities.removeAll();
      if (this.tileset) {
        this.viewer.scene.primitives.remove(this.tileset);
      }
      this.planeEntities = [];
      this.targetY = 0.0;
      this.tileset = undefined;
    }
  }
};
</script>
<style lang="less" scoped>
.panel-wrap {
  z-index: 1;
  width: 380px;
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(42, 42, 42, 0.8);
  padding: 8px;
  border-radius: 4px;
  color: #fff;
  text-align: left;
}
</style>

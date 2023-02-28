<!-- 3dtiles模型选中描边 -->
<template>
  <div class="model-wrap">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global Cesium */
export default {
  components: {},

  data() {
    return {};
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      //terrainProvider: Cesium.createWorldTerrain() // 开启全球地形
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 开启深度检测(处于地下的东西看不到)
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    // 设置初始视角 位置点
    const initialPosition = Cesium.Cartesian3.fromDegrees(
      -74.01881302800248,
      40.69114333714821,
      753
    );
    // 设置初始视角 方向
    const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
      21.27879878293835,
      -21.34390550872461,
      0.0716951918898415
    );
    // 定位到初始视角
    this.viewer.scene.camera.setView({
      destination: initialPosition,
      orientation: initialOrientation,
      endTransform: Cesium.Matrix4.IDENTITY
    });
    // 加载3dtiles
    this.tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(75343)
    });
    this.viewer.scene.primitives.add(this.tileset);

    // 设置鼠标悬停3dtiles显示的html标签
    const nameOverlay = document.createElement("div"); // 创建一个div元素
    this.viewer.container.appendChild(nameOverlay);
    nameOverlay.className = "backdrop"; // 设置class
    nameOverlay.style.display = "none"; //  默认不显示此div
    nameOverlay.style.position = "absolute"; // 设置定位
    nameOverlay.style.bottom = "0";
    nameOverlay.style.left = "0";
    nameOverlay.style["pointer-events"] = "none";
    nameOverlay.style.padding = "4px";
    nameOverlay.style.color = "#fff";
    nameOverlay.style.backgroundColor = "black";

    let selected = {// 初始化选中的feature变量
      feature: undefined,
      originalColor: new Cesium.Color()
    };
    const selectedEntity = new Cesium.Entity();// 创建一个实体，它保存有关当前所选feature的信息，以供信息框显示
    const clickHandler = this.viewer.screenSpaceEventHandler.getInputAction(//  左键单击事件
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    //如果支持轮廓，则鼠标悬停feature时 轮廓颜色为蓝色，鼠标单击时轮廓为绿色，
    //如果不支持轮廓，请将feature颜色更改为鼠标悬停时的黄色和单击时的绿色。
    if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(this.viewer.scene)) {
      //isSilhouetteSupported是否支持暗色轮廓
      /**
       * 后期处理
       */

      // 设置鼠标悬停设置为蓝色
      const silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
      silhouetteBlue.uniforms.length = 0.01;
      silhouetteBlue.selected = [];
      // 鼠标单击设置为绿色
      const silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      silhouetteGreen.uniforms.color = Cesium.Color.LIME;
      silhouetteGreen.uniforms.length = 0.01;
      silhouetteGreen.selected = [];
      this.viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createSilhouetteStage([
          silhouetteBlue,
          silhouetteGreen
        ])
      );

      /**
       * 支持轮廓
       */
      this.viewer.screenSpaceEventHandler.setInputAction(movement => {
        // 重置高亮属性
        silhouetteBlue.selected = [];
        // 选中一个feature
        const pickedFeature = this.viewer.scene.pick(movement.endPosition);
        // 如果为选中feature
        if (!Cesium.defined(pickedFeature)) {
          nameOverlay.style.display = "none";
          return;
        }
        // 显示信息框
        nameOverlay.style.display = "block";
        nameOverlay.style.bottom =
          this.viewer.canvas.clientHeight - movement.endPosition.y + "px";
        nameOverlay.style.left = movement.endPosition.x + "px";
        const name = pickedFeature.getProperty("BIN"); // 获取属性名为BIN的值
        nameOverlay.textContent = name; // 把BIN的值赋值给div内容

        // 如果现在选中的feature不等于上一次选中的feature，则高亮此feature;
        if (pickedFeature !== selected.feature) {
          silhouetteBlue.selected = [pickedFeature];
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.viewer.screenSpaceEventHandler.setInputAction(movement => {
        silhouetteGreen.selected = []; // 重置高亮属性
        const pickedFeature = this.viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature)) {
          clickHandler(movement);//单击事件为空
          return;
        }
        // 如果选中的feature与上次选中的一样 则返回
        if (silhouetteGreen.selected[0] === pickedFeature) {
          return;
        }
        // 如果点击选中的feature是鼠标选中的fea突然，则清空悬浮高亮（此时只有现实点击高亮即可）
        const hightlightedFeature = silhouetteBlue.selected[0];
        if (pickedFeature === hightlightedFeature) {
          silhouetteBlue.selected = [];
        }
        silhouetteGreen.selected = [pickedFeature];

        // 设置infobox的信息
        const featureName = pickedFeature.getProperty("name");
        selectedEntity.name = featureName;//赋值给entity自己声明空对象
        this.viewer.selectedEntity = selectedEntity; // 设置viewer选中的entity为此entity
        selectedEntity.description =//一个字符串属性，用于为此实体指定HTML描述。
          '<table class="cesium-infoBox-defaultTable"><tbody>' +
          "<tr><th>BIN</th><td>" +
          pickedFeature.getProperty("BIN") +
          "</td></tr>" +
          "<tr><th>DOITT ID</th><td>" +
          pickedFeature.getProperty("DOITT_ID") +
          "</td></tr>" +
          "<tr><th>SOURCE ID</th><td>" +
          pickedFeature.getProperty("SOURCE_ID") +
          "</td></tr>" +
          "</tbody></table>";
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


    } else {
      /**
       * 不支持轮廓，改不feature的颜色
       */
      let highlighted = {
        feature: undefined,
        originalColor: new Cesium.Color()
      };
      this.viewer.screenSpaceEventHandler.setInputAction(movement => {
        // 清空之前的高亮值
        if (Cesium.defined(highlighted.feature)) {
          highlighted.feature.color = highlighted.originalColor;
          highlighted.feature = undefined;
        }
        // 选中一个feature
        const pickedFeature = this.viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pickedFeature)) {
          nameOverlay.style.display = "none";
          return;
        }
        nameOverlay.style.display = "block";
        nameOverlay.style.bottom =
          this.viewer.canvas.clientHeight - movement.endPosition.y + "px";
        nameOverlay.style.left = movement.endPosition.x + "px";
        let name = pickedFeature.getProperty("name");
        if (!Cesium.defined(name)) {
          name = pickedFeature.getProperty("id");
        }
        nameOverlay.textContent = name;
        // 高亮此feature 如果它等于上一次选中的feature
        if (pickedFeature !== selected.feature) {
          highlighted.feature = pickedFeature;
          Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
          pickedFeature.color = Cesium.Color.YELLOW;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this.viewer.screenSpaceEventHandler.setInputAction(movement => {
        // 重置高亮属性
        if (Cesium.defined(selected.feature)) {
          selected.feature.color = selected.originalColor;
          selected.feature = undefined;
        }
        // 选中feature
        const pickedFeature = this.viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature)) {
          clickHandler(movement);
          return;
        }
        // 如果跟上一次选中的为同一个 则返回
        if (selected.feature === pickedFeature) {
          return;
        }
        selected.feature = pickedFeature;
        if (pickedFeature === highlighted.feature) {
          Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
          highlighted.feature = undefined;
        } else {
          Cesium.Color.clone(pickedFeature.color, selected.originalColor);
        }
        // 高亮选中的feature
        pickedFeature.color = Cesium.Color.LIME;
        // 设置infobox信息内容
        var featureName = pickedFeature.getProperty("name");
        selectedEntity.name = featureName;
        selectedEntity.description =
          'Loading <div class="cesium-infoBox-loading"></div>';
        this.viewer.selectedEntity = selectedEntity;
        selectedEntity.description =
          '<table class="cesium-infoBox-defaultTable"><tbody>' +
          "<tr><th>BIN</th><td>" +
          pickedFeature.getProperty("BIN") +
          "</td></tr>" +
          "<tr><th>DOITT ID</th><td>" +
          pickedFeature.getProperty("DOITT_ID") +
          "</td></tr>" +
          "<tr><th>SOURCE ID</th><td>" +
          pickedFeature.getProperty("SOURCE_ID") +
          "</td></tr>" +
          "<tr><th>Longitude</th><td>" +
          pickedFeature.getProperty("longitude") +
          "</td></tr>" +
          "<tr><th>Latitude</th><td>" +
          pickedFeature.getProperty("latitude") +
          "</td></tr>" +
          "<tr><th>Height</th><td>" +
          pickedFeature.getProperty("height") +
          "</td></tr>" +
          "<tr><th>Terrain Height (Ellipsoid)</th><td>" +
          pickedFeature.getProperty("TerrainHeight") +
          "</td></tr>" +
          "</tbody></table>";
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  },

  methods: {}
};
</script>
<style lang="less" scoped></style>

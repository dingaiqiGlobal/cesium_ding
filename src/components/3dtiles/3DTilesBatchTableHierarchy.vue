<!-- 3dtiles模型颜色根据属性批处理 -->
<template>
  <div class="model-wrap">
    <div class="select-wrap">
      <a-select v-dark default-value="No style" style="width: 220px" @change="handleChange">
        <a-select-option v-for="(item, index) in selectData" :value="item.name" :key="index">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global  Cesium */
//门把手（Doorknobs）、门（doors）、屋顶（roofs）和墙（walls ）使用批处理表层次结构进行样式设置。
//由于建筑物和分区不受几何图形的支持，因此它们不会直接设置样式。然而可以编写考虑了建筑和分区特性的样式。

//层次布局（门把手（Doorknobs）是门（doors）的子项）：

//第0区  （zone）
//建筑物0  （building）
//屋顶0     （roof）
//wall0
//door0-doorknob0
//门1-门把手1
//门2-门把手2
//门3-门把手3

//建筑物1
//屋顶1
//墙1
//门4-门把手4
//门5-门把手5
//门6-门把手6
//门7-门把手7

//建筑物2
//屋顶2
//墙2
//门8-门把手8
//门9-门把手9
//门10-门把手10
//门11-门把手11

//类别属性：

//区域：
//*区域建筑  zone_building
//*分区名称  zone_name

//建筑：
//*屋宇区  building_area
//*大厦名称 building_name

//墙：   wall
//*墙面漆   wall_paint
//*墙窗  wall_windows
//*墙名  wall_name

//屋顶：   roof
//*屋顶油漆  roof_paint
//*屋宇单位名称   roof_name

//门：
//*门体质量    door_mass
//*门的宽度   door_width
//*门名称    door_name

//门把手： doorknob
//*门把手尺寸 doorknob_size
//*门把手名称   doorknob_name
export default {
  components: {},

  data() {
    return {
      selectData: [
        {
          name: "No style"
        },
        {
          name: "Color by building"
        },
        {
          name: "Color all doors"
        },
        {
          name: "Color all features derived from door"
        },
        {
          name: "Color features by class name"
        },
        {
          name: "Style by height"
        }
      ]
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer");
    this.add3dTiles();
    this.initEvent();
  },

  methods: {
    // 添加3dtiles模型
    add3dTiles() {
      this.tileset = new Cesium.Cesium3DTileset({
        url: "/data/3dtiles/BatchTableHierarchy/tileset.json"
      });
      this.viewer.scene.primitives.add(this.tileset);
      this.viewer.zoomTo(
        this.tileset,
        new Cesium.HeadingPitchRange(0.0, -0.3, 0.0)
      );
    },
    // 修改模型样式
    handleChange(e) {
      //e是item.name
      const style = this.getConditions(e);//获取条件
      this.tileset.style = new Cesium.Cesium3DTileStyle(style); // 动态修改模型的样式
    },

    // 不同类型对应不同的style
    getConditions(type) {
      let result = {};
      switch (type) {
        case "No style":
          result = {};
          break;
        // 通过属性build_name的不同显示不同的颜色
        case "Color by building":
          result = {
            color: {
              conditions: [
                ["${building_name} === 'building0'", "color('purple')"],
                ["${building_name} === 'building1'", "color('red')"],
                ["${building_name} === 'building2'", "color('orange')"]
              ]
            }
          };
          break;
        // 通过类doors的不同显示不同的颜色
        case "Color all doors":
          result = {
            color: {
              conditions: [
                ["isExactClass('door')", "color('orange')"],
                ["true", "color('white')"] // true代表剩余的单个模型的颜色
              ]
            }
          };
          break;
        // 通过是否包含字符串 类doors的不同显示不同的颜色
        case "Color all features derived from door":
          result = {
            color: {
              conditions: [
                ["isClass('door')", "color('orange')"],
                ["true", "color('white')"]
              ]
            }
          };
          break;
        // 通过正则处理class显示对应不同的颜色
        case "Color features by class name":
          result = {
            defines: {
              suffix: "regExp('door(.*)').exec(getExactClassName())"
            },
            color: {
              conditions: [
                ["${suffix} === 'knob'", "color('yellow')"],
                ["${suffix} === ''", "color('lime')"],
                ["${suffix} === null", "color('gray')"],
                ["true", "color('blue')"]
              ]
            }
          };
          break;
        // 通过属性height的大小显示不同的颜色
        case "Style by height":
          result = {
            color: {
              conditions: [
                ["${height} >= 10", "color('purple')"],
                ["${height} >= 6", "color('red')"],
                ["${height} >= 5", "color('orange')"],
                ["true", "color('blue')"]
              ]
            }
          };
          break;
        default:
          break;
      }
      return result;
    },
    initEvent() {
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
      // 鼠标左键单击事件-打印属性
      handler.setInputAction(movement => {
        const feature = this.viewer.scene.pick(movement.position);
        if (!Cesium.defined(feature)) {
          return;
        }
        //Cesium.Cesium3DTileFeature()的方法
        console.log("Class:" + feature.getExactClassName());//获取确切的名称（api中没有）
        console.log("Properties:");
        // 获取模型全部的的属性名称
        const propertyNames = feature.getPropertyNames();
        const length = propertyNames.length;
        for (let i = 0; i < length; ++i) {
          const name = propertyNames[i];
          const value = feature.getProperty(name); // 获取对应此属性名称的值
          console.log(`${name}:${value}`);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 鼠标中建点击事件-隐藏部件
      handler.setInputAction(movement => {
        const feature = this.viewer.scene.pick(movement.position);
        if (!Cesium.defined(feature)) {
          return;
        }
        feature.show = false;
      }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
    }
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

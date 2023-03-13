<!-- 下面导航栏  -->
<template>
  <div class="nav-wrap" ref="scrollContainer" @mousewheel="MouseWheel">
    <div class="column-wrap" v-for="(item, index) in list" :key="index">
      <router-link :to="item.path">
        {{ item.text }}
        <img :src="item.img" alt="" />
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      list: [
        {
          id: 1,
          img: "/images/nav/3D Models.jpg",
          text: "gltf模型",
          path: "/"
        },
        {
          id: 2,
          img: "/images/nav/3D Models Coloring.jpg",
          text: "gltf模型颜色",
          path: "/modelColor"
        },
        {
          id: 3,
          img: "/images/nav/3D Tiles BIM.jpg",
          text: "BIM模型",
          path: "/tilesBIM"
        },
        {
          id: 4,
          img: "/images/nav/3D Tiles Adjust Height.jpg",
          text: "3dtiles高度调整",
          path: "/tilesHeight"
        },
        {
          id: 5,
          img: "/images/nav/3D Tiles Batch Table Hierarchy.jpg",
          text: "3dtiles颜色批处理",
          path: "/tilesBatch"
        },
        {
          id: 6,
          img: "/images/nav/3D Tiles Clipping Planes.jpg",
          text: "3dtiles平面裁剪",
          path: "/tilesClip"
        },
        {
          id: 7,
          img: "/images/nav/3D Tiles Feature Picking.jpg",
          text: "3dtiles选中描边",
          path: "/tilesPick"
        },
        {
          id: 8,
          img: "/images/nav/3D Tiles Feature Styling.jpg",
          text: "3dtiles样式修改",
          path: "/tilesStyle"
        },
        {
          id: 9,
          img: "/images/nav/3D Tiles Formats.jpg",
          text: "3dtiles检查、操作",
          path: "/tilesFormats"
        },
        {
          id: 10,
          img: "/images/nav/3D Tiles Inspector.jpg",
          text: "3dtiles检查",
          path: "/tilesInspector"
        },
        {
          id: 11,
          img: "/images/nav/3D Tiles Interactivity.jpg",
          text: "3dtiles事件交互",
          path: "/tilesInteractivity"
        },





        {
          id: 27,
          img: "/images/nav/Bloom.jpg",
          text: "泛光",
          path: "/bloom"
        },
        {
          id: 28,
          img: "/images/nav/Bloom.jpg",
          text: "3dtiles矩阵变换",
          path: "/tilesTransform"
        },
      ]
    };
  },

  computed: {},

  mounted() { },

  methods: {
    //鼠标滚轮上下滑动时div左右滑动
    MouseWheel(e) {
      let eventDelta = -e.wheelDelta || -e.deltaY * 40;
      let $scrollWrapper = this.$refs.scrollContainer;
      // console.log($scrollWrapper.scrollLeft)
      // 0到scrollLeft为滚动区域隐藏部分
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
    }
  }
};
</script>
<style lang="less" scoped>
.nav-wrap {
  text-align: left;
  overflow: auto;
  white-space: nowrap;

  .column-wrap {
    font-size: 16px;
    display: inline-block;
    text-align: center;
    width: 170px;
    height: 130px;
    margin-top: 4px;
    margin-left: 10px;
    border: 1px solid #759dc0;
    padding: 2px 4px 4px 4px;
    background-color: #bcd8f4;
    background-image: linear-gradient(#ffffff 0px,
        rgba(255, 255, 255, 0) 3px,
        rgba(255, 255, 255, 0.75) 100%);
    box-sizing: content-box;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #86bdf2;
    }

    img {
      width: 150px;
      margin: 5px auto;
      height: 100px;
      display: block;
    }
  }

  /*包含以下四种的链接*/
  a {
    color: #000;
  }

  /*正常的未被访问过的链接*/
  a:link {
    text-decoration: none;
  }

  /*已经访问过的链接*/
  a:visited {
    text-decoration: none;
  }

  /*鼠标划过(停留)的链接*/
  a:hover {
    text-decoration: none;
  }

  /* 正在点击的链接*/
  a:active {
    text-decoration: none;
  }
}
</style>

import Vue from "vue";
import Router from "vue-router";
import gltfModel from "./components/model/3DModels.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "3DModels",
      component: gltfModel
    },
    {
      path: "/modelColor",
      name: "3D Models Coloring",
      component: () => import("./components/model/3DModelsColoring.vue")
    },
    {
      path: "/bloom",
      name: "Bloom",
      component: () => import("./components/model/bloom.vue")
    },
    {
      path: "/tilesBIM",
      name: "3D Tiles BIM",
      component: () => import("./components/3dtiles/3DtilesBIM.vue")
    },
    {
      path: "/tilesHeight",
      name: "3D Tiles Adjust Height",
      component: () => import("./components/3dtiles/3DTilesAdjustHeight.vue")
    },
    {
      path: "/tilesBatch",
      name: "3D Tiles Batch Table Hierarchy",
      component: () =>
        import("./components/3dtiles/3DTilesBatchTableHierarchy.vue")
    },
    {
      path: "/tilesClip",
      name: "3D Tiles Clipping Planes",
      component: () => import("./components/3dtiles/3DTilesClippingPlanes.vue")
    },
  ]
});

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
    {
      path: "/tilesPick",
      name: "3D Tiles Feature Picking",
      component: () => import("./components/3dtiles/3DTilesPick.vue")
    },
    {
      path: "/tilesStyle",
      name: "3D Tiles Feature Styling",
      component: () => import("./components/3dtiles/3DTilesStyle.vue")
    },
    {
      path: "/tilesFormats",
      name: "3D Tiles Formats",
      component: () => import("./components/3dtiles/3DTilesFormats.vue")
    },
    {
      path: "/tilesInspector",
      name: "3D Tiles Inspector",
      component: () => import("./components/3dtiles/3DTilesInspector.vue")
    },
    {
      path: "/tilesInteractivity",
      name: "3D Tiles Interactivity",
      component: () => import("./components/3dtiles/3DTilesInteractivity.vue")
    },
    {
      path: "/tilesInterior",
      name: "3D Tiles Interior",
      component: () => import("./components/3dtiles/3DTilesInterior.vue")
    },
    {
      path: "/tilesYemen",
      name: "3D Tiles Next CDB Yemen",
      component: () => import("./components/3dtiles/3DTilesYemen.vue")
    },
    {
      path: "/tilesPhotoClassification",
      name: "3D Tiles Next Photogrammetry Classification",
      component: () =>
        import("./components/3dtiles/3DTilesPhotoClassification.vue")
    },
    {
      path: "/tilesGlobe",
      name: "3D Tiles Next S2 Globe",
      component: () => import("./components/3dtiles/3DTilesGlobe.vue")
    },
    {
      path: "/tilesClassification",
      name: "3D Tiles Photogrammetry Classification",
      component: () => import("./components/3dtiles/3DTilesClassification.vue")
    },
    {
      path: "/tilesPhotogrammetry",
      name: "3D Tiles Photogrammetry",
      component: () => import("./components/3dtiles/3DTilesPhotogrammetry.vue")
    },
    {
      path: "/tilesPointCloudClassify",
      name: "3D Tiles Point Cloud Classification",
      component: () =>
        import("./components/3dtiles/3DTilesPointCloudClassify.vue")
    },
    {
      path: "/tilesPointCloudShading",
      name: "3D Tiles Point Cloud Shading",
      component: () =>
        import("./components/3dtiles/3DTilesPointCloudShading.vue")
    },
    {
      path: "/tilesPointCloudStyling",
      name: "3D Tiles Point Cloud Styling",
      component: () =>
        import("./components/3dtiles/3DTilesPointCloudStyling.vue")
    },
    {
      path: "/tilesPointCloud",
      name: "3D Tiles Point Cloud",
      component: () => import("./components/3dtiles/3DTilesPointCloud.vue")
    },
    {
      path: "/tilesTerrainClassify",
      name: "3D Tiles Terrain Classification",
      component: () => import("./components/3dtiles/3DTilesTerrainClassify.vue")
    },
    {
      path: "/tilesAmbientOcclusion",
      name: "Ambient Occlusion",
      component: () =>
        import("./components/3dtiles/3DTilesAmbientOcclusion.vue")
    },
    {
      path: "/arcGISMapServer",
      name: "ArcGIS MapServer",
      component: () => import("./components/mapServer/arcGISMapServer.vue")
    },
    {
      path: "/arcGISTerrain",
      name: "ArcGIS Tiled Elevation Terrain",
      component: () => import("./components/mapServer/arcGISTerrain.vue")
    },
    {
      path: "/arcticDEM",
      name: "ArcticDEM",
      component: () => import("./components/mapServer/arcticDEM.vue")
    },
    {
      path: "/billboards",
      name: "Billboards",
      component: () => import("./components/entity/billboards.vue")
    },
    {
      path: "/bloom",
      name: "Bloom",
      component: () => import("./components/model/bloom.vue")
    },
    {
      path: "/blueMarble",
      name: "Blue Marble",
      component: () => import("./components/mapServer/blueMarble.vue")
    },
    {
      path: "/box",
      name: "Box",
      component: () => import("./components/entity/box.vue")
    }
  ]
});

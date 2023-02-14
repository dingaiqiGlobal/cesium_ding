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
    }
  ]
});

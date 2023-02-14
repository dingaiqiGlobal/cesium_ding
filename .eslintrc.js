module.exports = {
  root: true,
  env: {
    node: true
  },
  // 设置全局变量，不检测
  // global: {
  //   Cesium: true
  // },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};

const styleCtx = require.context("./styles", false, /\.less$/);
styleCtx.keys().forEach(key => {
  styleCtx(key).default || styleCtx(key);
});
export default Vue => {
  Vue.directive("dark", {
    bind(el) {
      el.setAttribute("v-dark", true);
    }
  });
};

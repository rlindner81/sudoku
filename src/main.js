import VueLogger from "vuejs-logger";

import Vue from "vue";
import App from "./App.vue";
import router from "./router.js";

Vue.config.productionTip = false;
const isProduction = process.env.NODE_ENV === "production";

Vue.use(VueLogger, {
  logLevel: isProduction ? "error" : "debug",
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

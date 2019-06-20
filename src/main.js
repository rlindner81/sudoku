// import jQuery from "jquery"; // eslint-disable-line no-unused-vars
// import Popper from "popper.js"; // eslint-disable-line no-unused-vars
import Bootstrap from "../node_modules/bootstrap/js/src"; // eslint-disable-line no-unused-vars
import VueLogger from "vuejs-logger";

import Vue from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store.js";
import "./registerServiceWorker.js";

Vue.config.productionTip = false;

Vue.use(VueLogger, {
  logLevel: "debug"
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

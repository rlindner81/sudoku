import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import logger from "@/util/logger.js";

const app = createApp(App);
app.config.globalProperties.$log = logger;
app.use(router);
app.mount("#app");

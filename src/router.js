import Vue from "vue";
import Router from "vue-router";
import Sudoku from "./views/Sudoku.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "sudoku",
      component: Sudoku,
    },
  ],
});

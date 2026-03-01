import { createRouter, createWebHistory } from 'vue-router';
import Sudoku from "./views/Sudoku.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "sudoku",
      component: Sudoku,
    },
  ],
});

export default router;

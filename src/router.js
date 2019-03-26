import Vue from 'vue'
import Router from 'vue-router'
import Sudoku from './views/Sudoku.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { 
      path: '/index.html', 
      redirect: '/' 
    },
    {
      path: '/',
      name: 'sudoku',
      component: Sudoku
    }
  ]
})

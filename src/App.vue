<template>
  <div id="app">
    <h1>Play Sudoku</h1>
    <Sudoku/>
  </div>
</template>

<script>
import Sudoku from './components/Sudoku.vue'

export default {
  name: 'app',
  components: {
    Sudoku
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: auto 1rem;
  margin: 0 auto;
  max-width: 60rem;
  min-width: 30rem;

  h1 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
}
</style>

<template>
  <div class="home">
    <h1>Play Sudoku</h1>
    <Sudoku/>
  </div>
</template>

<script>
import Sudoku from "@/components/Sudoku.vue";

export default {
  name: "app",
  components: {
    Sudoku
  }
};
</script>

<style lang="scss">
.home {
  h1 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
}
</style>

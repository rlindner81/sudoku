<template>
  <div class="home">
    <h1>Play Sudoku</h1>
    <SudokuBoard class="sudoku-board"/>
  </div>
</template>

<script>
import SudokuBoard from "@/components/SudokuBoard.vue";

export default {
  name: "app",
  components: {
    SudokuBoard
  }
};
</script>

<style lang="scss">
$size: 60rem;

.home {
  margin: 0 auto;
  width: $size;

  h1 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .sudoku-board {
    width: 100%;
    height: $size;
  }
}
</style>

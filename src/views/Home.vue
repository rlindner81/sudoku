<template>
  <div class="home">
    <h1>Play Sudoku</h1>
    <Board class="board"/>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";

export default {
  name: "app",
  components: {
    Board
  }
};
</script>

<style lang="scss">
$size: 60rem;

.home {
  margin: 0 auto;
  width: $size;

  > * {
    margin: 2rem 0;
  }

  .board {
    width: $size;
    height: $size;
  }
}
</style>

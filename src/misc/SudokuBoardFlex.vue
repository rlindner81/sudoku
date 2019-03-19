<template>
  <div class="board">
    <div class="board-row" v-for="(row,i) in board" v-bind:key="i">
      <SudokuBox
        class="board-box"
        v-bind:placeholder="col===0"
        v-for="(col,j) in row"
        v-bind:key="j"
        v-bind:size="boxSize"
      ></SudokuBox>
    </div>
  </div>
</template>

<script>
import SudokuBox from "./SudokuBox.vue";
import Generator from "./Generator.js";

export default {
  name: "Sudoku",
  components: {
    SudokuBox
  },
  data() {
    return {
      n: 9,
      boxSize: 3,
      board: [
        [1, 1, 1, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1]
      ],
      boardClassic3: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
    };
  },
  created() {
    let seed = 42;
    let gen = new Generator(this.n, seed);
    this.rows = gen.getRows();
  }
};
</script>

<style lang="scss">
$board-size: 5;

.board {
  width: 100%;

  .board-row {
    display: flex;
    flex-flow: row;
    width: 100%;
    height: 100% / $board-size;

    .board-box {
      width: 100% / $board-size;
      height: 100%;
    }
  }
}
</style>

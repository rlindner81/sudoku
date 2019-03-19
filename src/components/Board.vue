<template>
  <table class="board">
    <tr class="board-row" v-for="(row, i) in getBoard(board)" v-bind:key="i">
      <td v-bind:class="{'board-column': !!col}" v-for="(col, j) in row" v-bind:key="j">
        <Box v-if="!!col" v-bind:size="boxSize"/>
      </td>
    </tr>
  </table>
</template>

<script>
import Box from "@/components/Box.vue";

export default {
  name: "Board",
  components: {
    Box
  },
  data() {
    return {
      boxSize: 2,
      boardSize: 4,
      board: "crazy"
    };
  },
  methods: {
    getBoard(template) {
      if (template === undefined || template === null) {
        let board = Array(this.boardSize).fill(Array(this.boardSize).fill(1));
        return board;
      }
      if (template === "crazy") {
        return [
          [1, 1, 1, 0, 0],
          [1, 1, 0, 1, 0],
          [1, 1, 1, 1, 1],
          [0, 1, 1, 0, 1],
          [0, 0, 1, 1, 1]
        ];
      }
    }
  }
};
</script>

<style lang="scss">
.board {
  border-collapse: collapse;

  .board-row {
    .board-column {
      border: 1px solid black;
    }
  }
}
</style>

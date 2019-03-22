<template>
  <table class="board">
    <tr class="row" v-for="(row, i) in boardSize" v-bind:key="i">
      <td
        class="column"
        :style="getColumnStyle(i, j)"
        v-for="(col, j) in boardSize"
        v-bind:key="j"
      >{{i + j}}</td>
    </tr>
  </table>
</template>

<script>
import Helper from "@/helper";

export default {
  name: "Board",
  data() {
    return {
      boardSize: 9,
      borders: [[0b11010111, 0b11010101, 0b11010101, 0b11010101, 0b11010101]]
    };
  },
  methods: {
    getPositionStyle(position) {
      switch (position) {
        case 0:
          return "none";
        case 1:
          return "1px solid lightgray";
        case 2:
          return "2px solid darkgray";
        case 3:
          return "3px solid black";
      }
      return null;
    },
    getColumnStyle(i, j) {
      let result = {};
      let border = Helper.getListElement(this.borders, i, j);
      if (border === null) {
        return result;
      }

      let top = (border >> 6) & 0b11;
      let right = (border >> 4) & 0b11;
      let bottom = (border >> 2) & 0b11;
      let left = (border >> 0) & 0b11;
      result["border-top"] = this.getPositionStyle(top);
      result["border-right"] = this.getPositionStyle(right);
      result["border-bottom"] = this.getPositionStyle(bottom);
      result["border-left"] = this.getPositionStyle(left);
      return result;
    },
    getBoard(template) {
      if (template === undefined || template === null) {
        let board = Array(this.boardSize).fill(Array(this.boardSize).fill(1));
        return board;
      }
      if (template === "crazy") {
        return [
          [1, 1, 0, 0, 0],
          [1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1],
          [0, 1, 0, 0, 1],
          [0, 0, 1, 1, 1]
        ];
      }
    }
  }
};
</script>

<style lang="scss">
.board {
  box-sizing: content-box;
  border-collapse: collapse;
  table-layout: fixed;

  .row {
    .column {
      vertical-align: middle;
      text-align: center;
    }
  }
}
</style>

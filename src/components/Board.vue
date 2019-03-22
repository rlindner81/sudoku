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
      borderStyles: [
        "none", 
        "1px solid lightgray", 
        "2px solid darkgray", 
        "3px solid black"
      ],
      borders: [
        [0x3311, 0x1311, 0x1312, 0x1311, 0x1311, 0x1312, 0x1311, 0x1311, 0x1313],
        [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
        [0x3121, 0x1121, 0x1122, 0x1121, 0x1121, 0x1122, 0x1121, 0x1121, 0x1123],
        [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
        [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
        [0x3121, 0x1121, 0x1122, 0x1121, 0x1121, 0x1122, 0x1121, 0x1121, 0x1123],
        [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
        [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
        [0x3131, 0x1131, 0x1132, 0x1131, 0x1131, 0x1132, 0x1131, 0x1131, 0x1133]
      ]
    };
  },
  methods: {
    getColumnStyle(i, j) {
      let result = {};
      let border = Helper.getListElement(this.borders, i, j);
      if (border === null) {
        return result;
      }

      let left = (border >> 12) & 0xf;
      let top = (border >> 8) & 0xf;
      let bottom = (border >> 4) & 0xf;
      let right = (border >> 0) & 0xf;
      result["border-top"] = this.borderStyles[top];
      result["border-right"] = this.borderStyles[right];
      result["border-bottom"] = this.borderStyles[bottom];
      result["border-left"] = this.borderStyles[left];
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

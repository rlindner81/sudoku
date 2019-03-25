<template>
  <table class="board">
    <tr class="row" v-for="(row, i) in boardSize" :key="i">
      <td class="column" :style="getColumnStyle(i, j)" v-for="(col, j) in boardSize" :key="j">
        <Field v-model="values[i][j]"/>
      </td>
    </tr>
  </table>
</template>

<script>
import { getListElement, shuffle, seedRand, rand } from "@/helper";
import Field from "@/components/Field.vue";

let borders = [
  [0x3311, 0x1311, 0x1312, 0x1311, 0x1311, 0x1312, 0x1311, 0x1311, 0x1313],
  [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
  [0x3121, 0x1121, 0x1122, 0x1121, 0x1121, 0x1122, 0x1121, 0x1121, 0x1123],
  [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
  [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
  [0x3121, 0x1121, 0x1122, 0x1121, 0x1121, 0x1122, 0x1121, 0x1121, 0x1123],
  [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
  [0x3111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1112, 0x1111, 0x1111, 0x1113],
  [0x3131, 0x1131, 0x1132, 0x1131, 0x1131, 0x1132, 0x1131, 0x1131, 0x1133]
];

export default {
  name: "Board",
  components: {
    Field
  },
  props: {
    games: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      boardSize: 9,
      borderStyles: [
        "none",
        "2px solid lightgray",
        "3px solid darkgray",
        "5px solid black"
      ],
      borders: borders,
      game: null,
      values: null
    };
  },
  created() {
    this.randomize(this.games);
  },
  methods: {
    valuesFromGrid(grid) {
      let rows = [];
      grid = grid.replace(/\./g, " ");
      for (let i = 0; i < this.boardSize; i++) {
        let columns = [];
        for (let j = 0; j < this.boardSize; j++) {
          let value = grid[i * this.boardSize + j];
          columns.push(value === " " ? null : parseInt(value));
        }
        rows.push(columns);
      }
      return rows;
    },
    getColumnStyle(i, j) {
      let result = {};
      let border = getListElement(this.borders, i, j);
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
    randomize(games) {
      seedRand("lala");
      let a = rand();
      let i = Math.floor(Math.random() * games.length);
      let game = games[i];
      this.randomRelabel(game);
      this.game = game;
      this.values = this.valuesFromGrid(this.game[0]);
    },
    randomRelabel(game) {
      let labels = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          game[i] = game[i].replace(
            new RegExp(String.fromCharCode(0x31 + j), "g"),
            String.fromCharCode(0x41 + j)
          );
        }
        for (let j = 0; j < this.boardSize; j++) {
          game[i] = game[i].replace(
            new RegExp(String.fromCharCode(0x41 + j), "g"),
            String.fromCharCode(0x31 + labels[j])
          );
        }
      }
    },
    solve() {
      this.values = this.valuesFromGrid(this.game[1]);
    }
  },
  watch: {
    games: function(newVal) {
      this.randomize(newVal);
    }
  }
};
</script>

<style lang="scss">
.board {
  box-sizing: content-box;
  border-collapse: collapse;
  table-layout: fixed;
  vertical-align: middle;
  text-align: center;

  .row {
    .column {
      position: relative;
    }
  }
}
</style>

<template>
  <table class="board">
    <tr class="row" v-for="(row, i) in boardSize" :key="i">
      <td class="column" :style="getColumnStyle(i, j)" v-for="(col, j) in boardSize" :key="j">
        <input
          class="field"
          v-model="values[i][j]"
          @input="onInput"
          @focus="onFocus"
          @click="onFocus"
        >
      </td>
    </tr>
  </table>
</template>

<script>
import {
  fallback,
  exchangeInString,
  getListElement,
  shuffle,
  seedRand,
  rand
} from "@/helper";

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
  props: {
    games: {
      type: Array,
      required: true
    },
    seed: {
      type: String,
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
    this.randomize();
  },
  watch: {
    games: function(newVal) {
      this.randomize(newVal, null);
    },
    seed: function(newVal) {
      this.randomize(null, newVal);
    }
  },
  methods: {
    //
    // === DISPLAY ===
    //
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

    //
    // === GAME LOGIC ===
    //
    randomize(games, seed) {
      games = fallback(games, this.games);
      seed = fallback(seed, this.seed);

      seedRand(seed);

      let i = Math.floor(rand() * games.length);
      let game = games[i].slice();
      [
        this.randomRelabel,
        this.randomTranspose,
        this.randomRowPermutation,
        this.randomColumnPermutation
      ].forEach(fn => {
        let state = {};
        for (let i = 0; i < game.length; i++) {
          state.grid = game[i];
          fn(state);
          game[i] = state.grid;
        }
      });
      this.randomRowPermutation(game);
      this.randomColumnPermutation(game);
      this.game = game;
      this.values = this.valuesFromGrid(this.game[0]);
    },
    randomRelabel(state) {
      console.log("grid before relabel", state.grid);
      state.labels = fallback(
        state.labels,
        shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8])
      );
      for (let i = 0; i < this.boardSize; i++) {
        state.grid = state.grid.replace(
          new RegExp(String.fromCharCode(0x31 + i), "g"),
          String.fromCharCode(0x41 + i)
        );
      }
      for (let i = 0; i < this.boardSize; i++) {
        state.grid = state.grid.replace(
          new RegExp(String.fromCharCode(0x41 + i), "g"),
          String.fromCharCode(0x31 + state.labels[i])
        );
      }
      console.log("grid after relabel", state.grid);
    },
    randomTranspose(state) {
      console.log("grid before transpose", state.grid);
      state.transpose = fallback(state.transpose, rand() < 0.5);
      if (state.transpose === true) {
        for (let i = 0; i < this.boardSize; i++) {
          for (let j = 0; j < i; j++) {
            state.grid = exchangeInString(
              state.grid,
              i + this.boardSize * j,
              j + this.boardSize * i
            );
          }
        }
        for (let i = 0; i < state.grid.length / 2; i++) {}
      }
      console.log("grid after transpose", state.grid);
    },
    randomRowPermutation(state) {},
    randomColumnPermutation(state) {},
    solve() {
      this.values = this.valuesFromGrid(this.game[1]);
    },
    reset() {
      this.values = this.valuesFromGrid(this.game[0]);
    },

    //
    // === EVENTS ===
    //
    onFocus(event) {
      let input = event.target;
      input.setSelectionRange(0, input.value.length);
    },
    onInput(event) {
      let input = event.target;
      let value = input.value;
      let result = parseInt(value.replace(/[^\d]+/g, ""));
      input.value = isNaN(result) ? null : result;
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
      .field {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        border: none;
        text-align: center;
        font-size: 2rem;
        &:focus {
          background: lightgoldenrodyellow;
          // outline: darkorange auto 3px;
          outline: none;
          border: 2px solid orange;
        }
        &::selection {
          background: none;
        }
      }
    }
  }
}
</style>

<template>
  <table class="board">
    <tr
      v-for="(row, i) in boardSize"
      :key="i"
      class="row"
    >
      <td
        v-for="(col, j) in boardSize"
        :key="j"
        class="column"
        :style="getColumnStyle(i, j)"
      >
        <input
          v-model="values[i][j]"
          class="field"
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
  flatten,
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
  watch: {
    games: function(newVal) {
      this.randomize(newVal, null);
    },
    seed: function(newVal) {
      this.randomize(null, newVal);
    }
  },
  created() {
    this.randomize();
  },
  methods: {
    //
    // === DISPLAY ===
    //
    valuesFromGrid(grid) {
      let rows = [];
      for (let i = 0; i < this.boardSize; i++) {
        let columns = [];
        for (let j = 0; j < this.boardSize; j++) {
          let value = grid[i * this.boardSize + j];
          columns.push(value === "." ? null : parseInt(value));
        }
        rows.push(columns);
      }
      return rows;
    },
    gridFromValues(values) {
      let squares = flatten(values);
      return squares.map(value => (!value ? "." : value)).join("");
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
          state.squares = Array.from(game[i]);
          fn(state);
          game[i] = state.squares.join("");
        }
      });
      this.game = game;
      this.values = this.valuesFromGrid(this.game[0]);
    },
    randomRelabel(state) {
      state.labels = fallback(
        state.labels,
        shuffle(["1", "2", "3", "4", "5", "6", "7", "8", "9"])
      );
      // console.log("before relabel", state.squares.join(""), state.labels);

      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          let x = j + this.boardSize * i;
          let value = state.squares[x];
          if (value !== ".") {
            state.squares[x] = state.labels[parseInt(value) - 1];
          }
        }
      }

      // console.log(" after relabel", state.squares.join(""));
    },
    randomTranspose(state) {
      state.transpose = fallback(state.transpose, rand() < 0.5);
      // console.log("before transpose", state.squares.join(""), state.transpose);

      if (state.transpose === true) {
        for (let i = 0; i < this.boardSize; i++) {
          for (let j = 0; j < i; j++) {
            let x = j + this.boardSize * i;
            let y = i + this.boardSize * j;
            let value = state.squares[x];
            state.squares[x] = state.squares[y];
            state.squares[y] = value;
          }
        }
      }

      // console.log(" after transpose", state.squares.join(""));
    },
    randomRowPermutation(state) {
      state.rows = fallback(
        state.rows,
        flatten(
          shuffle([shuffle([0, 1, 2]), shuffle([3, 4, 5]), shuffle([6, 7, 8])])
        )
      );
      // console.log("before row permute", state.squares.join(""), state.rows);

      let oldSquares = state.squares.slice();
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
            let x = j + this.boardSize * i;
            let y = j + this.boardSize * state.rows[i];
          state.squares[x] = oldSquares[y]
        }
      }

      // console.log("after row permute", state.squares.join(""));
    },
    randomColumnPermutation(state) {
      state.cols = fallback(
        state.cols,
        flatten(
          shuffle([shuffle([0, 1, 2]), shuffle([3, 4, 5]), shuffle([6, 7, 8])])
        )
      );
      // console.log("before col permute", state.squares.join(""), state.cols);

      let oldSquares = state.squares.slice();
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
            let x = j + this.boardSize * i;
            let y = state.cols[j] + this.boardSize * i;
          state.squares[x] = oldSquares[y]
        }
      }

      // console.log("after col permute", state.squares.join(""));      
    },
    // debug() {
    //   let grid = this.gridFromValues(this.values);
    //   let state = { squares: Array.from(grid), cols: [1,0,3,2,4,5,6,7,8] };
    //   this.randomColumnPermutation(state);
    //   this.values = this.valuesFromGrid(state.squares.join(""));
    // },
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
        // line-height: 100%;
        display: flex;
        border: none;
        text-align: center;
        font-size: 5vw;

        @media screen and (min-width: 1000px) {
          font-size: calc(5*10px);
        }
        &:focus {
          background: lightgoldenrodyellow;
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

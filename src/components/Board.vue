<template>
  <table class="board">
    <tr v-for="(row, i) in size" :key="i" class="row">
      <td
        v-for="(col, j) in size"
        :key="j"
        class="column"
        :style="getColumnStyle(i, j)"
      >
        {{ displayValue(values[i][j]) }}
        <!--
        <input
          :value=""
          class="field"
          @input="onInput"
          @focus="onFocus"
          @click="onFocus"
        />
        -->
      </td>
    </tr>
  </table>
</template>

<script>
import {
  isNull,
  fallback,
  flatten,
  getListElement,
  shuffle,
  seedRand,
  rand
} from "@/helper";

const borders = {
  styles: [
    "none",
    "2px solid lightgray",
    "3px solid darkgray",
    "5px solid black"
  ],
  grid: [
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
    },
    symbols: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      size: 9,
      borders: borders,
      game: null,
      values: null
    };
  },
  watch: {
    games: function(newVal) {
      this.generate({ games: newVal });
    },
    seed: function(newVal) {
      this.generate({ seed: newVal });
    }
  },
  created() {
    this.generate();
  },
  methods: {
    //
    // === DISPLAY ===
    //
    valuesFromGrid(grid) {
      let rows = [];
      for (let i = 0; i < this.size; i++) {
        let columns = [];
        for (let j = 0; j < this.size; j++) {
          let value = grid[i * this.size + j];
          columns.push(value === "." ? null : parseInt(value) - 1);
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
      let border = getListElement(this.borders.grid, i, j);
      if (border === null) {
        return result;
      }

      let left = (border >> 12) & 0xf;
      let top = (border >> 8) & 0xf;
      let bottom = (border >> 4) & 0xf;
      let right = (border >> 0) & 0xf;
      result["border-top"] = this.borders.styles[top];
      result["border-right"] = this.borders.styles[right];
      result["border-bottom"] = this.borders.styles[bottom];
      result["border-left"] = this.borders.styles[left];
      return result;
    },
    displayValue(value) {
      return isNull(value) ? " " : this.symbols[value];
    },

    //
    // === GAME LOGIC ===
    //
    generate(options) {
      options = fallback(options, {});
      let games = fallback(options.games, this.games);
      let seed = fallback(options.seed, this.seed);

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

      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          let x = j + this.size * i;
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
        for (let i = 0; i < this.size; i++) {
          for (let j = 0; j < i; j++) {
            let x = j + this.size * i;
            let y = i + this.size * j;
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
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          let x = j + this.size * i;
          let y = j + this.size * state.rows[i];
          state.squares[x] = oldSquares[y];
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
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          let x = j + this.size * i;
          let y = state.cols[j] + this.size * i;
          state.squares[x] = oldSquares[y];
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
      font-size: 5vw;

      @media screen and (min-width: 1000px) {
        font-size: calc(5 * 10px);
      }
      //  position: relative;
      // .field {
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   width: 100%;
      //   height: 100%;
      //   // line-height: 100%;
      //   display: flex;
      //   border: none;
      //   text-align: center;
      //   &:focus {
      //     background: lightgoldenrodyellow;
      //     outline: none;
      //     border: 2px solid orange;
      //   }
      //   &::selection {
      //     background: none;
      //   }
      // }
    }
  }
}
</style>

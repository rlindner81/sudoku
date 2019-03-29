<template>
  <div>
    <table class="board">
      <tr v-for="(row, i) in boardSize" :key="i" :class="getRowClasses(i)">
        <td
          v-for="(col, j) in boardSize"
          :key="j"
          :class="getColumnClasses(i, j)"
          @click="onClick($event, j + boardSize * i)"
        >
          {{ displaySquare(squares[j + boardSize * i]) }}
        </td>
      </tr>
    </table>

    <Keypad
      v-show="showKeypad"
      :value="selectedSquare"
      :symbols="symbols"
      :box-size="boxSize"
      @close="closeKeypad"
      @change="updateSquareValue"
    />
  </div>
</template>

<script>
import Keypad from "@/components/Keypad.vue";

import {
  isNull,
  fallback,
  flatten,
  numbers,
  shuffle,
  seedRand,
  rand
} from "@/helper";
import gamespack from "@/data/gamespack.json";

export default {
  name: "Board",
  components: {
    Keypad
  },
  props: {
    boxSize: {
      type: Number,
      default: 3
    },
    difficulty: {
      type: String,
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
      boardSize: null,
      squareSize: null,
      startSquares: null,
      endSquares: null,
      squares: null,
      showKeypad: false,
      selectedPosition: null
    };
  },
  computed: {
    selectedSquare() {
      return this.selectedPosition !== null
        ? this.squares[this.selectedPosition]
        : null;
    }
  },
  watch: {
    difficulty: function(newVal) {
      this.generate({ difficulty: newVal });
    },
    seed: function(newVal) {
      this.generate({ seed: newVal });
    }
  },
  created() {
    this.boardSize = this.boxSize * this.boxSize;
    this.squareSize = this.boardSize * this.boardSize;
    this.generate();
  },
  methods: {
    //
    // === DISPLAY ===
    //
    squaresFromGrid(grid) {
      let squares = [];
      for (let i = 0; i < this.squareSize; i++) {
        let value = grid[i];
        squares.push(value === "." ? null : parseInt(value) - 1);
      }
      return squares;
    },
    gridFromSquares(squares) {
      return squares.map(value => (value === null ? "." : value + 1)).join("");
    },
    getRowClasses(i) {
      return i === 0 || i % this.boxSize !== 0
        ? { row: true }
        : {
            row: true,
            "border-box-top": true
          };
    },
    getColumnClasses(i, j) {
      return j === 0 || j % this.boxSize !== 0
        ? { column: true }
        : {
            column: true,
            "border-box-left": true
          };
    },
    displaySquare(value) {
      return isNull(value) ? "" : this.symbols[value];
    },

    //
    // === GAME LOGIC ===
    //
    // 1 => 9! * 2 * 6^4 * 6^4 = 1218998108160 ~= 10^12
    generate(options) {
      options = fallback(options, {});
      let difficulty = fallback(options.difficulty, this.difficulty);
      let seed = fallback(options.seed, this.seed);

      seedRand(difficulty + seed);

      let games = gamespack.games;
      let game = games[Math.floor(rand() * games.length)];
      let startSquares = this.squaresFromGrid(game[0]);
      let endSquares = this.squaresFromGrid(game[1]);

      this.scaleDifficulty(difficulty, startSquares, endSquares);

      [
        this.randomRelabel,
        this.randomTranspose,
        this.randomRowPermutation,
        this.randomColumnPermutation
      ].forEach(fn => {
        let state = {};
        [startSquares, endSquares].forEach(squares => {
          state.squares = squares;
          fn(state);
          squares = state.squares;
        });
      });

      this.startSquares = startSquares;
      this.endSquares = endSquares;
      this.squares = startSquares.slice();
    },
    scaleDifficulty(difficulty, startSquares, endSquares) {
      let hintPositions = shuffle(numbers(0, this.squareSize));
      let hints = startSquares.filter(s => s !== null).length;
      let missingHints = gamespack.difficulties[difficulty] - hints;

      for (let i = 0; i < this.squareSize; i++) {
        let x = hintPositions[i];
        if (startSquares[x] !== null) {
          continue;
        }
        startSquares[x] = endSquares[x];
        if (--missingHints <= 0) {
          break;
        }
      }
    },
    randomRelabel(state) {
      state.labels = fallback(
        state.labels,
        shuffle(numbers(0, this.boardSize))
      );
      // console.log("before relabel", this.gridFromSquares(state.squares), state.labels);

      for (let i = 0; i < this.squareSize; i++) {
        let value = state.squares[i];
        if (value !== null) {
          state.squares[i] = state.labels[value];
        }
      }

      // console.log(" after relabel", this.gridFromSquares(state.squares));
    },
    randomTranspose(state) {
      state.transpose = fallback(state.transpose, rand() < 0.5);
      // console.log("before transpose", this.gridFromSquares(state.squares), state.transpose);

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

      // console.log(" after transpose", this.gridFromSquares(state.squares));
    },
    randomRowPermutation(state) {
      state.rows = fallback(
        state.rows,
        flatten(
          shuffle([shuffle([0, 1, 2]), shuffle([3, 4, 5]), shuffle([6, 7, 8])])
        )
      );
      // console.log("before row permute", this.gridFromSquares(state.squares), state.rows);

      let oldSquares = state.squares.slice();
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          let x = j + this.boardSize * i;
          let y = j + this.boardSize * state.rows[i];
          state.squares[x] = oldSquares[y];
        }
      }

      // console.log("after row permute", this.gridFromSquares(state.squares));
    },
    randomColumnPermutation(state) {
      state.cols = fallback(
        state.cols,
        flatten(
          shuffle([shuffle([0, 1, 2]), shuffle([3, 4, 5]), shuffle([6, 7, 8])])
        )
      );
      // console.log("before col permute", this.gridFromSquares(state.squares), state.cols);

      let oldSquares = state.squares.slice();
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          let x = j + this.boardSize * i;
          let y = state.cols[j] + this.boardSize * i;
          state.squares[x] = oldSquares[y];
        }
      }

      // console.log("after col permute", this.gridFromSquares(state.squares));
    },
    // debug() {
    //   let grid = this.gridFromSquares(this.squares);
    //   let state = { squares: Array.from(grid), cols: [1,0,3,2,4,5,6,7,8] };
    //   this.randomColumnPermutation(state);
    //   this.squares = this.squaresFromGrid(this.gridFromSquares(state.squares));
    // },
    solve() {
      this.squares = this.endSquares.slice();
    },
    reset() {
      this.squares = this.startSquares.slice();
    },

    //
    // === EVENTS ===
    //
    onFocus(event) {
      let input = event.target;
      input.setSelectionRange(0, input.value.length);
    },
    onClick(event, position) {
      this.selectedPosition = position;
      this.showKeypad = true;
    },
    closeKeypad() {
      this.showKeypad = false;
    },
    updateSquareValue(value) {
      this.squares[this.selectedPosition] = value;
    }
  }
};
</script>

<style lang="scss">
$border-board: 4px solid black;
$border-box: 3px solid darkgray;
$border-square: 2px solid lightgray;

.board {
  border-collapse: collapse;
  table-layout: fixed;
  vertical-align: middle;
  text-align: center;

  .row:first-child .column {
    border-top: $border-board;
  }
  .row .column:first-child {
    border-left: $border-board;
  }
  .row:last-child .column {
    border-bottom: $border-board;
  }
  .row .column:last-child {
    border-right: $border-board;
  }
  .row.border-box-top {
    border-top: $border-box;
  }
  .row .column.border-box-left {
    border-left: $border-box;
  }

  .row {
    .column {
      user-select: none;
      font-size: 5vw;
      border: $border-square;
      line-height: 0;

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

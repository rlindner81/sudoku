<template>
  <div>
    <table :class="getBoardClasses()">
      <tr v-for="(row, i) in size" :key="i" :class="getRowClasses(i)">
        <td
          v-for="(col, j) in size"
          :key="j"
          :class="getColumnClasses(i, j)"
          @click="onClick($event, j + size * i)"
        >
          {{ displayCell(board[j + size * i]) }}
        </td>
      </tr>
    </table>

    <!-- <Keypad
      v-show="showKeypad"
      :value="selectedSquare"
      :symbols="symbols"
      :box-size="boxSize"
      @close="closeKeypad"
      @change="updateSquareValue"
    /> -->
  </div>
</template>

<script>
// import Keypad from "@/components/Keypad.vue";

import { isNull, fallback, flatten, numbers } from "@/util/helper.mjs";
import { default as Sudoku, charFromNum, numFromChar } from "@/util/Sudoku.mjs"; // eslint-disable-line no-unused-vars
import PRNG from "@/util/PRNG.mjs";

// import Counter from "@/util/Counter.mjs";
// const generateCounter = new Counter("generate");

export default {
  name: "Board",
  components: {
    // Keypad
  },
  props: {
    size: {
      type: Number,
      required: true
    },
    seed: {
      type: String,
      required: true
    },
    grids: {
      type: Array,
      required: true
    },
    difficultyQuotient: {
      type: Number,
      required: true
    },
    symbols: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      prng: null,
      sudoku: null,
      hintGrid: null,
      fullGrid: null,
      board: null
      // showKeypad: false,
      // selectedPosition: null
    };
  },
  computed: {
    selectedSquare() {
      return this.selectedPosition !== null
        ? this.board[this.selectedPosition]
        : null;
    }
  },
  watch: {
    size: function(newVal) {
      this.generate({ size: newVal });
    },
    seed: function(newVal) {
      this.generate({ seed: newVal });
    },
    difficultyQuotient: function(newVal) {
      this.generate({ difficultyQuotient: newVal });
    }
  },
  created() {
    this.generate();
  },
  methods: {
    //
    // === DISPLAY ===
    //
    getBoardClasses() {
      return {
        board: true,
        [`size-${this.size}`]: true
      };
    },
    getRowClasses(i) {
      return i === 0 || i % this.sudoku.height !== 0
        ? { row: true }
        : {
            row: true,
            "border-box-top": true
          };
    },
    getColumnClasses(i, j) {
      return j === 0 || j % this.sudoku.width !== 0
        ? { column: true }
        : {
            column: true,
            "border-box-left": true
          };
    },
    // NOTE: for consistent square cells, it is either this hack or line-height 0, which causes random problems in the
    //       renderer. Print does seem to need the line-height 0 though.
    displayCell(value) {
      return value === 0
        ? "\u00a0" // non-breaking space
        : value <= this.symbols.length
        ? this.symbols[value - 1]
        : value;
    },

    //
    // === GAME LOGIC ===
    //
    generate(options) {
      options = fallback(options, {});
      let size = fallback(options.size, this.size);
      let seed = fallback(options.seed, this.seed);
      let difficultyQuotient = fallback(
        options.difficultyQuotient,
        this.difficultyQuotient
      );
      this.prng = new PRNG(seed);
      this.sudoku = new Sudoku(size, this.prng);

      let grid = this.grids[Math.floor(this.prng.rand() * this.grids.length)];
      let hintBoard = this.sudoku.boardFromGrid(grid);
      let fullBoard = this.sudoku.searchAnySolution(hintBoard);
      let hintGrid = grid.split("").map(numFromChar);
      let fullGrid = this.sudoku
        .gridFromBoard(fullBoard)
        .split("")
        .map(numFromChar);

      this.scaleDifficulty(size, difficultyQuotient, hintGrid, fullGrid);

      [
        this.randomRelabel,
        this.randomTranspose,
        this.randomRowPermutation,
        this.randomColumnPermutation
      ].forEach(fn => {
        let state = {};
        [hintGrid, fullGrid].forEach(grid => {
          state.grid = grid;
          fn(state);
          grid = state.grid;
        });
      });

      this.hintGrid = hintGrid;
      this.fullGrid = fullGrid;
      this.board = hintGrid.slice();
    },
    scaleDifficulty(size, difficultyQuotient, hintGrid, fullGrid) {
      let hintPositions = this.prng.shuffle(numbers(0, this.sudoku.cells));
      let hints = hintGrid.filter(c => c !== 0).length;
      let missingHints =
        Math.ceil(this.sudoku.cells / difficultyQuotient) - hints;

      for (let i = 0; i < this.sudoku.cells; i++) {
        let x = hintPositions[i];
        if (hintGrid[x] !== 0) {
          continue;
        }
        if (missingHints-- <= 0) {
          break;
        }
        hintGrid[x] = fullGrid[x];
      }
    },
    randomRelabel(state) {
      state.labels = fallback(
        state.labels,
        this.prng.shuffle(numbers(1, this.size))
      );
      // console.log("before relabel", state.grid.map(charFromNum).join(""), state.labels); // eslint-disable-line

      for (let i = 0; i < this.sudoku.cells; i++) {
        let value = state.grid[i];
        if (value !== 0) {
          state.grid[i] = state.labels[value - 1];
        }
      }

      // console.log(" after relabel", state.grid.map(charFromNum).join("")); // eslint-disable-line
    },
    randomTranspose(state) {
      if (this.sudoku.width !== this.sudoku.height) {
        return;
      }
      state.transpose = fallback(state.transpose, this.prng.rand() < 0.5);
      // console.log("before transpose", state.grid.map(charFromNum).join(""), state.transpose); // eslint-disable-line

      if (state.transpose) {
        for (let i = 0; i < this.size; i++) {
          for (let j = 0; j < i; j++) {
            let x = j + this.size * i;
            let y = i + this.size * j;
            let value = state.grid[x];
            state.grid[x] = state.grid[y];
            state.grid[y] = value;
          }
        }
      }

      // console.log(" after transpose", state.grid.map(charFromNum).join("")); // eslint-disable-line
    },
    getPermutationIndices(isRow = true) {
      let width = isRow ? this.sudoku.width : this.sudoku.height;
      let height = isRow ? this.sudoku.height : this.sudoku.width;
      let indices = [];
      for (let i = 0; i < width; i++) {
        indices.push(this.prng.shuffle(numbers(i * height, height)));
      }
      return flatten(this.prng.shuffle(indices));
    },
    randomRowPermutation(state) {
      if (isNull(state.rows)) {
        state.rows = this.getPermutationIndices(true);
      }
      // console.log("before row permute", state.grid.map(charFromNum).join(""), state.rows); // eslint-disable-line

      let oldGrid = state.grid.slice();
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          let x = j + this.size * i;
          let y = j + this.size * state.rows[i];
          state.grid[x] = oldGrid[y];
        }
      }

      // console.log(" after row permute", state.grid.map(charFromNum).join("")); // eslint-disable-line
    },
    randomColumnPermutation(state) {
      if (isNull(state.cols)) {
        state.cols = this.getPermutationIndices(false);
      }
      // console.log("before col permute", state.grid.map(charFromNum).join(""), state.cols); // eslint-disable-line

      let oldGrid = state.grid.slice();
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          let x = j + this.size * i;
          let y = state.cols[j] + this.size * i;
          state.grid[x] = oldGrid[y];
        }
      }

      // console.log(" after col permute", state.grid.map(charFromNum).join("")); // eslint-disable-line
    },
    // debug() {
    //   let grid = this.gridFromSquares(this.squares);
    //   let state = { squares: Array.from(grid), cols: [1,0,3,2,4,5,6,7,8] };
    //   this.randomColumnPermutation(state);
    //   this.squares = this.squaresFromGrid(this.gridFromSquares(state.grid));
    // },
    solve() {
      this.board = this.fullGrid.slice();
    },
    reset() {
      this.board = this.hintGrid.slice();
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

$small-width: 800px;
$border-board-small: 3px solid black;
$border-box-small: 2px solid darkgray;
$border-square-small: 1px solid lightgray;

.board {
  border-collapse: collapse;
  table-layout: fixed;
  vertical-align: middle;
  text-align: center;
  user-select: none;

  font-size: 2vw;
  @media (min-width: 1000px) {
    font-size: calc(2 * 10px);
  }
  &.size-16,
  &.size-15,
  &.size-14 {
    font-size: 3vw;
    @media (min-width: 1000px) {
      font-size: calc(3 * 10px);
    }
  }
  &.size-10,
  &.size-12 {
    font-size: 4vw;
    @media (min-width: 1000px) {
      font-size: calc(4 * 10px);
    }
  }
  &.size-9,
  &.size-8 {
    font-size: 5vw;
    @media (min-width: 1000px) {
      font-size: calc(5 * 10px);
    }
  }
  &.size-6,
  &.size-4 {
    font-size: 10vw;
    @media (min-width: 1000px) {
      font-size: calc(10 * 10px);
    }
  }

  .row:first-child .column {
    border-top: $border-board;
    @media screen and (max-width: $small-width) {
      border-top: $border-board-small;
    }
  }
  .row .column:first-child {
    border-left: $border-board;
    @media screen and (max-width: $small-width) {
      border-left: $border-board-small;
    }
  }
  .row:last-child .column {
    border-bottom: $border-board;
    @media screen and (max-width: $small-width) {
      border-bottom: $border-board-small;
    }
  }
  .row .column:last-child {
    border-right: $border-board;
    @media screen and (max-width: $small-width) {
      border-right: $border-board-small;
    }
  }
  .row.border-box-top {
    border-top: $border-box;
    @media screen and (max-width: $small-width) {
      border-top: $border-box-small;
    }
  }
  .row .column.border-box-left {
    border-left: $border-box;
    @media screen and (max-width: $small-width) {
      border-left: $border-box-small;
    }
  }

  .row {
    .column {
      border: $border-square;
      @media screen and (max-width: $small-width) {
        border: $border-square-small;
      }

      @media print {
        line-height: 0;
      }
    }
  }
}
</style>

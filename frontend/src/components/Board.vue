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

import { default as Sudoku, charFromNum, numFromChar } from "@/util/Sudoku.mjs";

import PRNG from "@/util/PRNG.mjs";

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
    displayCell(value) {
      return value === 0 ? "" : this.symbols[value - 1];
    },

    //
    // === GAME LOGIC ===
    //
    // 1 => 9! * 2 * 6^4 * 6^4 = 1218998108160 ~= 10^12
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

      // [
      //   this.randomRelabel,
      //   this.randomTranspose,
      //   this.randomRowPermutation,
      //   this.randomColumnPermutation
      // ].forEach(fn => {
      //   let state = {};
      //   [hintGrid, fullGrid].forEach(grid => {
      //     state.grid = grid;
      //     fn(state);
      //     grid = state.grid;
      //   });
      // });

      this.hintGrid = hintGrid;
      this.fullGrid = fullGrid;
      this.board = hintGrid.slice();
    },
    scaleDifficulty(size, difficultyQuotient, hintGrid, fullGrid) {
      let hintPositions = this.prng.shuffle(numbers(0, this.sudoku.cells));
      let hints = hintGrid.filter(c => c !== 0).length;
      let missingHints = Math.ceil(this.sudoku.cells / difficultyQuotient) - hints;

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
      state.labels = fallback(state.labels, shuffle(numbers(0, this.size)));
      // console.log("before relabel", this.gridFromSquares(state.grid), state.labels);

      for (let i = 0; i < this.sudoku.cells; i++) {
        let value = state.grid[i];
        if (value !== null) {
          state.grid[i] = state.labels[value];
        }
      }

      // console.log(" after relabel", this.gridFromSquares(state.grid));
    },
    randomTranspose(state) {
      state.transpose = fallback(state.transpose, rand() < 0.5);
      // console.log("before transpose", this.gridFromSquares(state.grid), state.transpose);

      if (state.transpose === true) {
        for (let i = 0; i < this.boardSize; i++) {
          for (let j = 0; j < i; j++) {
            let x = j + this.boardSize * i;
            let y = i + this.boardSize * j;
            let value = state.grid[x];
            state.grid[x] = state.grid[y];
            state.grid[y] = value;
          }
        }
      }

      // console.log(" after transpose", this.gridFromSquares(state.grid));
    },
    getPermutationIndices() {
      let indices = [];
      for (let i = 0; i < this.boxSize; i++) {
        indices.push(shuffle(numbers(i * this.boxSize, this.boxSize)));
      }
      return flatten(shuffle(indices));
    },
    randomRowPermutation(state) {
      if (isNull(state.rows)) {
        state.rows = this.getPermutationIndices();
      }
      // console.log("before row permute", this.gridFromSquares(state.grid), state.rows);

      let oldSquares = state.grid.slice();
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          let x = j + this.boardSize * i;
          let y = j + this.boardSize * state.rows[i];
          state.grid[x] = oldSquares[y];
        }
      }

      // console.log("after row permute", this.gridFromSquares(state.grid));
    },
    randomColumnPermutation(state) {
      if (isNull(state.cols)) {
        state.cols = this.getPermutationIndices();
      }
      // console.log("before col permute", this.gridFromSquares(state.grid), state.cols);

      let oldSquares = state.grid.slice();
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          let x = j + this.boardSize * i;
          let y = state.cols[j] + this.boardSize * i;
          state.grid[x] = oldSquares[y];
        }
      }

      // console.log("after col permute", this.gridFromSquares(state.grid));
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

.board {
  border-collapse: collapse;
  table-layout: fixed;
  vertical-align: middle;
  text-align: center;
  user-select: none;

  font-size: 2vw;
  @media screen and (min-width: 1000px) {
    font-size: calc(2 * 10px);
  }
  &.size-18,
  &.size-16,
  &.size-15,
  &.size-14 {
    font-size: 3.2vw;
    @media screen and (min-width: 1000px) {
      font-size: calc(3.2 * 10px);
    }
  }
  &.size-12,
  &.size-10,
  &.size-9,
  &.size-8 {
    font-size: 5vw;
    @media screen and (min-width: 1000px) {
      font-size: calc(5 * 10px);
    }
  }
  &.size-6,
  &.size-4 {
    font-size: 10vw;
    @media screen and (min-width: 1000px) {
      font-size: calc(10 * 10px);
    }
  }

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
      border: $border-square;
      line-height: 0;
    }
  }
}
</style>

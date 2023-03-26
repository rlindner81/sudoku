<template>
  <div class="sudoku">
    <header>
      <nav class="navbar navbar-dark bg-dark">
        <div class="container d-print-none">
          <span class="navbar-brand">{{ difficulty }} Sudoku {{ seed }}</span>
        </div>
      </nav>
      <!-- <button @click="$refs.board.debug()">Debug</button> -->
    </header>

    <main role="main" class="container">
      <div class="row d-none d-print-block py-4">
        <div class="col">
          <h1>{{ difficulty }} Sudoku {{ seed }}</h1>
        </div>
      </div>

      <div class="pb-2 pt-3 d-print-none">
        <div class="row">
          <div class="col">
            <button
              type="button"
              class="btn btn-primary w-100 text-white"
              @click="onClickNew()"
            >
              New
            </button>
          </div>
          <div class="col">
            <select v-model="size" class="btn btn-primary w-100 text-white">
              <option v-for="(s, i) in sizes" :key="i" :value="s">
                Size {{ s }}
              </option>
            </select>
          </div>
          <div class="col">
            <select
              v-model="difficulty"
              class="btn btn-primary w-100 text-white"
            >
              <option v-for="(d, i) in difficultyKeys" :key="i" :value="d">
                {{ d }}
              </option>
            </select>
          </div>
          <div class="col">
            <select v-model="symbols" class="btn btn-primary w-100 text-white">
              <option v-for="(s, i) in symbolsKeys" :key="i" :value="s">
                {{ s }}
              </option>
            </select>
          </div>
          <div class="col">
            <button
              type="button"
              class="btn btn-primary w-100 text-white"
              @click="$refs.board.solve()"
            >
              Solve
            </button>
          </div>
          <div class="col">
            <button
              type="button"
              class="btn btn-primary w-100 text-white"
              @click="$refs.board.reset()"
            >
              Reset
            </button>
          </div>
          <div class="col">
            <button
              type="button"
              class="btn btn-primary w-100 text-white"
              onclick="window.print();return false;"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      <div class="row py-2">
        <div class="col">
          <div class="square-outer">
            <div class="square-inner">
              <Board
                ref="board"
                class="board"
                :size="size"
                :seed="seed"
                :grids="gridspack[size]"
                :difficulty-quotient="difficulties[difficulty]"
                :symbols="symbolspack[symbols]"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import { isNull, fallback } from "@/util/helper.mjs";

import gridspack from "@/data/gridspack.json";
import difficulties from "@/data/difficulties.json";
// https://unicode-table.com/en/blocks/miscellaneous-symbols-and-pictographs/
// https://emojipedia.org/nature/
import symbolspack from "@/data/symbolspack.json";

const DEFAULT_SIZE = 9;
const DEFAULT_DIFFICULTY = "hard";
const DEFAULT_SYMBOLS = "alphanum";

const SEED_RE = /^\d{8}$/;

const queryChanged = (query, newQuery) => {
  return !["size", "difficulty", "symbols", "seed"].reduce(
    (result, field) =>
      result &&
      query[field] &&
      newQuery[field] &&
      query[field] === newQuery[field],
    true
  );
};

export default {
  name: "Sudoku",
  components: {
    Board,
  },
  data() {
    return {
      gridspack,
      difficulties,
      symbolspack,
      size: null,
      difficulty: null,
      symbols: null,
      seed: null,
    };
  },
  computed: {
    sizes() {
      return Object.keys(gridspack).map((size) => parseInt(size));
    },
    difficultyKeys() {
      return Object.keys(difficulties);
    },
    symbolsKeys() {
      return Object.keys(symbolspack);
    },
  },
  watch: {
    size: function (newVal) {
      this.updateQuery({ size: newVal });
    },
    difficulty: function (newVal) {
      this.updateQuery({ difficulty: newVal });
    },
    symbols: function (newVal) {
      this.updateQuery({ symbols: newVal });
    },
  },
  created() {
    let query = Object.assign({}, this.$route.query);

    let size = parseInt(query.size);
    query.size =
      !isNaN(size) && this.sizes.indexOf(size) !== -1 ? size : DEFAULT_SIZE;
    this.size = query.size;

    let difficulty = query.difficulty;
    query.difficulty =
      !isNull(difficulty) && this.difficultyKeys.indexOf(difficulty) !== -1
        ? difficulty
        : DEFAULT_DIFFICULTY;
    this.difficulty = query.difficulty;

    let symbols = query.symbols;
    query.symbols =
      !isNull(symbols) && this.symbolsKeys.indexOf(symbols) !== -1
        ? symbols
        : DEFAULT_SYMBOLS;
    this.symbols = query.symbols;

    let seed = query.seed;
    query.seed =
      !isNull(seed) && seed.match(SEED_RE) ? seed : this.randomSeed();
    this.seed = query.seed;

    if (queryChanged(this.$route.query, query)) {
      this.$router.replace({ query });
    }
  },
  methods: {
    updateQuery(options) {
      options = fallback(options, {});
      const query = {
        size: fallback(options.size, this.size),
        difficulty: fallback(options.difficulty, this.difficulty),
        symbols: fallback(options.symbols, this.symbols),
        seed: fallback(options.seed, this.seed),
      };
      if (queryChanged(this.$route.query, query)) {
        this.$router.push({ query });
      }
    },
    onClickNew() {
      this.seed = this.randomSeed();
      this.updateQuery();
    },
    randomSeed() {
      return Math.random().toString().substring(2, 10);
    },
  },
};
</script>

<style lang="scss">
@media print {
  body,
  .container {
    min-width: 0 !important;
    max-width: none !important;
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .col {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

.sudoku {
  nav span,
  h1,
  select {
    text-transform: capitalize;
  }

  .square-outer {
    width: 100%;
    padding-top: 100%;
    position: relative;

    .square-inner {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;

      .board {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

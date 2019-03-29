<template>
  <div class="home">
    <h1>{{ difficulty }} Sudoku {{ seed }}</h1>
    <div class="input-lane">
      <button @click="onClickNew()">New</button>
      <select v-model="size">
        <option v-for="(s, i) in sizes" :key="i" :value="s"
          >Size {{ s }}</option
        >
      </select>
      <select v-model="difficulty">
        <option v-for="(d, i) in difficulties" :key="i" :value="d">{{
          d
        }}</option>
      </select>
      <select v-model="symbols">
        <option v-for="(s, i) in symbolpacknames" :key="i" :value="s">
          {{ s }}</option
        >
      </select>
      <button @click="$refs.board.solve()">Solve</button>
      <button @click="$refs.board.reset()">Reset</button>
      <button onclick="window.print();return false;">Print</button>
      <!-- <button @click="$refs.board.debug()">Debug</button> -->
    </div>
    <div class="square-outer">
      <div class="square-inner">
        <Board
          ref="board"
          class="board"
          :difficulty="difficulty"
          :symbols="symbolspack[symbols]"
          :seed="seed"
          :box-size="size"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import { fallback } from "@/helper";

import gamespack from "@/data/gamespack.json";
// https://unicode-table.com/en/blocks/miscellaneous-symbols-and-pictographs/
import symbolspack from "@/data/symbolspack.json";

export default {
  name: "Sudoku",
  components: {
    Board
  },
  data() {
    return {
      symbolspack: symbolspack,
      size: null,
      difficulty: null,
      symbols: null,
      seed: null
    };
  },
  computed: {
    difficulties() {
      return this.size === null
        ? null
        : Object.keys(gamespack[`size-${this.size}`].difficulties);
    },
    symbolpacknames() {
      return Object.keys(symbolspack);
    },
    sizes() {
      return [2, 3, 4];
    }
  },
  watch: {
    size: function(newVal) {
      this.updateQuery({ size: newVal });
    },
    difficulty: function(newVal) {
      this.updateQuery({ difficulty: newVal });
    },
    symbols: function(newVal) {
      this.updateQuery({ symbols: newVal });
    }
  },
  created() {
    let query = Object.assign({}, this.$route.query);

    query.size = fallback(query.size, this.sizes[1]);
    this.size = parseInt(query.size);

    query.difficulty = fallback(query.difficulty, this.difficulties[1]);
    this.difficulty = query.difficulty;

    query.symbols = fallback(query.symbols, this.symbolpacknames[0]);
    this.symbols = query.symbols;

    query.seed = fallback(query.seed, this.randomSeed());
    this.seed = query.seed;

    this.$router.replace({ query });
  },
  methods: {
    updateQuery(options) {
      options = fallback(options, {});
      this.$router.push({
        query: {
          size: fallback(options.size, this.size),
          difficulty: fallback(options.difficulty, this.difficulty),
          symbols: fallback(options.symbols, this.symbols),
          seed: fallback(options.seed, this.seed)
        }
      });
    },
    onClickNew() {
      this.seed = this.randomSeed();
      this.updateQuery();
    },
    randomSeed() {
      return Math.random()
        .toString()
        .substring(2, 10);
    }
  }
};
</script>

<style lang="scss">
$size: 60rem;
$accent-color: green;
$accent-font-color: white;

.home {
  margin: 0 auto;
  max-width: $size;

  > * {
    margin: 2rem 0;
  }

  h1,
  select {
    text-transform: capitalize;
  }

  .input-lane {
    margin: -0.5rem;
    button,
    select {
      margin: 0.5rem;
      padding: 0.125rem 1rem;
      background: rgba($accent-color, 0.75);
      width: 8rem;
      color: $accent-font-color;
      box-shadow: none;
      border: 1px solid darken($accent-color, 10%);
      border-radius: 3px;
      font-weight: 500;
      font-size: 3vw;

      @media screen and (min-width: 600px) {
        font-size: calc(3 * 6px);
      }
    }

    @media print {
      display: none;
    }
  }

  .square-outer {
    max-width: $size;
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

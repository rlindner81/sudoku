<template>
  <div class="home">
    <h1>Play Sudoku</h1>
    <div class="input-lane">
      <select v-model="difficulty">
        <option v-for="(d, i) in difficulties" :value="d" :key="i">{{d}}</option>
      </select>
      <button @click="onClickRandomize()">Randomize</button>
      <button @click="$refs.board.solve()">Solve</button>
      <button @click="$refs.board.reset()">Reset</button>
      <button onclick="window.print();return false;">Print</button>
      <!-- <button @click="$refs.board.debug()">Debug</button> -->
    </div>
    <div class="square-outer">
      <div class="square-inner">
        <Board class="board" ref="board" :games="games" :seed="seed"/>
      </div>
    </div>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import games from "@/data/games.json";
import { fallback } from "@/helper";

const defaultDifficulty = "hard";
const defaultSeed = String(Math.random()).substring(2, 10);

export default {
  name: "Sudoku",
  components: {
    Board
  },
  data() {
    return {
      difficulties: null,
      games: null,
      difficulty: null,
      seed: null
    };
  },
  created() {
    let query = Object.assign({}, this.$route.query);

    query.difficulty = fallback(query.difficulty, defaultDifficulty);
    query.seed = fallback(query.seed, defaultSeed);
    this.$router.replace({ query });

    this.difficulty = query.difficulty;
    this.seed = query.seed;
    this.difficulties = Object.keys(games);
    this.games = games[this.difficulty];
  },
  watch: {
    difficulty: function(newVal) {
      this.games = games[newVal];
      this.$router.push({
        query: { difficulty: newVal, seed: this.seed }
      });
    }
  },
  methods: {
    onClickRandomize() {
      this.seed = String(Math.random()).substring(2, 10);
      this.$router.push({
        query: { difficulty: this.difficulty, seed: this.seed }
      });
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

  .input-lane {
    button,
    select {
      padding: 0.125rem 1rem;
      background: rgba($accent-color, 0.75);
      color: $accent-font-color;
      box-shadow: none;
      border: 1px solid darken($accent-color, 10%);
      border-radius: 3px;
      font-weight: 500;
      font-size: 16px;

      &:not(:first-child) {
        margin-left: 1rem;
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

<template>
  <div class="home">
    <h1>{{ difficulty }} Sudoku {{ seed }}</h1>
    <div class="input-lane">
      <select v-model="difficulty">
        <option v-for="(d, i) in difficulties" :key="i" :value="d">
          {{ d }}
        </option>
      </select>
      <button @click="onClickNew()">
        New
      </button>
      <button @click="$refs.board.solve()">
        Solve
      </button>
      <button @click="$refs.board.reset()">
        Reset
      </button>
      <button onclick="window.print();return false;">
        Print
      </button>
      <!-- <button @click="$refs.board.debug()">Debug</button> -->
    </div>
    <div class="square-outer">
      <div class="square-inner">
        <Board ref="board" class="board" :games="games" :seed="seed" />
      </div>
    </div>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import games from "@/data/games.json";
import { fallback } from "@/helper";

const difficulties = Object.keys(games);

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
  watch: {
    difficulty: function(newVal) {
      this.games = games[newVal];
      this.$router.push({
        query: { difficulty: newVal, seed: this.seed }
      });
    }
  },
  created() {
    let query = Object.assign({}, this.$route.query);

    query.difficulty = fallback(query.difficulty, difficulties[1]);
    query.seed = fallback(query.seed, this.randomSeed());
    this.$router.replace({ query });

    this.difficulty = query.difficulty;
    this.seed = query.seed;
    this.difficulties = difficulties;
    this.games = games[this.difficulty];
  },
  methods: {
    onClickNew() {
      this.seed = this.randomSeed();
      this.$router.push({
        query: { difficulty: this.difficulty, seed: this.seed }
      });
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

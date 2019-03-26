<template>
  <div class="home">
    <h1>Play Sudoku</h1>
    <select v-model="difficulty">
        <option v-for="(d, i) in difficulties" :value="d" :key="i">{{d}}</option>
    </select>
    <button @click="$refs.board.randomize(games)">Randomize</button>
    <button @click="$refs.board.solve()">Solve</button>
    <button @click="$refs.board.reset()">Reset</button>
    <button onclick="window.print();return false;">Print</button>
    <div class="square-outer">
      <div class="square-inner">
        <Board class="board" ref="board" :games="games" />
      </div>
    </div>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import games from "@/games.json";
import { seedRand } from "@/helper";

export default {
  name: "Home",
  components: {
    Board
  },
  data() {
    return {
      difficulties: null,
      difficulty: null,
      games: null
    }
  },
  created() {
    seedRand("lala");
    this.difficulties = Object.keys(games);
    this.difficulty = this.difficulties[0];
    this.games = games[this.difficulty];
  },
  watch: {
    difficulty: function(newVal) {
      this.games = games[newVal];
    }
  }
};
</script>

<style lang="scss">
$size: 60rem;
$print-size: 400mm;

.home {
  margin: 0 auto;
  max-width: $size;

  > * {
    margin: 2rem 0;
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

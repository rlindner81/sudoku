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
    <Board class="board" ref="board" :games="games" />
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

.home {
  margin: 0 auto;
  width: $size;

  > * {
    margin: 2rem 0;
  }

  .board {
    width: $size;
    height: $size;
  }
}
</style>

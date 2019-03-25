<template>
  <div class="home">
    <h1>Play Sudoku</h1>
    <select v-model="difficulty">
        <option v-for="(d, i) in difficulties" :value="d" :key="i">{{d}}</option>
    </select>
    <Board class="board" :difficulty="difficulty" />
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import games from "@/games.json";

export default {
  name: "Home",
  components: {
    Board
  },
  data() {
    return {
      difficulties: null,
      difficulty: null
    }
  },
  created() {
    this.difficulties = Object.keys(games);
    this.difficulty = this.difficulties[0];
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
